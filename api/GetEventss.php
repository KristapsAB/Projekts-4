<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include 'classes.php';

$database = new Database();

// Get events
$events = $database->getEvents();

// Return events as JSON
echo json_encode(['events' => $events]);
?>
