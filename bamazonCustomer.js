let mysql = require('mysql');
let inquirer = require('inquirer');
require('console.table');

// initialize connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

// test connection
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
    }
    loadProducts();
});

function loadProducts() {
    let query = 'SELECT * FROM products';
    connection.query(query, function(err, res) {
        // show the products
        console.table(res);
4
        // prompt customer for product
        console.log("inventory:");
        console.log(res);
        //using the result we get from the database as an argument for the function below.
        promptCustomerForItem(res);
    });
}

function promptCustomerForItem(inventory) {
    // Prompts user for what they would like to purchase
    inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
          validate: function(val) {
            return !isNaN(val) || val.toLowerCase() === "q";
          }
        }
      ])
      .then(function(val) {
        // Check if the user wants to quit the program
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);
  
        // If there is a product with the id the user chose, prompt the customer for a desired quantity
        if (product) {
          // Pass the chosen product to promptCustomerForQuantity
          promptCustomerForQuantity(product);
        }
        else {
          // Otherwise let them know the item is not in the inventory, re-run loadProducts
          console.log("\nThat item is not in the inventory.");
          loadProducts();
        }
      });
  }
// finding out how many the customer wants
function promptCustomerForQuantity(product) {
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        // prompt for quanty
    }]).then(function(val) {
        let quantity = parseInt(val.quantity);
        if (quantity > product.stock_quantity) {
            console.log('not enough');
            loadProducts();
        } else {
            makePurchase(product, quantity);
        }
    })
}
// After the customer declares quantity, db calculates quantity in the warehouse for that particular product
function makePurchase(product, quantity) {
    connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
        [quantity, product.item_id],
        function(err, res) {
            console.log(res);
            loadProducts();
        }
    )
}
// for loop, looping through each item in the inventory. confirming the ID actually exists in our inventory
function checkInventory(choiceId, inventory) {
    for(var i=0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            return inventory[i];
        }
    }
    return null;
}