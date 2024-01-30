<?php
// updateCartItemStatus.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type'); // Include 'Authorization' header
header('Access-Control-Allow-Credentials: true');

require_once 'classes.php';

// Check if the cart item ID is provided in the request
if (isset($_GET['cartItemId'])) {
    $cartItemId = $_GET['cartItemId'];

    try {
        // Create an instance of the Database class
        $database = new Database();

        // Update the cart item status using the updateCartItemStatus method
        $success = $database->updateCartItemStatus($cartItemId);

        if ($success) {
            // Respond with a success message or status code
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Cart item status updated successfully']);
        } else {
            // If the update fails, respond with an appropriate error message
            http_response_code(500); // Internal Server Error
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Failed to update cart item status']);
        }
    } catch (PDOException $e) {
        // Log or handle the exception appropriately
        http_response_code(500); // Internal Server Error
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Database error']);
    }
} else {
    // If the cart item ID is not provided, send an error response
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Cart item ID is missing']);
}
?>
