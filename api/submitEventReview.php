<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

// Include the database connection file
include_once 'classes.php';

// Check if the user is logged in and the token is valid
// You can implement your token validation logic here
// For simplicity, we assume that the token is passed as a Bearer token in the Authorization header
// Example of checking the Authorization header in PHP
$token = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : null;

// Replace the following logic with your actual token validation
$userId = 1; // Replace with your actual user ID

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
}

?>
