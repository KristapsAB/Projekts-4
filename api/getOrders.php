<?php

include_once 'classes.php';

// Allow requests from any origin
// Allow requests from any origin
header('Access-Control-Allow-Origin: *');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');


// Check for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // Cache preflight response for 24 hours
    exit();
}

// Log received headers
error_log(print_r(apache_request_headers(), true));
// Continue with the rest of your script...

// Check if the user ID is provided in the query string
if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    // Check if the Authorization header is present
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        // If Authorization header is not present, send an error response
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header is missing']);
        exit();
    }

    // Extract the token from the Authorization header
    $token = $headers['Authorization'];

    // Create an instance of the Database class
    $database = new Database();
    error_log("Received Token: $token");
    // Verify the token
    if ($database->verifyToken($token, $userId)) {
        // Token is valid, fetch orders for the specified user ID
        $orders = $database->getOrders($userId);

        // Send JSON response
        header('Content-Type: application/json');
        echo json_encode(['orders' => $orders]);
    } else {
        // Token verification failed, send an error response
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
    }
} else {
    // If user ID is not provided, send an error response
    http_response_code(400);
    echo json_encode(['error' => 'User ID is missing']);
}
?>
