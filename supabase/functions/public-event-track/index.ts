import { createClient } from "https://esm.sh/@supabase/supabase-js@2.116.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const ALLOWED_ORIGINS = new Set([
  "https://jolslottery.com",
  "https://www.jolslottery.com"
]);

const ALLOWED_EVENTS = new Set([
  "page_view",
  "play_online_click",
  "online_app_download",
  "agent_application_start",
  "agent_application_submit",
  "whatsapp_contact_click",
  "whatsapp_community_click",
  "facebook_community_click",
  "result_share_click",
  "prediction_range_apply"
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

function clean(value: unknown, max = 300) {
  return String(value ?? "").trim().slice(0, max);
}

function safeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  const allowedKeys = ["link_text", "game_name", "lottery", "lottery_scope", "source", "campaign"];
  const output: Record<string, string> = {};
  for (const key of allowedKeys) {
    if (key in source) output[key] = clean(source[key], 120);
  }
  return output;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json(405, { ok: false, error: "Method not allowed" }, origin);
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return json(403, { ok: false, error: "Origin not allowed" }, origin);

  try {
    const body = await req.json();
    const event_name = clean(body?.event_name, 60);
    if (!ALLOWED_EVENTS.has(event_name)) {
      return json(400, { ok: false, error: "Unsupported event" }, origin);
    }

    const page_path = clean(body?.page_path, 180);
    const visitor_id = clean(body?.visitor_id, 80);
    const session_id = clean(body?.session_id, 80);

    if (!visitor_id || !session_id) {
      return json(400, { ok: false, error: "Missing analytics identifiers" }, origin);
    }

    const { error } = await supabase.from("site_events").insert([{
      event_name,
      page_path: page_path || null,
      visitor_id,
      session_id,
      metadata: safeMetadata(body?.metadata)
    }]);

    if (error) throw error;
    return json(200, { ok: true }, origin);
  } catch (_) {
    return json(500, { ok: false, error: "Unable to record event" }, origin);
  }
});