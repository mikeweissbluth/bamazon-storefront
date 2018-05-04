let mysql = require('mysql');
var inquirer = require("inquirer");
require('console.table');

//initialize connection
let connection = mysql. createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

//test connection
connection.connect(function(err){
    if (err) {
        console.error('error connecting: ' + err.stack);
    }
    console.log(connection.threadId);
    //RUN THE START FUNCTION AFTER THEC ONNECTION IS MADE TO PROMPT THE USER
    console.log(connection.threadID);
    loadProducts();
});

function loadProducts(){
    let query = 'SELECT * FROM products';
    connection.query(query, function(err, res){
        //show the products
        console.table(res);

        //prompt customer for the product
        promptCustomerForITem(res);
    });
}
function promptCustomerForITem(inventory) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: 'what is the ID of the item you would like to purchase?',
        }]).then(function(val){
            let choiceID = parseInt(val.choice);
            //query products to see if you have enough
            let products = checkInventory(choiceID, inventory);
            console(product);
            if (product) {
                promptCustomerForITem(product);
            }else {
                console.log("That item in not in our inventory");
                loadProducts();
            }
        });
}
function promptCustomerForQuantity(products) {
    inquirer.prompt({{
        //prompt for quantity
    }}).then(function(val){
        let quantity = parseInt(val.quantity);
        if (quantity > product.stock_quantity) {
            console.log('not enough');
            loadProducts ();
        }else {
            makePurchase(products, quantity);
        }
    })
}
function makePurchase(product.quantity) {
    connection.query(
            //update database
            'update products SET stock_quaityt = stock_quanityt - ? WHERE item = ?'
            [quantity, product.item_id],
            function(err, res) {

            }
    )
}
function checkInventory(choiceID, inventory){

}

function checkInventory(choiceID, inventory) {
    console.log(inventory);
    for(var i=0l i < inventory.length; i++) {
        console.log(inventory[i].item.id)
        if (inventory[i].item_id === choiceID) {
            console.log(choiceID);
            return inventory[i]; 
        }
    }
    return null; 
}