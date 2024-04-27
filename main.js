// Displaying Cards
function loadData() {
    $.ajax({
        url: "products.php"
    }).done(function(data) {
        let result = JSON.parse(data);
        var template = document.querySelector("#card-template");
        var parent = document.querySelector("#row");

        result.forEach(item => {
            let clone = template.content.cloneNode(true);
            clone.querySelector(".card img.product-image").src = "images/" + item.product_image;
            // clone.querySelector(".card-body p.product-id").innerHTML = `<strong style="color: #6808B1;">ID:</strong> ${item.product_id}`;
            clone.querySelector(".card-body h5.product-name").innerHTML = `<b style="color: #6808B1; font-weight: 800">Product Name:</b> ${item.product_name}`;
            // clone.querySelector(".card-body p.product-category").innerHTML = `<b style="color: #6808B1;">Category ID:</b> ${item.product_category}`; // Display Category ID
            clone.querySelector(".card-body p.product-category-name").innerHTML = `<b style="color: #6808B1;">Category Name:</b> ${item.category_name}`; // Display Category Name
            clone.querySelector(".card-body p.product-quantity").innerHTML = `<b style="color: #6808B1;">Quantity:</b> ${item.product_quantity}`;
            clone.querySelector(".card-body input.product-id").value = item.product_id;

            let updateButton = clone.querySelector(".button.update-button");
            let deleteButton = clone.querySelector(".button.delete-button");
            updateButton.innerHTML = "Edit";
            deleteButton.innerHTML = "Delete";

            updateButton.addEventListener("click", function() {
                // Fill update modal with product data
                $("#updateProductId").val(item.product_id);
                $("#updateProductName").val(item.product_name);
                $("#updateProductCategory").val(item.product_category);
                $("#updateProductQuantity").val(item.product_quantity);
                
                // Set the product image and image name in the update modal
                $("#productImage").attr("src", "images/" + item.product_image);
                $("#updateImageName").text("Saved Image Name: " + item.product_image);
                
                // Display the saved image in the update product form
                $(".productImage").attr("src", "images/" + item.product_image);
                
                // Show the update modal
                $("#update-modal").modal("show");
            
                // When the modal is shown, reset the file input to allow selecting the same file again
                $('#updateProductImage').val('');
            });
            

            deleteButton.addEventListener("click", function() {
                console.log("Delete button clicked for product ID:", item.product_id);

                if (confirm("Are you sure you want to delete this product?")) {
                    $.ajax({
                        url: "products.delete.php",
                        type: "POST",
                        data: {
                            product_id: item.product_id
                        },
                        success: function(data) {
                            let result = JSON.parse(data);
                            if (result.res === "success") {
                                location.reload();
                            } else {
                                console.error("Error deleting product:", result.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("AJAX request failed:", error);
                        }
                    });
                }
            });

            parent.appendChild(clone);
        });
    });
}


loadData();

// ADD PRODUCT
$("#btnAdd").click(function() {
    var productImage = $("#productImage")[0].files[0];
    var productName = $("#productName").val();
    var productCategory = $("#productCategory").val();
    var productQuantity = $("#productQuantity").val();
    var productId = $("#productId").val();

    if (productName.length > 0 && productImage) {
        var formData = new FormData();
        formData.append('productImage', productImage);
        formData.append('product_name', productName);
        formData.append('product_category', productCategory);
        formData.append('product_quantity', productQuantity);
        formData.append('product_id', productId);

        $.ajax({
            url: "products.create.php",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                let result = JSON.parse(data);
                if (result.res === "success") {
                    createProductCard(result);

                    // Clear input fields
                    $("#productName").val("");
                    $("#productCategory").val("");
                    $("#productQuantity").val("");
                    $("#productImage").val("");

                    $("#create-modal").modal("hide");
                    // Reload the page
                    location.reload();
                } else {
                    console.error("Error creating product:", result.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });
    }
});

// ADD CATEGORY
$("#btnAddCategory").click(function() {
    var categoryName = $("#productCategoryName").val();
    if(categoryName.length > 0){
        $.ajax({
            url:  "categories.create.php",
            type: "GET",
            data: {
                name: categoryName
            },
            success: function(data) {
                let result = JSON.parse(data);
                if(result.res == "success"){
                    console.log("Category added successfully");
                    $("#productCategoryName").val(""); // Clear input field
                    $("#create-category-modal").modal("hide");
                    // You might not need to reload the page, it depends on your requirement
                    location.reload();
                } else {
                    console.error("Error adding category:", result.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", error);
            }
        });
    }
});

function createProductCard(product) {
    var cardHTML = `
    <div class="card">
        <img src="${product.image_url}" class="product-image" alt="Product Image" id="productImage">
        <div class="card-body">
            <input type="hidden" class="product-id" value="${product.product_id}"> 
            <h5 class="product-name">Product Name: ${product.product_name}</h5> <!-- Updated line -->
            <p class="product-id">ID: ${product.product_id} </p>
            <p class="product-category">Category: ${product.product_category}</p>
            <p class="product-category-name">Category Name: ${product.product_category_name}</p> <!-- New line -->
            <p class="product-quantity">Quantity: ${product.product_quantity}</p>
            <div class="button-group">
                <button class="button update-button" id="update-button" data-bs-toggle="modal" data-bs-target="#update-modal">Edit</button>
                <button class="button delete-button">Delete</button>
            </div>
        </div>
    </div>
`;


    $("#row").append(cardHTML);

    $(".update-button").last().click(function(){
        console.log("Edit button clicked for product ID:", product.product_id);
    });

    $(".delete-button").last().click(function() {
        console.log("Delete button clicked for product ID:", product.product_id);

        if (confirm("Are you sure you want to delete this product?")) {
            $.ajax({
                url: "products.delete.php",
                type: "POST",
                data: {
                    product_id: product.product_id
                },
                success: function(data) {
                    let result = JSON.parse(data);
                    if (result.res === "success") {
                        location.reload();
                    } else {
                        console.error("Error deleting product:", result.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error deleting product:", error);
                }
            });
        }
    });
}


// Fetch categories and populate product category select input
function loadCategories() {
    $.ajax({
        url: "categories.php", // Create a PHP file to fetch categories from the database
        success: function(data) {
            let categories = JSON.parse(data);
            let selectElement = $("#productCategory");

            // Clear previous options
            selectElement.empty();

            // Populate options
            categories.forEach(category => { 
                selectElement.append(`<option value="${category.category_id}">${category.category_name}</option>`);
            });
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch categories:", error);
        }
    });
}

// Call the function to load categories when the page loads
$(document).ready(function() {
    loadCategories();
});


// Function to populate category options in the update modal
function populateCategoryOptions(selectedCategory) {
    $.ajax({
        url: "categories.php", // Change this to the endpoint that fetches category data
        method: "GET",
        success: function(data) {
            let categories = JSON.parse(data);
            let selectElement = document.getElementById("updateProductCategory");

            // Clear existing options
            selectElement.innerHTML = "";

            // Add each category as an option
            categories.forEach(category => {
                let option = document.createElement("option");
                option.text = category.category_name;
                option.value = category.category_id;
                if (category.category_name === selectedCategory) {
                    option.selected = true; // Select the option if it matches the selected category
                }
                selectElement.appendChild(option);
            });
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch categories:", error);
        }
    });
}

// Function to populate update modal with product data
function populateUpdateModal(product) {
    $("#updateProductId").val(product.product_id);
    $("#updateProductName").val(product.product_name);
    $("#updateProductQuantity").val(product.product_quantity);
    $("#updateProductCategory").val(product.product_category);
    $("#productImage").attr("src", "images/" + product.product_image);
    $("#updateImageName").text("Saved Image Name: " + product.product_image);
    $("#update-modal").modal("show");
    $('#updateProductImage').val('');
}

$("#btnUpdate").click(function() {
    var updateProductId = $("#updateProductId").val();
    var updateProductName = $("#updateProductName").val();
    var updateProductCategory = $("#updateProductCategory").val();  
    var updateProductQuantity = $("#updateProductQuantity").val();
    var updateProductImage = $("#updateProductImage")[0].files[0];
    var formData = new FormData();

    formData.append('updateProductId', updateProductId);
    formData.append('updateProductName', updateProductName);
    formData.append('updateProductCategory', updateProductCategory);  // Use the category name directly
    formData.append('updateProductQuantity', updateProductQuantity);
    formData.append('updateProductImage', updateProductImage);

    $.ajax({
        url: "products.update.php",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(data) {
            let result = JSON.parse(data);
            if (result.res === "success") {
                location.reload();
            } else {
                console.error("Error updating product:", result.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
});


populateCategoryOptions();


// Loading images on modals
const productImage = document.getElementById("product-image-display"),
imageInput = document.getElementById("productImage");

imageInput.addEventListener("change", () => {
    productImage.src = URL.createObjectURL(imageInput.files[0]);
});

const updateProductImage = document.querySelector(".productImageUpdateDisplay"),
imageInputUpdate = document.getElementById("updateProductImage");

imageInputUpdate.addEventListener("change", () => {
    updateProductImage.src = URL.createObjectURL(imageInputUpdate.files[0]);
});

