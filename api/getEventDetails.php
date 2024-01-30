<?php
// getEventDetails.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");
require_once 'EventDetails.php';

$eventId = $_GET['eventId'];

if (isset($eventId)) {
    $eventDetailsObj = new EventDetails();
    $eventDetails = $eventDetailsObj->getEventDetails($eventId);

    header('Content-Type: application/json');
    echo json_encode(['event' => $eventDetails]);
} else {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Event ID is required']);
}

?>
