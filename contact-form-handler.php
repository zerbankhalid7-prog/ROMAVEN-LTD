<?php
// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    // Simple validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode(["message" => "All fields are required."]);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid email format."]);
        exit();
    }

    // Prepare email
    $to = "contact@romaven.com";
    $email_subject = "Website Contact Form: " . $subject;
    $email_body = "You have received a new message from your website contact form.

";
    $email_body .= "Name: $name
";
    $email_body .= "Email: $email
";
    $email_body .= "Subject: $subject

";
    $email_body .= "Message:
$message
";

    $headers = "From: $email
";
    $headers .= "Reply-To: $email
";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        http_response_code(200);
        echo json_encode(["message" => "Your message has been sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to send email. Please try again later."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed. Please use POST method."]);
}
?>