<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');

// Start the session
session_start();

// Check if the user is logged in
if (isset($_SESSION['user_id'])) {
    // User is logged in, return user data from api.php

    // You can customize the endpoint and headers as needed
    $apiEndpoint = 'http://localhost:8888/api/api.php';
    $headers = [
        'Authorization: Bearer ' . $_SESSION['token'], // Assuming you have a token in the session
    ];

    // Create a cURL handle
    $ch = curl_init();

    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, $apiEndpoint);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute cURL and get the response
    $apiResponse = curl_exec($ch);

    // Check for cURL errors
    if (curl_errno($ch)) {
        http_response_code(500);
        echo json_encode(['error' => 'Error fetching user data from API']);
        exit();
    }

    // Close cURL handle
    curl_close($ch);

    // Return the API response
    echo $apiResponse;
} else {
    // User is not logged in, return an error
    http_response_code(401);
    echo json_encode(['error' => 'User not authenticated']);
}
