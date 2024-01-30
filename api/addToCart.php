<?php
header('Access-Control-Allow-Origin: *');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');


// Check for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // Cache preflight response for 24 hours
    exit();
}
require_once 'classes.php'; // Include your classes file

// Check if the user ID and event ID are provided in the request
if (isset($_POST['userId'], $_POST['eventId'])) {
    $userId = $_POST['userId'];
    $eventId = $_POST['eventId'];

    // You may also want to check if the event and user exist in the database before proceeding

    try {
        // Create an instance of the Database class
        $database = new Database();

        // Add the item to the cart using the addToCart method
        $success = $database->insertCartItem($userId, $eventId);

        if ($success) {
            // Respond with a success message or status code
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Item added to cart successfully']);
        } else {
            // If the insertion fails, respond with an appropriate error message
            http_response_code(500); // Internal Server Error
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Failed to add item to cart']);
        }
    } catch (PDOException $e) {
        // Log or handle the exception appropriately
        http_response_code(500); // Internal Server Error
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Database error']);
    }
} else {
    // If user ID or event ID is not provided, send an error response
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'User ID or Event ID is missing']);
}

?>
