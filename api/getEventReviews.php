<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'classes.php';

if (isset($_GET['eventId'])) {
    $eventId = $_GET['eventId'];

    // Fetch event reviews based on the eventId
    $database = new Database(); // Create an instance of your Database class
    $eventReviews = $database->getEventReviews($eventId);

    // Return reviews as JSON
    header('Content-Type: application/json');
    echo json_encode($eventReviews);
} else {
    echo json_encode(['error' => 'Invalid parameters']);
}
?>
