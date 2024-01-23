<?php

// Event.php
class Event {
    private $db;
    private $table_name = "events";

    public function __construct($db) {
        $this->db = $db;
    }

   // Event.php
// Event.php
public function createEvent($data) {
    $query = "INSERT INTO " . $this->table_name . " 
              SET event_name=?, event_date=?, location=?, tickets_available=?, price=?, image_link=?";

    $stmt = $this->db->prepare($query);

    if ($stmt) {
        $stmt->bind_param("sssdds", $data['event_name'], $data['event_date'], $data['location'], $data['tickets_available'], $data['price'], $data['image_link']);

        if ($stmt->execute()) {
            $stmt->close();
            return true;
        } else {
            echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        }
    } else {
        echo "Prepare failed: (" . $this->db->errno . ") " . $this->db->error;
    }

    return false;
}
}

?>
