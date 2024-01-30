<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'classes.php';

// Retrieve the request body
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->eventId) || !isset($data->userId) || !isset($data->rating)) {
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Missing required data."));
    exit;
}

// Extract data from the request body
$eventId = $data->eventId;
$userId = $data->userId;
$rating = $data->rating;

// Create an instance of the Database class
$database = new Database();

try {
    // Check if the user has already submitted a review for the event
    $existingReview = $database->getEventReview($eventId, $userId);

    if ($existingReview) {
        http_response_code(400); // Bad Request
        echo json_encode(array("message" => "User has already submitted a review for this event."));
    } else {
        // Insert the review into the event_reviews table
        $success = $database->submitEventReview($userId, $eventId, $rating, '');

        if ($success) {
            http_response_code(201); // Created
            echo json_encode(array("message" => "Review submitted successfully."));
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(array("message" => "Error submitting review."));
        }
    }
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>
