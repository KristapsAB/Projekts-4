    <?php

    class Database
    {
        private $host = "localhost";
        private $username = "root";
        private $password = "";
        private $dbname = "user_management";

        private $conn;

        public function __construct()
        {
            try {
                $this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->username, $this->password);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                echo "Connection failed: " . $e->getMessage();
            }
        }

        // Method to insert an event into the events table
        public function insertEvent($eventName, $eventDate, $location, $ticketsAvailable, $price, $imageLink, $genre)
        {
            try {
                $stmt = $this->conn->prepare("INSERT INTO events (event_name, event_date, location, tickets_available, price, image_link, genre) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$eventName, $eventDate, $location, $ticketsAvailable, $price, $imageLink, $genre]);
                return true;
            } catch (PDOException $e) {
                echo "Error: " . $e->getMessage();
                return false;
            }
        }
        
        public function getEvents()
        {
            try {
                $stmt = $this->conn->prepare("SELECT * FROM events");
                $stmt->execute();
                $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $events;
            } catch (PDOException $e) {
                echo "Error: " . $e->getMessage();
                return [];
            }
        }
        
        public function insertOrder($userId, $eventId, $quantity, $totalPrice)
    {
        try {
            $stmt = $this->conn->prepare("INSERT INTO orders (user_id, event_id, quantity, total_price) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $eventId, $quantity, $totalPrice]);
            return true;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function getOrdersByUserId($userId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT orders.*, events.event_name, events.event_date, events.location FROM orders INNER JOIN events ON orders.event_id = events.id WHERE user_id = ?");
            $stmt->execute([$userId]);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $orders;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function verifyToken($token, $userId)
        {
            // Fetch user data from the database based on the user ID
            $userData = $this->getUserById($userId);

            if (!$userData) {
                // User not found, token is invalid
                return false;
            }

            // Replace this with your actual token verification logic
            // For example, if you are using JWT, you might use a library to decode and verify the token
            // Here, we are assuming a simple comparison, which is not secure and should be replaced
            return $token === $userData['token'];
        }

        private function getUserById($userId)
        {
            try {
                $stmt = $this->conn->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                return $user;
            } catch (PDOException $e) {
                echo "Error: " . $e->getMessage();
                return false;
            }
        }

    public function getOrders($userId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM orders WHERE user_id = ?");
            $stmt->execute([$userId]);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $orders;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function insertCartItem($userId, $eventId)
    {
        try {
            $stmt = $this->conn->prepare("INSERT INTO cart (user_id, event_id) VALUES (?, ?)");
            $stmt->execute([$userId, $eventId]);
            return true;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }
    public function getCartItems($userId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT cart.*, events.event_name, events.event_date, events.location FROM cart INNER JOIN events ON cart.event_id = events.id WHERE user_id = ?");
            $stmt->execute([$userId]);
            $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $cartItems;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function updateCartItemStatus($cartItemId)
    {
        try {
            $stmt = $this->conn->prepare("UPDATE cart SET status = 'purchased' WHERE id = ?");
            $stmt->execute([$cartItemId]);
            return true;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }
    public function getCartItemsByUserId($userId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM cart WHERE user_id = ?");
            $stmt->execute([$userId]);
            $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $cartItems;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getCartItemsWithEventDetailsByUserId($userId)
    {
        try {
            $stmt = $this->conn->prepare("
                SELECT cart.id, events.event_name, events.event_date, events.location, events.price, COUNT(*) as tickets_amount, cart.status
                FROM cart
                INNER JOIN events ON cart.event_id = events.id
                WHERE cart.user_id = ?
                GROUP BY cart.event_id
            ");
            $stmt->execute([$userId]);
            $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $cartItems;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }
    public function getEventsToReview($userId)
    {
        try {
            // Fetch events that the user can review
            $stmt = $this->conn->prepare("
                SELECT events.id, events.event_name, events.event_date, events.location
                FROM events
                LEFT JOIN orders ON events.id = orders.event_id AND orders.user_id = ?
                WHERE events.event_date < NOW() AND orders.id IS NOT NULL
            ");
            $stmt->execute([$userId]);
            $eventsToReview = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $eventsToReview;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    // In your Database class

    public function submitEventReview($userId, $eventId, $rating, $comment)
    {
        try {
            // Check if the event ID exists
            $eventExists = $this->eventExists($eventId);

            if (!$eventExists) {
                // Return a response indicating failure without echoing an error message
                return false;
            }

            // Check if the user has already submitted a review for this event
            $existingReview = $this->getUserEventReview($userId, $eventId);

            if ($existingReview) {
                // User has already submitted a review for this event
                return false;
            }

            // Insert the event review into the database
            $stmt = $this->conn->prepare("INSERT INTO event_review (user_id, event_id, rating, comment) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $eventId, $rating, $comment]);

            return true;
        } catch (PDOException $e) {
            // Log the error for debugging purposes
            error_log("Error submitting review: " . $e->getMessage());
            return false;
        }
    }


    // Add a new function to check if the user has already submitted a review for the event
    public function getUserEventReview($userId, $eventId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM event_review WHERE user_id = ? AND event_id = ?");
            $stmt->execute([$userId, $eventId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result;
        } catch (PDOException $e) {
            // Log the error for debugging purposes
            error_log("Error checking existing review: " . $e->getMessage());
            return null;
        }
    }
    public function getRatedEvents()
{
    try {
        $stmt = $this->conn->prepare("
            SELECT
                e.id AS event_id,
                e.event_name,
                e.image_link,
                AVG(er.rating) AS average_rating,
                GROUP_CONCAT(CONCAT(u.username, ':', er.rating, ':', er.comment) SEPARATOR '|') AS reviews
            FROM
                events e
            JOIN
                event_review er ON e.id = er.event_id
            JOIN
                users u ON er.user_id = u.id
            GROUP BY
                e.id
            ORDER BY
                average_rating DESC;
        ");

        $stmt->execute();
        $eventsWithRatings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $eventsWithRatings;
    } catch (PDOException $e) {
        throw new Exception('Error fetching rated events: ' . $e->getMessage());
    }
}

    



    private function eventExists($eventId)
    {
        $stmt = $this->conn->prepare("SELECT COUNT(*) as count FROM events WHERE id = ?");
        $stmt->execute([$eventId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'] > 0;
    }


    public function getEventReviews($eventId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM event_reviews WHERE event_id = ?");
            $stmt->execute([$eventId]);
            $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $reviews;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getAverageEventRating($eventId)
    {
        try {
            $stmt = $this->conn->prepare("SELECT AVG(rating) as averageRating FROM event_review WHERE event_id = ?");
            $stmt->execute([$eventId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
            return ($result && $result['averageRating'] !== null) ? round($result['averageRating'], 2) : 0;
        } catch (PDOException $e) {
            // Log the error for debugging purposes
            error_log("Error getting average event rating: " . $e->getMessage());
            return 0;
        }
    }
    // Function to get comments for an event
    public function getEventComments($eventId) {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM event_review WHERE event_id = ?");
            $stmt->execute([$eventId]);
            $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $comments;
        } catch (PDOException $e) {
            // Log the error for debugging purposes
            error_log("Error getting event comments: " . $e->getMessage());
            return [];
        }
    }

    public function getUnpurchasedItemCount($userId)
        {
            try {
                $stmt = $this->conn->prepare("SELECT COUNT(*) as unpurchasedCount FROM cart WHERE user_id = ? AND status = 'not purchased'");
                $stmt->execute([$userId]);
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                return $result['unpurchasedCount'];
            } catch (PDOException $e) {
                echo "Error: " . $e->getMessage();
                return 0;
            }
        }
        public function getPastEvents($userId)
    {
        try {
            $stmt = $this->conn->prepare("
                SELECT events.id, events.event_name, events.event_date, events.location
                FROM events
                INNER JOIN orders ON events.id = orders.event_id
                WHERE orders.user_id = ? AND events.event_date < NOW()
            ");
            $stmt->execute([$userId]);
            $pastEvents = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $pastEvents;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }   
    }
    public function getConnection()
    {
        return $this->conn;
    }
    function getPastPurchases($user_id)
    {
        $query = "SELECT * FROM cart WHERE user_id = :user_id AND status = 'purchased'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        return $stmt;
    }

    }
    ?>
