<?php
// Include necessary files and configurations
include_once('classes.php'); // Replace with the actual filename

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow only GET requests
header("Access-Control-Allow-Methods: GET");

// Allow the Content-Type header
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Get event ID from the query parameter
$eventId = $_GET['eventId'];

// Create an instance of the Database class
$database = new Database();

// Get the average rating for the event
$averageRating = $database->getAverageEventRating($eventId);

// Return JSON response
header('Content-Type: application/json');
echo json_encode(['averageRating' => $averageRating]);
?>
