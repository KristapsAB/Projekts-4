<?php
// getRatedEvents.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Include the classes.php file that contains your Database class
include_once 'classes.php';

// Create an instance of the Database class
$database = new Database();

try {
    // Fetch events with ratings from the database
    $eventsWithRatings = $database->getRatedEvents();

    // Return the data as JSON
    echo json_encode($eventsWithRatings);
} catch (Exception $e) {
    // Handle exceptions, log errors, or return an error response
    echo json_encode(['error' => 'Error fetching rated events: ' . $e->getMessage()]);
}
?>
