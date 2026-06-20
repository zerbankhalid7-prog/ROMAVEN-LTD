/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║       ROMAVEN LTD — Google Apps Script Email Backend                   ║
 * ║       نسخ هذا الكود على: https://script.google.com                    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * خطوات النشر:
 * 1. اذهب إلى: https://script.google.com
 * 2. اضغط "New Project"
 * 3. احذف الكود الموجود والصق هذا الكود
 * 4. اضغط: Deploy → New Deployment
 * 5. اختر Type: Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. اضغط Deploy وانسخ الـ URL
 * 9. ضع الـ URL في ملف script.js
 */

// ── إعداد البريد المستقبِل ──────────────────────────────────────────────────
var RECIPIENT_EMAIL = "contact@romaven.com";
var SITE_NAME       = "ROMAVEN LTD";

// ── معالجة طلبات POST ────────────────────────────────────────────────────────
function doPost(e) {
  try {
    // قراءة البيانات
    var data    = JSON.parse(e.postData.contents);
    var name    = sanitize(data.name    || "");
    var email   = sanitize(data.email   || "");
    var subject = sanitize(data.subject || "");
    var message = sanitize(data.message || "");
    var site    = sanitize(data._site   || "unknown");

    // التحقق من البيانات
    if (!name || !email || !subject || !message) {
      return respond(false, "All fields are required.");
    }

    if (!isValidEmail(email)) {
      return respond(false, "Invalid email address.");
    }

    // ── إرسال الرسالة لصاحب الموقع ─────────────────────────────────────────
    var ownerBody = buildOwnerEmail(name, email, subject, message, site);
    MailApp.sendEmail({
      to:       RECIPIENT_EMAIL,
      subject:  "[" + SITE_NAME + "] New Contact: " + subject,
      htmlBody: ownerBody,
      replyTo:  email
    });

    // ── إرسال رسالة شكر للزائر ──────────────────────────────────────────────
    var visitorBody = buildVisitorEmail(name, subject);
    MailApp.sendEmail({
      to:       email,
      subject:  "Thank you for contacting " + SITE_NAME,
      htmlBody: visitorBody,
      replyTo:  RECIPIENT_EMAIL
    });

    return respond(true, "Message sent successfully.");

  } catch (err) {
    Logger.log("Error: " + err.message);
    return respond(false, "Server error: " + err.message);
  }
}

// ── طلبات GET (اختبار أن السكريبت يعمل) ─────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: SITE_NAME + " Mailer Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── بناء HTML للرسالة الواردة لصاحب الموقع ──────────────────────────────────
function buildOwnerEmail(name, email, subject, message, site) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 20px; }
      .card { background: #fff; max-width: 600px; margin: 0 auto; border-radius: 16px;
              overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.10); }
      .header { background: linear-gradient(135deg, #1a237e, #3949ab);
                padding: 32px 36px; text-align: center; }
      .header h1 { color: #fff; margin: 0; font-size: 1.5rem; letter-spacing: .03em; }
      .header p  { color: rgba(255,255,255,.7); margin: 6px 0 0; font-size: .9rem; }
      .body { padding: 32px 36px; }
      .field { margin-bottom: 20px; }
      .label { font-size: .78rem; font-weight: 700; color: #888; text-transform: uppercase;
               letter-spacing: .08em; margin-bottom: 4px; }
      .value { font-size: 1rem; color: #222; padding: 10px 14px; background: #f8f9fe;
               border-radius: 8px; border-left: 3px solid #3949ab; word-break: break-word; }
      .message-box { white-space: pre-wrap; line-height: 1.7; }
      .footer { text-align: center; padding: 20px; font-size: .78rem; color: #aaa; }
      .badge { display: inline-block; background: #e8eaf6; color: #3949ab;
               padding: 3px 10px; border-radius: 20px; font-size: .75rem; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>📩 New Contact Message</h1>
        <p>Received via ${site}</p>
      </div>
      <div class="body">
        <div class="field">
          <div class="label">Full Name</div>
          <div class="value">${name}</div>
        </div>
        <div class="field">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${email}" style="color:#3949ab">${email}</a></div>
        </div>
        <div class="field">
          <div class="label">Subject</div>
          <div class="value">${subject}</div>
        </div>
        <div class="field">
          <div class="label">Message</div>
          <div class="value message-box">${message.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
      <div class="footer">
        <span class="badge">ROMAVEN LTD Mailer</span>
        <br><br>Reply directly to this email to respond to the client.
      </div>
    </div>
  </body>
  </html>`;
}

// ── بناء HTML لرسالة الشكر للزائر ────────────────────────────────────────────
function buildVisitorEmail(name, subject) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 20px; }
      .card { background: #fff; max-width: 580px; margin: 0 auto; border-radius: 16px;
              overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.10); }
      .header { background: linear-gradient(135deg, #1a237e, #3949ab); padding: 40px 36px; text-align: center; }
      .logo   { font-size: 2rem; font-weight: 900; color: #fff; letter-spacing: .05em; }
      .tagline{ color: rgba(255,255,255,.7); margin: 8px 0 0; font-size: .9rem; }
      .body   { padding: 36px; }
      .body h2{ color: #1a237e; margin: 0 0 16px; font-size: 1.3rem; }
      .body p { color: #555; line-height: 1.75; margin: 0 0 14px; }
      .highlight { background: #e8eaf6; border-left: 3px solid #3949ab; padding: 12px 16px;
                   border-radius: 8px; font-size: .9rem; color: #333; }
      .cta    { text-align: center; margin: 28px 0 0; }
      .cta a  { display: inline-block; background: linear-gradient(135deg, #1a237e, #3949ab);
                color: #fff; padding: 12px 32px; border-radius: 30px; text-decoration: none;
                font-weight: 700; font-size: .95rem; letter-spacing: .02em; }
      .footer { text-align: center; padding: 20px; font-size: .78rem; color: #aaa;
                border-top: 1px solid #f0f0f0; }
      .social { margin: 10px 0; }
      .social a { color: #3949ab; text-decoration: none; margin: 0 8px; font-size: .82rem; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="logo">ROMAVEN</div>
        <p class="tagline">Excellence in Business Consulting</p>
      </div>
      <div class="body">
        <h2>Thank you, ${name}! 🎉</h2>
        <p>We have received your message regarding <strong>"${subject}"</strong> and will get back to you within <strong>1 business day</strong>.</p>
        <div class="highlight">
          Our team of experts is reviewing your inquiry. We look forward to speaking with you soon.
        </div>
        <p style="margin-top:20px">In the meantime, feel free to explore our services or reach us directly:</p>
        <div class="highlight">
          📞 +44 7868 241625<br>
          📧 contact@romaven.com<br>
          🌐 romaven.com
        </div>
        <div class="cta">
          <a href="https://zerbankhalid7-prog.github.io/ROMAVEN-LTD/">Visit Our Website</a>
        </div>
      </div>
      <div class="footer">
        <div class="social">
          <a href="#">LinkedIn</a> · <a href="#">Twitter</a> · <a href="#">Facebook</a>
        </div>
        © 2025 ROMAVEN LTD · London, United Kingdom<br>
        <span style="font-size:.7rem">You are receiving this email because you contacted us through our website.</span>
      </div>
    </div>
  </body>
  </html>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function respond(success, message) {
  var payload = JSON.stringify({
    status:  success ? "success" : "error",
    message: message
  });
  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitize(str) {
  return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
