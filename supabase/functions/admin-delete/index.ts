const ALLOWED_ORIGINS = new Set([
  "https://jolslottery.com",
  "https://www.jolslottery.com",
]);

const RESOURCE_TABLES: Record<string, string> = {
  agent_application: "agent_applications",
  message: "messages",
};

function getSecretKey(): string {
  const currentKeys = Deno.env.get("SUPABASE_SECRET_KEYS");

  if (currentKeys) {
    try {
      const keys = JSON.parse(currentKeys);
      if (keys?.default) return String(keys.default);
    } catch {
      // Fall through to the legacy service-role key.
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://jolslottery.com";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed." }, 405, origin);
  }

  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse({ ok: false, error: "Origin not allowed." }, 403, origin);
  }

  try {
    const projectUrl = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
    const publicKey = Deno.env.get("SUPABASE_ANON_KEY") ||
      request.headers.get("apikey") || "";
    const secretKey = getSecretKey();
    const authorization = request.headers.get("Authorization") || "";

    if (!projectUrl || !publicKey || !secretKey || !authorization.startsWith("Bearer ")) {
      return jsonResponse(
        { ok: false, error: "Authenticated admin access is required." },
        401,
        origin,
      );
    }

    const userResponse = await fetch(`${projectUrl}/auth/v1/user`, {
      headers: {
        apikey: publicKey,
        Authorization: authorization,
      },
    });

    if (!userResponse.ok) {
      return jsonResponse(
        { ok: false, error: "Your admin session is no longer valid." },
        401,
        origin,
      );
    }

    const adminResponse = await fetch(`${projectUrl}/rest/v1/rpc/is_admin`, {
      method: "POST",
      headers: {
        apikey: publicKey,
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    const isAdmin = adminResponse.ok && await adminResponse.json() === true;

    if (!isAdmin) {
      return jsonResponse(
        { ok: false, error: "Administrator permission is required." },
        403,
        origin,
      );
    }

    const body = await request.json();
    const resource = String(body?.resource || "");
    const id = String(body?.id || "").trim();
    const table = RESOURCE_TABLES[resource];

    if (!table || !/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
      return jsonResponse(
        { ok: false, error: "Invalid delete request." },
        400,
        origin,
      );
    }

    const query = new URLSearchParams({
      id: `eq.${id}`,
      select: "id",
    });
    const headers: Record<string, string> = {
      apikey: secretKey,
      Prefer: "return=representation",
    };

    if (secretKey.startsWith("eyJ")) {
      headers.Authorization = `Bearer ${secretKey}`;
    }

    const deleteResponse = await fetch(
      `${projectUrl}/rest/v1/${table}?${query}`,
      {
        method: "DELETE",
        headers,
      },
    );

    const responseText = await deleteResponse.text();
    let deletedRows: Array<{ id: unknown }> = [];

    if (responseText) {
      try {
        deletedRows = JSON.parse(responseText);
      } catch {
        deletedRows = [];
      }
    }

    if (!deleteResponse.ok) {
      console.error("Admin delete failed", deleteResponse.status, responseText);
      return jsonResponse(
        { ok: false, error: "The database rejected the delete request." },
        500,
        origin,
      );
    }

    if (!Array.isArray(deletedRows) || deletedRows.length !== 1) {
      return jsonResponse(
        { ok: false, error: "The record was not found or was already deleted." },
        404,
        origin,
      );
    }

    return jsonResponse(
      { ok: true, deleted: 1, resource, id },
      200,
      origin,
    );
  } catch (error) {
    console.error("Secure admin delete failed", error);
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Delete failed.",
      },
      500,
      origin,
    );
  }
});
