<?php
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