<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Include Authorization header
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    exit;
}


require_once 'classes.php';

// Check if the user ID is provided in the request
if (!isset($_GET['userId'])) {
    http_response_code(400);
    die("User ID is required.");
}

$userId = $_GET['userId'];

// Create an instance of the Database class
$database = new Database();

// Fetch past events for the user
$pastEvents = $database->getPastEvents($userId);

// Return the JSON response
header('Content-Type: application/json');
echo json_encode($pastEvents);
