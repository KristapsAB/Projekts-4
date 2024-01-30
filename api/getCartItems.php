<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Max-Age: 3600'); // Cache preflight response for 1 hour

// Check for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

require_once 'classes.php';

// Check if the user ID is provided in the request
if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    try {
        // Create an instance of the Database class
        $database = new Database();

        // Fetch user's cart items with event details from the database
        $cartItems = $database->getCartItemsWithEventDetailsByUserId($userId);

        // Respond with the cart items in JSON format
        echo json_encode(['cartItems' => $cartItems]);
    } catch (PDOException $e) {
        // Log or handle the exception appropriately
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Database error']);
    }
} else {
    // If user ID is not provided, send an error response
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'User ID is missing']);
}
?>
