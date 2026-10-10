type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): { json(body: unknown): void };
};

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function getHeader(req: VercelRequest, name: string) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getClientKey(req: VercelRequest) {
  return (
    getHeader(req, "x-forwarded-for")?.split(",")[0]?.trim() ||
    getHeader(req, "x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function hasAllowedOrigin(req: VercelRequest) {
  const origin = getHeader(req, "origin");
  if (!origin) return true;

  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (allowedOrigin) return origin === allowedOrigin;

  const host = getHeader(req, "host");
  return host ? origin === `https://${host}` || origin === `http://${host}` : false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!hasAllowedOrigin(req)) {
    return res.status(403).json({ error: "origin_not_allowed" });
  }

  if (isRateLimited(getClientKey(req))) {
    return res.status(429).json({ error: "rate_limited" });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return res.status(500).json({ error: "email_not_configured" });
  }

  const body = (req.body ?? {}) as ContactPayload;
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const message = clean(body.message, 4000);

  if (!name || !EMAIL_PATTERN.test(email) || message.length < 10) {
    return res.status(400).json({ error: "invalid_contact_form" });
  }

  const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        from_name: name,
        from_email: email,
        reply_to: email,
        message,
        to_name: "Riyansyah",
      },
    }),
  });

  if (!emailjsResponse.ok) {
    return res.status(502).json({ error: "email_send_failed" });
  }

  return res.status(200).json({ ok: true });
}
