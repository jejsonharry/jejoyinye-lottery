import { createClient } from "https://esm.sh/@supabase/supabase-js@2.116.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY") || "";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const ALLOWED_ORIGINS = new Set([
  "https://jolslottery.com",
  "https://www.jolslottery.com"
]);

const ALLOWED_TURNSTILE_HOSTNAMES = new Set([
  "jolslottery.com",
  "www.jolslottery.com"
]);

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://jolslottery.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json"
  };
}

function json(status: number, body: Record<string, unknown>, origin: string | null) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}

function clean(value: unknown, max = 1000) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || forwarded || "";
}

async function hashClientKey(req: Request) {
  const ip = getClientIp(req) || "unknown";
  const agent = req.headers.get("user-agent") || "unknown";
  const input = new TextEncoder().encode(`${ip}|${agent}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(req: Request, token: unknown, expectedAction: string) {
  if (!TURNSTILE_SECRET_KEY) {
    return { ok: false, serviceUnavailable: true };
  }

  const responseToken = clean(token, 2049);
  if (!responseToken || responseToken.length > 2048) {
    return { ok: false, serviceUnavailable: false };
  }

  const form = new FormData();
  form.append("secret", TURNSTILE_SECRET_KEY);
  form.append("response", responseToken);

  const remoteIp = getClientIp(req);
  if (remoteIp) form.append("remoteip", remoteIp);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { ok: false, serviceUnavailable: true };
    }

    const result = await response.json();
    const hostname = String(result?.hostname || "").toLowerCase();
    const action = String(result?.action || "");

    const valid = result?.success === true
      && ALLOWED_TURNSTILE_HOSTNAMES.has(hostname)
      && action === expectedAction;

    return { ok: valid, serviceUnavailable: false };
  } catch (_) {
    return { ok: false, serviceUnavailable: true };
  }
}

async function consumeRateLimit(action: string, clientKey: string, limit: number, windowSeconds: number) {
  const now = new Date();
  const { data, error } = await supabase
    .from("form_rate_limits")
    .select("request_count,window_started_at")
    .eq("action", action)
    .eq("client_key", clientKey)
    .maybeSingle();

  if (error) throw error;

  const windowStart = data?.window_started_at ? new Date(data.window_started_at) : null;
  const expired = !windowStart || (now.getTime() - windowStart.getTime()) / 1000 >= windowSeconds;

  if (expired) {
    const { error: upsertError } = await supabase.from("form_rate_limits").upsert({
      action,
      client_key: clientKey,
      window_started_at: now.toISOString(),
      request_count: 1
    });
    if (upsertError) throw upsertError;
    return { allowed: true, remaining: limit - 1 };
  }

  const count = Number(data?.request_count || 0);
  if (count >= limit) return { allowed: false, remaining: 0 };

  const { error: updateError } = await supabase
    .from("form_rate_limits")
    .update({ request_count: count + 1 })
    .eq("action", action)
    .eq("client_key", clientKey);
  if (updateError) throw updateError;

  return { allowed: true, remaining: Math.max(0, limit - count - 1) };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json(405, { ok: false, error: "Method not allowed" }, origin);
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return json(403, { ok: false, error: "Origin not allowed" }, origin);

  try {
    const body = await req.json();
    const action = clean(body?.action, 30);
    const payload = body?.payload || {};

    if (clean(body?.website, 200)) return json(200, { ok: true }, origin);

    if (action !== "agent" && action !== "contact") {
      return json(400, { ok: false, error: "Unsupported action" }, origin);
    }

    const turnstile = await verifyTurnstile(req, body?.turnstile_token, action);
    if (!turnstile.ok) {
      if (turnstile.serviceUnavailable) {
        return json(503, { ok: false, error: "Security verification is temporarily unavailable. Please try again shortly." }, origin);
      }
      return json(403, { ok: false, error: "Security verification failed or expired. Please verify again." }, origin);
    }

    const clientKey = await hashClientKey(req);

    if (action === "agent") {
      const rate = await consumeRateLimit("agent", clientKey, 3, 1800);
      if (!rate.allowed) return json(429, { ok: false, error: "Too many applications. Please wait and try again later." }, origin);

      const full_name = clean(payload.full_name, 120);
      const phone = clean(payload.phone, 30);
      const email = clean(payload.email, 180);
      const nin = clean(payload.nin, 20).replace(/\D/g, "");
      const state = clean(payload.state, 80);
      const city = clean(payload.city, 100);
      const business_address = clean(payload.business_address, 500);
      const bank_name = clean(payload.bank_name, 120);
      const account_name = clean(payload.account_name, 160);
      const account_number = clean(payload.account_number, 20).replace(/\D/g, "");
      const lottery_experience = clean(payload.lottery_experience, 50) || null;
      const additional_information = clean(payload.additional_information, 1200) || null;

      if (full_name.length < 3 || !/^\d{10,14}$/.test(phone.replace(/\D/g, "")) || !/^\d{11}$/.test(nin) || !state || !city || business_address.length < 5 || !bank_name || account_name.length < 3 || !/^\d{10}$/.test(account_number)) {
        return json(400, { ok: false, error: "Please check the application details and try again." }, origin);
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json(400, { ok: false, error: "Please enter a valid email address." }, origin);
      }

      const { error } = await supabase.from("agent_applications").insert([{ full_name, phone, email: email || null, nin, state, city, business_address, bank_name, account_name, account_number, lottery_experience, additional_information, status: "pending" }]);
      if (error) throw error;
      return json(200, { ok: true }, origin);
    }

    const rate = await consumeRateLimit("contact", clientKey, 5, 900);
    if (!rate.allowed) return json(429, { ok: false, error: "Too many messages. Please wait and try again later." }, origin);

    const name = clean(payload.name, 120);
    const phone = clean(payload.phone, 30);
    const email = clean(payload.email, 180);
    const subject = clean(payload.subject, 160) || null;
    const message = clean(payload.message, 3000);

    if (name.length < 2 || !/^\d{10,14}$/.test(phone.replace(/\D/g, "")) || message.length < 2) {
      return json(400, { ok: false, error: "Please check your message details and try again." }, origin);
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(400, { ok: false, error: "Please enter a valid email address." }, origin);
    }

    const { error } = await supabase.from("messages").insert([{ name, phone, email: email || null, subject, message }]);
    if (error) throw error;
    return json(200, { ok: true }, origin);
  } catch (_) {
    return json(500, { ok: false, error: "Unable to process your request right now. Please try again shortly." }, origin);
  }
});
