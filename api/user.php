<?php

require_once 'db_connection.php';

class User {
    private $conn;

    public function __construct() {
        $dbConnection = new DatabaseConnection();
        $this->conn = $dbConnection->getConnection();
    }

    public function authenticateUser($username, $password) {
        $username = $this->conn->real_escape_string($username);
        $password = $this->conn->real_escape_string($password);

        $getUserQuery = "SELECT id, username, password, email, roles.name as role FROM users 
            JOIN roles ON users.role_id = roles.id
            WHERE username = '$username'";

        $result = $this->conn->query($getUserQuery);

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Verify password
            if (password_verify($password, $user['password'])) {
                return $user;
            } else {
                return null; // Incorrect password
            }
        } else {
            return null; // User not found
        }
    }
}

?>
