<?php
include('dbconnect.php'); // Make sure this file contains the correct database connection details

if (isset($_GET['name'])) {
    $category_name = $_GET['name'];

    try {
        // Use a prepared statement to insert the category
        $query = "INSERT INTO category_table (category_name) VALUES (:category_name)";
        $statement = $connection->prepare($query);
        $statement->bindParam(':category_name', $category_name);

        if ($statement->execute()) {
            echo json_encode(array("res" => "success"));
        } else {
            echo json_encode(array("res" => "error", "message" => "Failed to insert category into the database."));
        }
    } catch (PDOException $e) {
        echo json_encode(array("res" => "error", "message" => "Database error: " . $e->getMessage()));
    }
} else {
    echo json_encode(array("res" => "error", "message" => "Category name not provided."));
}
?>
