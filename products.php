<?php
include_once("dbconnect.php");

try {
    $query = "SELECT s.*, c.category_name
              FROM store_table s
              INNER JOIN category_table c ON s.product_category = c.category_id";
    $statement = $connection->prepare($query);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
} catch(PDOException $th) {
    echo json_encode(['error' => $th->getMessage()]);
}
?>
