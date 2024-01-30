<?php
// Include the database connection file
include_once 'classes.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Access-Control-Allow-Headers: Authorization, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    exit();
}

// Check if the user is logged in and the token is valid
// You can implement your token validation logic here
// For simplicity, we assume that the token is passed as a Bearer token in the Authorization header
// Example of checking the Authorization header in PHP
$token = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : null;

// Function to validate the token and retrieve user ID
function validateToken() {
    $headers = apache_request_headers(); // Adjust this based on your server environment

    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);

        // Verify and decode the token (use your token verification logic here)
        $decodedToken = json_decode(base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $token)[1]))), true);

        // Check if the token is valid for your application
        if ($decodedToken && isset($decodedToken['userId'])) {
            return $decodedToken['userId'];
        }
    }

    return null;
}

// Example usage
$userId = validateToken();

if ($userId) {
    // Token is valid, proceed with your logic
    error_log("Valid Token for User ID: $userId");
} else {
    // Invalid token
    http_response_code(401);
    echo json_encode(array("message" => "Invalid token"));
    error_log("Invalid Token");
    exit();
}

// Instantiate the Database class
$database = new Database();

// Check if the token is valid
if ($database->verifyToken($token, $userId)) {
    // Fetch events to review for the user
    $eventsToReview = $database->getEventsToReview($userId);

    // Return the events as JSON
    echo json_encode(['eventsToReview' => $eventsToReview]);
} else {
    // Invalid token
    http_response_code(401); // Unauthorized
    echo json_encode(['message' => 'Invalid token']);
    error_log("Invalid Token during event retrieval");
}
?>
