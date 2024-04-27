<?php
include('dbconnect.php');

$query = "SELECT * FROM category_table";
$statement = $connection->prepare($query);
$statement->execute();
$categories = $statement->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($categories);
?>
