<?php
// getEventComments.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json');
// Assuming you have a database connection established
$host = "localhost";
$username = "root";
$password = "";
$dbname = "user_management";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Assuming you have a table named 'event_comments' with columns 'event_id', 'comment_id', and 'comment'
$eventId = $_GET['eventId'];
$sql = "SELECT * FROM event_comments WHERE event_id = $eventId";
$result = $conn->query($sql);

$comments = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comment = array(
            'id' => $row['comment_id'],
            'comment' => $row['comment']
        );
        $comments[] = $comment;
    }

    $response = array('comments' => $comments);
    echo json_encode($response);
} else {
    $response = array('comments' => $comments); // Return an empty array if no comments found
    echo json_encode($response);
}

$conn->close();
?>
