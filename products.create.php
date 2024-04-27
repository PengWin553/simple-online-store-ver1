<?php
include('dbconnect.php');  // Include your database connection file

if ($_FILES["productImage"]["error"] == 4) {
    echo "<script> alert('Image Does Not Exist'); </script>";
} else {
    $fileName = $_FILES["productImage"]["name"];
    $fileSize = $_FILES["productImage"]["size"];
    $tmpName = $_FILES["productImage"]["tmp_name"];

    $validImageExtension = ['jpg', 'jpeg', 'png'];
    $imageExtension = explode('.', $fileName);
    $imageExtension = strtolower(end($imageExtension));

    if (!in_array($imageExtension, $validImageExtension)) {
        echo "<script>alert('Invalid Image Extension');</script>";
    } else if ($fileSize > 1000000) {
        echo "<script>alert('Image Size Is Too Large');</script>";
    } else {
        $newImageName = uniqid();
        $newImageName .= '.' . $imageExtension;
        $product_image = $newImageName;
        move_uploaded_file($tmpName, 'images/' . $newImageName);

        $product_name = $_POST['product_name'];  // Use $_POST instead of $_GET
        $product_category = $_POST['product_category'];  // Use $_POST instead of $_GET
        $product_quantity = $_POST['product_quantity'];  // Use $_POST instead of $_GET

        // Insert data into the database
        $query = "INSERT INTO store_table (product_image, product_name, product_category, product_quantity) 
            VALUES (:product_image, :product_name, :product_category, :product_quantity)";
        $statement = $connection->prepare($query);
        // Bind parameters
        $statement->bindParam(':product_image', $product_image);
        $statement->bindParam(':product_name', $product_name);
        $statement->bindParam(':product_category', $product_category);
        $statement->bindParam(':product_quantity', $product_quantity);

        if ($statement->execute()) {
            $query = "SELECT category_name FROM category_table WHERE category_id = :product_category";
            $statement = $connection->prepare($query);
            $statement->bindParam(':product_category', $product_category);
            $statement->execute();
            $category_result = $statement->fetch(PDO::FETCH_ASSOC);

            $categoryName = $category_result['category_name'];

            echo ('');

            echo json_encode(array(
                "res" => "success",
                "product_id" => $connection->lastInsertId(),
                "image_url" => "images/$product_image",
                "product_name" => $product_name,
                "product_category" => $product_category,
                "product_category_name" => $categoryName,
                "product_quantity" => $product_quantity
            ));
        } else {
            echo "Error inserting data into the database.";
        }
        

    }
}
?>
