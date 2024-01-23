<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Max-Age: 3600'); // Cache preflight response for 1 hour
include_once 'classes.php';

$database = new Database();

// Check if the user is authenticated
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['userId'])) {
    $userId = $_GET['userId']; // Get user ID from the request parameters

    // Get events that the user can review
    $eventsToReview = $database->getEventsToReview($userId);

    header('Content-Type: application/json');
    echo json_encode(['eventsToReview' => $eventsToReview]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['userId'], $_POST['eventId'], $_POST['rating'], $_POST['reviewText'])) {
    $userId = $_POST['userId'];
    $eventId = $_POST['eventId'];
    $rating = $_POST['rating'];
    $reviewText = $_POST['reviewText'];

    // Submit event review
    $success = $database->submitEventReview($userId, $eventId, $rating, $reviewText);

    if ($success) {
        echo json_encode(['message' => 'Event review submitted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error submitting event review']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
}

?>
