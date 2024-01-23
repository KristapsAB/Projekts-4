<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit;
}

// Enable CORS for POST requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once('classes.php'); // Replace 'Database.php' with the actual filename

// Get JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

$response = array();

// Validate inputs
if (empty($data['userId']) || empty($data['eventId']) || empty($data['rating']) || empty($data['comment'])) {
    $response['success'] = false;
    $response['message'] = 'Invalid input. Please provide all required fields.';
} else {
    // Create an instance of the Database class
    $database = new Database();

    // Extract data from the JSON
    $userId = $data['userId'];
    $eventId = $data['eventId'];
    $rating = $data['rating'];
    $comment = $data['comment'];

    // Log values for debugging
    error_log("userId: " . $userId);
    error_log("eventId: " . $eventId);
    error_log("rating: " . $rating);
    error_log("comment: " . $comment);

    // Insert the review into the database
    $success = $database->submitEventReview($userId, $eventId, $rating, $comment);

    if ($success) {
        $response['success'] = true;
        $response['message'] = 'Review submitted successfully.';
    } else {
        $response['success'] = false;
        $response['message'] = 'Error submitting review.';
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
