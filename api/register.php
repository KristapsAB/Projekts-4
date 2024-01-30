<?php
header('Content-Type: application/json');

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow methods: POST, GET, OPTIONS
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow headers: Content-Type
header("Access-Control-Allow-Headers: Content-Type");

// Check for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400'); // Cache preflight response for 24 hours
    exit();
}

// Receive JSON data
$data = json_decode(file_get_contents('php://input'), true);

$response = ['message' => 'Invalid request']; // Default response

if (
    isset($data['username']) &&
    isset($data['email']) &&
    isset($data['password']) &&
    isset($data['confirmPassword'])
) {
    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];
    $confirmPassword = $data['confirmPassword'];

    // Validate data (e.g., check if passwords match)

    $host = 'localhost';
    $user = 'root';
    $dbPassword = '';
    $database = 'user_management';

    $mysqli = new mysqli($host, $user, $dbPassword, $database);

    if ($mysqli->connect_error) {
        $response['message'] = 'Connection failed: ' . $mysqli->connect_error;
        http_response_code(500);
    } else {
        // Check if the username already exists
        $checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
        $checkUsernameStmt = $mysqli->prepare($checkUsernameQuery);

        if (!$checkUsernameStmt) {
            $response['message'] = 'Error preparing the SQL statement';
            http_response_code(500);
        } else {
            $checkUsernameStmt->bind_param("s", $username);
            $checkUsernameStmt->execute();
            $result = $checkUsernameStmt->get_result();

            if ($result->num_rows > 0) {
                $response['message'] = 'Username is already taken';
                http_response_code(400);
            } else {
                // Hash the password before storing in the database
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                // Assign a default role (adjust the role_id according to your roles table)
                $defaultRoleId = 2; // Assuming 2 is the ID for 'Regular User'

                // Insert user data into the database
                $insertUserQuery = "INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)";
                $insertUserStmt = $mysqli->prepare($insertUserQuery);

                if (!$insertUserStmt) {
                    $response['message'] = 'Error preparing the SQL statement';
                    http_response_code(500);
                } else {
                    $insertUserStmt->bind_param("sssi", $username, $email, $hashedPassword, $defaultRoleId);
                    $insertUserStmt->execute();

                    $response['message'] = 'Registration successful';
                    http_response_code(200);
                }

                $insertUserStmt->close();
            }

            $checkUsernameStmt->close();
        }

        $mysqli->close();
    }
}

echo json_encode($response);
?>
