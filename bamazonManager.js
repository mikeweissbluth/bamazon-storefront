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
    managerMenu();
});

function loadProducts() {
    let query = 'SELECT * FROM products';
    connection.query(query, function(err, res) {
        // show the products
        console.table(res);

        // prompt Manager for product
        console.log("inventory:");
        console.log(res);
        promptCustomerForItem(res);
    });
}

//prompt manager for menu option -an array of strings is assigned to the variable menuOptions
function managerMenu(){
    let menuOptions = ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product",]
    //let allOptionsString = "";
    //creating a giant string with a list of all of our options
    //menuOptions.forEach(function(n){ allOptionsString += n+'\n' })

    //display a set of menu options
    inquirer.prompt([{
        type: 'list',
        // change the above from 'input' to 'list' so that we can have a responsive list.
        name: 'choice',
        choices: menuOptions,
        // in the msg, want to display each menu option to the manager using a foreach loop
        message: "Select one of the options"
        
    }]).then(function(val) {
    console.log("inquirer ran");
    //consolelogging the val to confirm the inquirer is doing the work in the background. A check to see what the inquirer is doing... 
    console.log(val.choice);
    //check if the user input is 'view products for sale' 
 
    if (val.choice == menuOptions[0]) {
        // then run the view products function- Manager needs to see: the item IDs, names, prices, and quantities
        viewProducts();
         }
    if (val.choice == menuOptions[1]) {
            // then run the view products function- Manager needs to see: the item IDs, names, prices, and quantities
            viewLowInventory();
        }
    if (val.choice == menuOptions[2]) {
        //run Add to Inventory
        addtoInventory();  
         }
    if (val.choice == menuOptions[3]) {
    //run Add to Inventory
    addingNewItemID();
        }  
    })
}
function viewProducts() {
    //the app should list every available item: the item IDs, names, prices, and quantities.
    let query = 'SELECT item_id, product_name, price, stock_quantity FROM products';
    connection.query(query, function(err, res) {
        //print a table of the result I got from the data base- using the columns above
        console.table(res);
    });
}
function viewLowInventory() {
    let query = 'SELECT * FROM products WHERE stock_quantity<5';
    connection.query(query, function(err, res) {
        //print a table of the result I got from the data base- using the columns above
        console.table(res);
    })
}
function addtoInventory() {
    inquirer.prompt([{
        type: 'input',
        name: 'item',
        message: "Please type a number for the item id you are adding to."
    }]).then(function(val) {
            console.log("inquirer ran");
            //consolelogging the val to confirm the inquirer is doing the work in the background. A check to see what the inquirer is doing... 
            console.log(val.item);
            //if the value in the string is a number then it will assign that value to the variable 'item_id". If it is not a number then it will throw an error.
            let item_id=parseInt(val.item);
            increaseInventory(item_id);
    });
}
function increaseInventory(item){
    inquirer.prompt([{
        type: 'input',
        name: 'item',
        message: "How many more units do you wish to add?"
    }]).then(function(val){
// the manager's input needs to be added to the quantity and then the table should print with a new quantity.
let query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?"
connection.query(query, 
    [val.item, item],
    function(err, res) {
    console.log(res)})
    });
}
//When a manager needs to add new item
function addingNewItemID(item){
    // adding prompts for the new item's profile: product_name, department_name, price, stock_quantity 
    inquirer.prompt([{
        type: 'input',
        name: 'product_name',
        message: "What is the product's name?"
    },
    {
        type: 'input',
        name: 'department_name',
        message: "Which department do you assign this product to?"
    },
    {
        type: 'input',
        name: 'price',
        message: "Price?"
    },
    {
        type: 'input',
        name: 'stock_quantity',
        message: "How many units do you wish to add?"
    }

]).then(function(val){
    console.log (val);
// the manager's input needs to be added to the quantity and then the table should print with a new quantity. "INSERT INTO table_name //(column1, column2, column3, ...)
//VALUES (value1, value2, value3, ...);
 let query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)"
connection.query(query, 
    [val.product_name, val.department_name, val.price, val.stock_quantity],
    function(err, res) {
    console.log(res)})
     });
}