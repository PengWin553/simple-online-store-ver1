<?php
include('dbconnect.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $productIdToUpdate = $_POST['updateProductId'];
    $updatedProductName = $_POST['updateProductName'];
    $updatedProductCategory = $_POST['updateProductCategory'];
    $updatedProductQuantity = $_POST['updateProductQuantity'];

    // Check if an image file was uploaded
    if ($_FILES['updateProductImage']['error'] != 4) {
        // Process the uploaded image
        $updatedProductImage = $_FILES['updateProductImage']['tmp_name'];
        $fileName = $_FILES['updateProductImage']['name'];
        $validImageExtension = ['jpg', 'jpeg', 'png'];
        $imageExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Validate the image extension
        if (in_array($imageExtension, $validImageExtension)) {
            $newImageName = uniqid() . '.' . $imageExtension;
            $updatedImagePath = 'images/' . $newImageName;
            move_uploaded_file($updatedProductImage, $updatedImagePath);
        } else {
            // Invalid image extension, retain the existing image
            $query = "SELECT product_image FROM store_table WHERE product_id = :product_id";
            $statement = $connection->prepare($query);
            $statement->bindParam(':product_id', $productIdToUpdate);
            $statement->execute();
            $existingImage = $statement->fetchColumn();
            $newImageName = $existingImage;
        }
    } else {
        // If no image was uploaded, retain the existing image
        $query = "SELECT product_image FROM store_table WHERE product_id = :product_id";
        $statement = $connection->prepare($query);
        $statement->bindParam(':product_id', $productIdToUpdate);
        $statement->execute();
        $existingImage = $statement->fetchColumn();
        $newImageName = $existingImage;
    }

    $query = "UPDATE store_table SET
              product_name = :updated_product_name,
              product_category = :updated_product_category,
              product_quantity = :updated_product_quantity,
              product_image = :updated_product_image
              WHERE product_id = :product_id";


        $statement = $connection->prepare($query);
        $statement->bindParam(':updated_product_name', $updatedProductName);
        $statement->bindParam(':updated_product_category', $updatedProductCategory);
        $statement->bindParam(':updated_product_quantity', $updatedProductQuantity);
        $statement->bindParam(':updated_product_image', $newImageName);
        $statement->bindParam(':product_id', $productIdToUpdate);

        // Execute the update query
        if ($statement->execute()) {
            // Successfully updated product data
            echo json_encode(['res' => 'success', 'message' => 'Product data updated successfully.']);
        } else {
            // Error updating product data
            echo json_encode(['res' => 'error', 'message' => 'Error updating product data.']);
        }
}

?>
