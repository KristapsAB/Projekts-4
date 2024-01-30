<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include 'classes.php';

$database = new Database();

// Retrieve the JSON data from the request body
$data = json_decode(file_get_contents("php://input"));

// Validate and sanitize the data
if ($data === null ||
    empty($data->event_name) ||
    empty($data->event_date) ||
    empty($data->location) ||
    empty($data->tickets_available) ||
    empty($data->price) ||
    empty($data->image_link)
) {
    // Handle validation error
    echo json_encode(['success' => false, 'message' => 'Invalid or missing data. Please provide all required fields.']);
    exit;
}

// Include the new "genre" field in the data validation
if (empty($data->genre)) {
    // Handle validation error for the genre field
    echo json_encode(['success' => false, 'message' => 'Invalid or missing genre. Please provide the genre.']);
    exit;
}

// Insert the event data into the database, including the genre field
$result = $database->insertEvent(
    $data->event_name,
    $data->event_date,
    $data->location,
    $data->tickets_available,
    $data->price,
    $data->image_link,
    $data->genre  // Include the genre field
);

if ($result) {
    // Success
    echo json_encode(['success' => true, 'message' => 'Event added successfully']);
    exit;
} else {
    // Error
    $errorResponse = ['success' => false, 'message' => 'Error adding event to the database. Please try again later.'];
    echo json_encode($errorResponse);
    exit;
}
?>
