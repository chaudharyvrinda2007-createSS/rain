# Enquiry Form Setup

Your site is hosted on **GitHub Pages**, which only serves static files —
it cannot run backend code. That's why `/.netlify/functions/...` never
worked: that endpoint simply does not exist on GitHub Pages, no matter
what keys were configured.

## Quick path (works right now, on GitHub Pages, free) — do this first

1. Go to https://web3forms.com
2. Enter the email address where you want enquiries to arrive and click
   "Create Access Key". No account, password, or credit card needed.
3. Check that inbox for an email with your Access Key.
4. Open `index.html`, find `window.HBC_WEB3FORMS_ACCESS_KEY = "";` near
   the top of `<body>`, and paste your key between the quotes.
5. Commit and push. Every enquiry submitted on the site will now arrive
   directly in that inbox. Free plan covers 250 enquiries/month.

That's the whole setup. Everything below is optional.

---

# Advanced path (optional): Netlify + reCAPTCHA + Supabase + WhatsApp + SMS


The website form posts to:

```text
/.netlify/functions/enquiry-notification
```

The function performs:

- Server-side validation
- Google reCAPTCHA verification
- Duplicate submission check
- Supabase database save
- Professional Gmail/email notification
- WhatsApp Business notification

Do not put private API keys, passwords, access tokens, or service-role keys in browser files.

## 1. Set the Public reCAPTCHA Site Key

In `index.html`, replace:

```js
window.HBC_RECAPTCHA_SITE_KEY = "";
```

with your public reCAPTCHA v3 site key:

```js
window.HBC_RECAPTCHA_SITE_KEY = "your_public_site_key";
```

## 2. Create the Database Table

Use Supabase and run `supabase-enquiries.sql` in the SQL editor.

## 3. Required Netlify Environment Variables

Set these in Netlify: Site settings → Environment variables.

```text
ALLOWED_ORIGIN=https://your-domain.com
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
RECAPTCHA_MIN_SCORE=0.5

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

COMPANY_EMAIL_TO=your-gmail-address@gmail.com
COMPANY_EMAIL_FROM=HBC Exports <enquiry@yourdomain.com>
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
```

For SendGrid instead of Resend:

```text
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

## 4. WhatsApp Option A: WhatsApp Business Cloud API

```text
WHATSAPP_PROVIDER=cloud
WHATSAPP_CLOUD_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_TO=919979029121
```

## 5. WhatsApp Option B: Twilio WhatsApp API

```text
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+919979029121
```

## Notification Format

```text
New Website Enquiry

Name:
Company:
Mobile:
Email:
Country:
Product:
Message:
Date & Time:
```

## Important Hosting Note

GitHub Pages cannot run secure backend APIs or store environment variables. Deploy this package to Netlify, Vercel, or another backend-enabled host. The included function and `netlify.toml` are ready for Netlify.
