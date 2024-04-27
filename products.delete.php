<?php
include_once("dbconnect.php");

if(isset($_POST['product_id'])) {
    $product_id = $_POST['product_id'];
    
    $query = "DELETE FROM store_table WHERE product_id = ?";
    $statement = $connection->prepare($query);
    $statement->execute([$product_id]);
    
    if($statement->rowCount() > 0) {
        echo json_encode(['res' => 'success']);
    } else {
        echo json_encode(['res' => 'error', 'message' => 'Product not found']);
    }
} else {
    echo json_encode(['res' => 'error', 'message' => 'Product ID not provided']);
}
?>
