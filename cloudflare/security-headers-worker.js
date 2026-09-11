export default {
  async fetch(request) {
    const response = await fetch(request);
    const headers = new Headers(response.headers);
    const url = new URL(request.url);

    headers.set("Content-Security-Policy", [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://iedgznzmmfkdhgmkghwt.supabase.co wss://iedgznzmmfkdhgmkghwt.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join("; "));

    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()"
    );
    headers.set("Strict-Transport-Security", "max-age=31536000");

    const privateAdminPaths = new Set([
      "/admin",
      "/admin.html",
      "/login",
      "/login.html",
      "/forgot-password",
      "/forgot-password.html",
      "/reset-password",
      "/reset-password.html"
    ]);

    if (privateAdminPaths.has(url.pathname)) {
      headers.set("Cache-Control", "no-store, max-age=0");
      headers.set("Pragma", "no-cache");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
