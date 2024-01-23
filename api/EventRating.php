<?php
require_once 'Database.php';

class EventRating extends Database
{
    public function getAverageRating($eventId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT AVG(rating) AS averageRating FROM events_review WHERE event_id = :eventId");
            $stmt->bindParam(':eventId', $eventId);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result['averageRating'] ?: 0;
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function getEventComments($eventId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM events_review WHERE event_id = :eventId");
            $stmt->bindParam(':eventId', $eventId);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }
}


?>
