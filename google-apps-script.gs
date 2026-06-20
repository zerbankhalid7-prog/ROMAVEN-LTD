// ROMAVEN LTD - Google Apps Script Email Backend
// انسخ هذا الكود كاملاً في script.google.com

var RECIPIENT_EMAIL = "contact@romaven.com";
var SITE_NAME = "ROMAVEN LTD";

function doPost(e) {
  try {
    var data    = JSON.parse(e.postData.contents);
    var name    = sanitize(data.name    || "");
    var email   = sanitize(data.email   || "");
    var subject = sanitize(data.subject || "");
    var message = sanitize(data.message || "");

    if (!name || !email || !subject || !message) {
      return respond(false, "All fields are required.");
    }

    if (!isValidEmail(email)) {
      return respond(false, "Invalid email address.");
    }

    var ownerSent = false;
    var errorDetails = "";

    // 1. إرسال البريد لصاحب الموقع أولاً (أهم خطوة)
    try {
      GmailApp.sendEmail(RECIPIENT_EMAIL, "[" + SITE_NAME + "] New Contact: " + subject, "", {
        htmlBody: buildOwnerEmail(name, email, subject, message),
        replyTo:  email
      });
      ownerSent = true;
    } catch (ownerErr) {
      errorDetails += "Owner email failed: " + ownerErr.message + ". ";
    }

    // 2. إرسال الرد التلقائي للزائر (في try-catch مستقل لضمان عدم توقف النظام في حال فشله)
    try {
      GmailApp.sendEmail(email, "Thank you for contacting " + SITE_NAME, "", {
        htmlBody: buildVisitorEmail(name, subject),
        replyTo:  RECIPIENT_EMAIL
      });
    } catch (visitorErr) {
      // نسجل الخطأ فقط دون إفشال العملية للزائر
      errorDetails += "Visitor auto-reply failed: " + visitorErr.message;
    }

    if (ownerSent) {
      return respond(true, "Message sent successfully.");
    } else {
      return respond(false, "Could not send email. Details: " + errorDetails);
    }

  } catch (err) {
    Logger.log("Error: " + err.message);
    return respond(false, "Server error: " + err.message);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: SITE_NAME + " Mailer Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildOwnerEmail(name, email, subject, message) {
  var html = "";
  html += "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
  html += "<style>";
  html += "body{font-family:Arial,sans-serif;background:#f4f6fb;margin:0;padding:20px;}";
  html += ".card{background:#fff;max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);}";
  html += ".header{background:linear-gradient(135deg,#1a237e,#3949ab);padding:32px 36px;text-align:center;}";
  html += ".header h1{color:#fff;margin:0;font-size:1.5rem;}";
  html += ".header p{color:rgba(255,255,255,.7);margin:6px 0 0;font-size:.9rem;}";
  html += ".body{padding:32px 36px;}";
  html += ".label{font-size:.78rem;font-weight:700;color:#888;text-transform:uppercase;margin-bottom:4px;}";
  html += ".value{font-size:1rem;color:#222;padding:10px 14px;background:#f8f9fe;border-radius:8px;border-left:3px solid #3949ab;margin-bottom:20px;word-break:break-word;}";
  html += ".footer{text-align:center;padding:20px;font-size:.78rem;color:#aaa;border-top:1px solid #f0f0f0;}";
  html += "</style></head><body>";
  html += "<div class='card'>";
  html += "<div class='header'><h1>New Contact Message</h1><p>Received via ROMAVEN Website</p></div>";
  html += "<div class='body'>";
  html += "<div class='label'>Full Name</div><div class='value'>" + name + "</div>";
  html += "<div class='label'>Email Address</div><div class='value'><a href='mailto:" + email + "' style='color:#3949ab'>" + email + "</a></div>";
  html += "<div class='label'>Subject</div><div class='value'>" + subject + "</div>";
  html += "<div class='label'>Message</div><div class='value' style='white-space:pre-wrap;line-height:1.7'>" + message.replace(/\n/g, "<br>") + "</div>";
  html += "</div>";
  html += "<div class='footer'>ROMAVEN LTD Mailer &mdash; Reply to this email to respond to the client.</div>";
  html += "</div></body></html>";
  return html;
}

function buildVisitorEmail(name, subject) {
  var html = "";
  html += "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
  html += "<style>";
  html += "body{font-family:Arial,sans-serif;background:#f4f6fb;margin:0;padding:20px;}";
  html += ".card{background:#fff;max-width:580px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10);}";
  html += ".header{background:linear-gradient(135deg,#1a237e,#3949ab);padding:40px 36px;text-align:center;}";
  html += ".logo{font-size:2rem;font-weight:900;color:#fff;letter-spacing:.05em;}";
  html += ".tagline{color:rgba(255,255,255,.7);margin:8px 0 0;font-size:.9rem;}";
  html += ".body{padding:36px;}";
  html += ".body h2{color:#1a237e;margin:0 0 16px;font-size:1.3rem;}";
  html += ".body p{color:#555;line-height:1.75;margin:0 0 14px;}";
  html += ".highlight{background:#e8eaf6;border-left:3px solid #3949ab;padding:12px 16px;border-radius:8px;font-size:.9rem;color:#333;margin-bottom:14px;}";
  html += ".cta{text-align:center;margin:28px 0 0;}";
  html += ".cta a{display:inline-block;background:linear-gradient(135deg,#1a237e,#3949ab);color:#fff;padding:12px 32px;border-radius:30px;text-decoration:none;font-weight:700;font-size:.95rem;}";
  html += ".footer{text-align:center;padding:20px;font-size:.78rem;color:#aaa;border-top:1px solid #f0f0f0;}";
  html += "</style></head><body>";
  html += "<div class='card'>";
  html += "<div class='header'><div class='logo'>ROMAVEN</div><p class='tagline'>Excellence in Business Consulting</p></div>";
  html += "<div class='body'>";
  html += "<h2>Thank you, " + name + "!</h2>";
  html += "<p>We have received your message regarding <strong>\"" + subject + "\"</strong> and will get back to you within <strong>1 business day</strong>.</p>";
  html += "<div class='highlight'>Our team of experts is reviewing your inquiry. We look forward to speaking with you soon.</div>";
  html += "<p>In the meantime, feel free to reach us directly:</p>";
  html += "<div class='highlight'>&#128222; +44 7868 241625<br>&#128231; contact@romaven.com<br>&#127760; romaven.com</div>";
  html += "<div class='cta'><a href='https://zerbankhalid7-prog.github.io/ROMAVEN-LTD/'>Visit Our Website</a></div>";
  html += "</div>";
  html += "<div class='footer'>&copy; 2025 ROMAVEN LTD &mdash; London, United Kingdom</div>";
  html += "</div></body></html>";
  return html;
}

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
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
