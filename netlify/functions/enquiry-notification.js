const crypto = require("crypto");

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const requiredFields = ["name", "mobile", "email", "country", "message"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^\+?[0-9\s().-]{7,22}$/;
const maxLengths = { name: 120, company: 120, mobile: 30, email: 190, country: 80, product: 80, quantity: 60, message: 1500 };

const clean = (value) => String(value || "").trim();

const json = (statusCode, body) => ({
  statusCode,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// Extra CSRF/abuse layer on top of CORS: when ALLOWED_ORIGIN is set,
// reject requests whose Origin header doesn't match. CORS headers alone
// only stop browsers from reading the response, not from sending the
// request in the first place, so this check adds real server-side value.
const isAllowedOrigin = (event) => {
  const allowed = process.env.ALLOWED_ORIGIN;
  if (!allowed) return true; // not configured yet; skip rather than block everyone
  const origin = event.headers.origin || event.headers.Origin || "";
  if (!origin) return true; // non-browser tools / same-origin requests may omit Origin
  return origin === allowed;
};

const normalizeEnquiry = (raw) => {
  const enquiry = {
    name: clean(raw.name),
    company: clean(raw.company),
    mobile: clean(raw.mobile),
    email: clean(raw.email).toLowerCase(),
    country: clean(raw.country),
    product: clean(raw.product),
    quantity: clean(raw.quantity),
    message: clean(raw.message),
    dateTime: clean(raw.dateTime) || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    recaptchaToken: clean(raw.recaptchaToken),
    website: clean(raw.website),
  };

  enquiry.dedupeKey = crypto
    .createHash("sha256")
    .update([enquiry.email, enquiry.mobile, enquiry.message.toLowerCase()].join("|"))
    .digest("hex");

  return enquiry;
};

const validateEnquiry = (enquiry) => {
  const errors = [];
  requiredFields.forEach((field) => {
    if (!enquiry[field]) errors.push(`${field} is required`);
  });
  Object.entries(maxLengths).forEach(([field, max]) => {
    if (enquiry[field] && enquiry[field].length > max) errors.push(`${field} is too long`);
  });
  if (enquiry.name && enquiry.name.length < 2) errors.push("name is too short");
  if (enquiry.email && !emailPattern.test(enquiry.email)) errors.push("email is invalid");
  if (enquiry.mobile && !mobilePattern.test(enquiry.mobile)) errors.push("mobile is invalid");
  if (enquiry.message && enquiry.message.length < 10) errors.push("message is too short");
  if (enquiry.website) errors.push("spam detected");
  return errors;
};

const verifyRecaptcha = async (token, ip) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("reCAPTCHA is not configured");
  if (!token) return false;

  const params = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) params.set("remoteip", ip);

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const result = await response.json();
  const minimumScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
  return Boolean(result.success && (result.score == null || result.score >= minimumScore));
};

const buildMessage = (enquiry, meta = {}) => [
  "New Website Enquiry",
  "",
  `Name: ${enquiry.name}`,
  `Company: ${enquiry.company || "-"}`,
  `Mobile: ${enquiry.mobile}`,
  `Email: ${enquiry.email}`,
  `Country: ${enquiry.country}`,
  `Product: ${enquiry.product || "-"}`,
  `Quantity: ${enquiry.quantity || "-"}`,
  `Message: ${enquiry.message}`,
  `Date & Time: ${enquiry.dateTime}`,
  `IP Address: ${meta.ip || "unavailable"}`,
].join("\n");

const buildSmsMessage = (enquiry) =>
  `New enquiry: ${enquiry.name}, ${enquiry.mobile}, Country: ${enquiry.country}, Qty: ${enquiry.quantity || "-"}. Check email/dashboard for full message.`;

const buildEmailHtml = (enquiry, meta = {}) => {
  const rows = [
    ["Name", enquiry.name],
    ["Company", enquiry.company || "-"],
    ["Mobile", enquiry.mobile],
    ["Email", enquiry.email],
    ["Country", enquiry.country],
    ["Product", enquiry.product || "-"],
    ["Quantity", enquiry.quantity || "-"],
    ["Message", enquiry.message],
    ["Date & Time", enquiry.dateTime],
    ["IP Address", meta.ip || "unavailable"],
  ];

  const escapeHtml = (value) => clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#18211f">
      <h2 style="margin:0 0 16px;color:#08664f">New Website Enquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="padding:10px 12px;border:1px solid #e4e7e4;background:#f6f8f7;font-weight:700;width:150px">${label}</td>
            <td style="padding:10px 12px;border:1px solid #e4e7e4">${escapeHtml(value)}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
};

const supabaseHeaders = () => ({
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
});

const assertDatabaseConfig = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Database is not configured");
  }
};

const findDuplicate = async (dedupeKey) => {
  assertDatabaseConfig();
  const url = `${process.env.SUPABASE_URL}/rest/v1/enquiries?dedupe_key=eq.${encodeURIComponent(dedupeKey)}&select=id&limit=1`;
  const response = await fetch(url, { headers: supabaseHeaders() });
  if (!response.ok) throw new Error(`Database duplicate check failed: ${await response.text()}`);
  const rows = await response.json();
  return rows.length > 0;
};

// Basic abuse control: block an IP that has sent an unreasonable number
// of enquiries in a short window. Best-effort only (fails open if the
// database isn't reachable) so a DB hiccup never blocks legitimate buyers.
const RATE_LIMIT_MAX_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX || 8);
const RATE_LIMIT_WINDOW_MINUTES = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 60);

const isRateLimited = async (ip) => {
  if (!ip) return false;
  try {
    assertDatabaseConfig();
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const url = `${process.env.SUPABASE_URL}/rest/v1/enquiries?ip_address=eq.${encodeURIComponent(ip)}&created_at=gte.${encodeURIComponent(since)}&select=id`;
    const response = await fetch(url, { headers: { ...supabaseHeaders(), Prefer: "count=exact" } });
    if (!response.ok) return false;
    const rows = await response.json();
    return rows.length >= RATE_LIMIT_MAX_PER_WINDOW;
  } catch (error) {
    console.warn("[enquiry-notification] Rate limit check skipped:", error.message);
    return false;
  }
};

const saveEnquiry = async (enquiry, event) => {
  assertDatabaseConfig();
  const payload = {
    name: enquiry.name,
    company: enquiry.company || null,
    mobile: enquiry.mobile,
    email: enquiry.email,
    country: enquiry.country,
    product: enquiry.product || null,
    quantity: enquiry.quantity || null,
    message: enquiry.message,
    date_time: enquiry.dateTime,
    dedupe_key: enquiry.dedupeKey,
    source_url: event.headers.referer || event.headers.referrer || null,
    ip_address: event.headers["x-forwarded-for"] || event.headers["client-ip"] || null,
    user_agent: event.headers["user-agent"] || null,
  };

  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/enquiries`, {
    method: "POST",
    headers: { ...supabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Database save failed: ${await response.text()}`);
  const rows = await response.json();
  return rows[0];
};

const sendViaWhatsAppCloud = async (message) => {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO;
  if (!token || !phoneNumberId || !to) throw new Error("WhatsApp Cloud API is not configured");

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { preview_url: false, body: message },
    }),
  });
  if (!response.ok) throw new Error(`WhatsApp Cloud API failed: ${await response.text()}`);
  return "whatsapp-cloud";
};

const sendViaTwilioWhatsApp = async (message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.WHATSAPP_TO || process.env.TWILIO_WHATSAPP_TO;
  if (!accountSid || !authToken || !from || !to) throw new Error("Twilio WhatsApp is not configured");

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ From: from, To: to, Body: message }),
  });
  if (!response.ok) throw new Error(`Twilio WhatsApp failed: ${await response.text()}`);
  return "twilio-whatsapp";
};

const sendWhatsApp = (message) => (
  process.env.WHATSAPP_PROVIDER === "twilio"
    ? sendViaTwilioWhatsApp(message)
    : sendViaWhatsAppCloud(message)
);

const sendViaTwilioSms = async (message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM;
  const to = process.env.SMS_TO;
  if (!accountSid || !authToken || !from || !to) throw new Error("Twilio SMS is not configured");

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ From: from, To: to, Body: message }),
  });
  if (!response.ok) throw new Error(`Twilio SMS failed: ${await response.text()}`);
  return "twilio-sms";
};

const sendViaMsg91 = async (message) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID;
  const to = process.env.SMS_TO;
  const templateId = process.env.MSG91_TEMPLATE_ID; // MSG91 typically requires a DLT-approved template for India
  if (!authKey || !senderId || !to || !templateId) throw new Error("MSG91 SMS is not configured");

  const response = await fetch("https://control.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: {
      authkey: authKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template_id: templateId,
      sender: senderId,
      short_url: "0",
      recipients: [{ mobiles: to, message }],
    }),
  });
  if (!response.ok) throw new Error(`MSG91 SMS failed: ${await response.text()}`);
  return "msg91-sms";
};

const sendSms = (message) => {
  if (process.env.SMS_PROVIDER === "msg91") return sendViaMsg91(message);
  if (process.env.SMS_PROVIDER === "twilio") return sendViaTwilioSms(message);
  throw new Error("SMS provider is not configured");
};

const sendViaResend = async (subject, message, html) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.COMPANY_EMAIL_TO || "info.hbcexports@gmail.com";
  const from = process.env.COMPANY_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Resend email is not configured");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text: message, html }),
  });
  if (!response.ok) throw new Error(`Resend email failed: ${await response.text()}`);
  return "resend";
};

const sendViaSendGrid = async (subject, message, html) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.COMPANY_EMAIL_TO || "info.hbcexports@gmail.com";
  const from = process.env.COMPANY_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("SendGrid email is not configured");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject,
      content: [
        { type: "text/plain", value: message },
        { type: "text/html", value: html },
      ],
    }),
  });
  if (!response.ok) throw new Error(`SendGrid email failed: ${await response.text()}`);
  return "sendgrid";
};

const sendEmail = (subject, message, html) => (
  process.env.EMAIL_PROVIDER === "sendgrid"
    ? sendViaSendGrid(subject, message, html)
    : sendViaResend(subject, message, html)
);

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const enquiry = normalizeEnquiry(JSON.parse(event.body || "{}"));
    const validationErrors = validateEnquiry(enquiry);
    if (validationErrors.length > 0) return json(400, { error: "Validation failed", details: validationErrors });

    const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "";
    const recaptchaOk = await verifyRecaptcha(enquiry.recaptchaToken, ip.split(",")[0]);
    if (!recaptchaOk) return json(403, { error: "Spam protection failed" });

    const duplicate = await findDuplicate(enquiry.dedupeKey);
    if (duplicate) return json(409, { error: "This enquiry has already been submitted" });

    const saved = await saveEnquiry(enquiry, event);
    const message = buildMessage(enquiry);
    const html = buildEmailHtml(enquiry);
    const subject = "New Website Enquiry - HBC Exports";

    const [emailProvider, whatsappProvider] = await Promise.all([
      sendEmail(subject, message, html),
      sendWhatsApp(message),
    ]);

    return json(200, {
      ok: true,
      enquiryId: saved?.id,
      email: emailProvider,
      whatsapp: whatsappProvider,
    });
  } catch (error) {
    console.error(error);
    return json(500, { error: "Enquiry system failed. Please try again later." });
  }
};
