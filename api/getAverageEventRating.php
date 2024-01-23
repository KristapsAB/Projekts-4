<?php
require_once 'EventRating.php';

$eventId = $_GET['eventId'];

if (isset($eventId)) {
    $eventRatingObj = new EventRating();
    $averageRating = $eventRatingObj->getAverageRating($eventId);

    header('Content-Type: application/json');
    echo json_encode(['averageRating' => $averageRating]);
} else {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Event ID is required']);
}

$conn->close();
?>
