<?php
// معالجة إرسال الرسالة
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // جمع البيانات من النموذج
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // إعداد محتوى الرسالة
    $to = "contact@romaven.com"; // البريد المستقبل
    $emailSubject = "رسالة من موقعكم: " . $subject;

    // إرسال الرسالة
    if (sendEmail($to, $emailSubject, $message, $email, $name)) {
        echo "<div class='alert alert-success'>تم إرسال الرسالة بنجاح!</div>";
    } else {
        echo "<div class='alert alert-danger'>حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.</div>";
    }
}

// دالة لإرسال الرسائل
function sendEmail($to, $subject, $message, $fromEmail, $fromName) {
    // إعداد محتوى الرسالة كـ HTML
    $htmlContent = "<html dir='rtl' lang='ar'>";
    $htmlContent .= "<head>";
    $htmlContent .= "<meta charset='UTF-8'>";
    $htmlContent .= "<title>رسالة من موقعكم</title>";
    $htmlContent .= "<style>";
    $htmlContent .= "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }";
    $htmlContent .= "h1 { color: #007bff; }";
    $htmlContent .= "p { margin: 10px 0; }";
    $htmlContent .= ".info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }";
    $htmlContent .= "</style>";
    $htmlContent .= "</head>";
    $htmlContent .= "<body>";
    $htmlContent .= "<h1>رسالة جديدة من موقعكم</h1>";
    $htmlContent .= "<div class='info'>";
    $htmlContent .= "<p><strong>المرسل:</strong> " . htmlspecialchars($fromName) . "</p>";
    $htmlContent .= "<p><strong>البريد الإلكتروني:</strong> " . htmlspecialchars($fromEmail) . "</p>";
    $htmlContent .= "<p><strong>الموضوع:</strong> " . htmlspecialchars($subject) . "</p>";
    $htmlContent .= "</div>";
    $htmlContent .= "<div class='message'>";
    $htmlContent .= "<p>" . nl2br(htmlspecialchars($message)) . "</p>";
    $htmlContent .= "</div>";
    $htmlContent .= "</body>";
    $htmlContent .= "</html>";

    // إعداد الرؤوس
    $headers = "MIME-Version: 1.0" . "
";
    $headers .= "Content-type:text/html;charset=UTF-8" . "
";
    $headers .= "From: " . $fromName . " <" . $fromEmail . ">" . "
";
    $headers .= "Reply-To: " . $fromEmail . "
";

    // إرسال الرسالة
    if (mail($to, $subject, $htmlContent, $headers)) {
        return true;
    } else {
        return false;
    }
}

// إعدادات الاتصال بخادم البريد
$hostname = '{imap.hostinger.com:993/imap/ssl}INBOX';
$username = 'contact@romaven.com';
$password = 'AhmadSmail@2000';

// الاتصال بخادم البريد
$inbox = imap_open($hostname, $username, $password) or die('فشل الاتصال: ' . imap_last_error());

// البحث عن الرسائل
$emails = imap_search($inbox, 'ALL');

if ($emails) {
  rsort($emails); // ترتيب الرسائل من الأحدث إلى الأقدم

  foreach ($emails as $email_id) {
    $overview = imap_fetch_overview($inbox, $email_id, 0);
    $message = imap_fetchbody($inbox, $email_id, 1);

    echo "<h2>المرسل: " . $overview[0]->from . "</h2>";
    echo "<h3>الموضوع: " . $overview[0]->subject . "</h3>";
    echo "<p>التاريخ: " . $overview[0]->date . "</p>";
    echo "<p>الرسالة: " . $message . "</p>";
    echo "<hr>";
  }
}

// إغلاق الاتصال
imap_close($inbox);
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نموذج الاتصال</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
        }
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-control {
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
            border-radius: 5px;
            padding: 10px 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="contact-form">
            <h2 class="text-center mb-4">نموذج الاتصال</h2>
            <form method="post" action="">
                <div class="form-group">
                    <label for="name">الاسم</label>
                    <input type="text" class="form-control" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="subject">الموضوع</label>
                    <input type="text" class="form-control" id="subject" name="subject" required>
                </div>
                <div class="form-group">
                    <label for="message">الرسالة</label>
                    <textarea class="form-control" id="message" name="message" rows="5" required></textarea>
                </div>
                <div class="text-center">
                    <button type="submit" class="btn btn-primary">إرسال الرسالة</button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>