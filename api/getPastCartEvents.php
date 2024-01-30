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

// Instantiate Database class
$database = new Database();
$pdo = $database->getConnection(); // Access the PDO instance from the Database class

$userId = $_GET['userId'];

// Perform a database query to retrieve past cart events
// Join cart and events tables on event_id
$query = "SELECT e.*, c.status
          FROM events e
          INNER JOIN cart c ON c.event_id = e.id
          WHERE c.user_id = ? AND c.status = 'purchased' AND e.event_date < NOW()";

$stmt = $pdo->prepare($query);
$stmt->execute([$userId]);
$pastCartEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return the results as JSON
header('Content-Type: application/json');
echo json_encode($pastCartEvents);
?>
