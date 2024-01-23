<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Add other HTTP methods as needed
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once 'classes.php';

$database = new Database();
$conn = $database->getConnection();

// Get user ID from the request
$user_id = isset($_GET['userId']) ? $_GET['userId'] : die();

try {
    $pastPurchases = $database->getPastPurchases($user_id);

    if ($pastPurchases->rowCount() > 0) {
        $pastPurchasesArr = array();
        $pastPurchasesArr["pastPurchases"] = array();

        while ($row = $pastPurchases->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $pastPurchaseItem = array(
                "id" => $id,
                "user_id" => $user_id,
                "event_id" => $event_id,
                "status" => $status
                // Add other fields as needed
            );

            array_push($pastPurchasesArr["pastPurchases"], $pastPurchaseItem);
        }

        http_response_code(200);
        echo json_encode($pastPurchasesArr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No past purchases found for the user."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Error fetching past purchases: " . $e->getMessage()));
}
?>
