<?php
// دالة لإرسال الرسائل باستخدام SMTP
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
?>