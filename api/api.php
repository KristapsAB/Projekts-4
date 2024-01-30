<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Check for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // Cache preflight response for 24 hours
    exit();
}

// Start the session
session_start();

// Assuming your MySQL database credentials
$host = 'localhost'; // Update the host and port
$user = 'root';
$password = '';
$database = 'user_management';
    
$mysqli = new mysqli($host, $user, $password, $database);

if ($mysqli->connect_error) {
    die(json_encode(['message' => 'Connection failed: ' . $mysqli->connect_error]));
}

$postData = json_decode(file_get_contents("php://input"));

if (!$postData || !isset($postData->username) || !isset($postData->password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid or missing input data']);
    exit();
}

$username = $postData->username;
$password = $postData->password;

// Query to check user credentials with hashed passwords
$query = "SELECT * FROM users WHERE username = ?";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['message' => 'Error preparing the SQL statement']);
    exit();
}

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result === false) {
    http_response_code(500);
    echo json_encode(['message' => 'Error executing the SQL statement']);
    exit();
}

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verify the hashed password
    if (password_verify($password, $user['password'])) {
        // Set user information in the session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role_id'] = $user['role_id'];
        
        // Generate a token (you may use a more secure method in a production environment)
        $token = bin2hex(random_bytes(32));
        
        // Save the token in the session (you might want to store it in a more persistent storage)
        $_SESSION['token'] = $token;
        
        // Send user information and token in the JSON response
        echo json_encode([
            'message' => 'Login successful',
            'role' => $user['role_id'],
            'userId' => $user['id'],
            'username' => $user['username'],
            'token' => $token, // Include the token in the response
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials']);
    }
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid credentials']);
}

$stmt->close();
$mysqli->close();
?>
