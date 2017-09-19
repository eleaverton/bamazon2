var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'August1614#*',
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;

});

//putting quantity in here for now. may need to add separate connection
//to get this info and compare later. 
connection.query("SELECT item_id,product_name,price FROM products", function(err, results) {
        if (err) throw err;
        var productList = results;
        console.log(productList);
        connection.query("SELECT stock_quantity FROM products", function(err, results) {
        if (err) throw err;
        var quantityList = results;
        userOrder(productList, quantityList);

    });
    });


function userOrder(productList,quantityList){
	inquirer.prompt([{
        name: "idSelected",
        type: "input",
        message: "Enter the id of the item you would like to buy."
    },
    {
        name: "quantity_Selected",
        type: "input",
        message: "Enter the number of the selected item you would like to buy."
    },
]).then(function(answer) {
    var chosenItem;
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].item_id === parseInt(answer.idSelected)) {
            chosenItem = productList[i];
            if (parseInt(quantityList[i].stock_quantity) >= parseInt(answer.quantity_Selected)) {
            var newQuantity = parseInt(quantityList[i].stock_quantity) - parseInt(answer.quantity_Selected);

            connection.query(
                "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                function(err) {
                    if (err) throw err;
                    console.log('Item(s) purchased successfully');
                    var totalCost = (answer.quantity_Selected * chosenItem.price).toFixed(2);
                    console.log('Purchase total: $' + totalCost);
                })
        } else {
            console.log("Insufficient quantity available");
        }
        };
        
    };

});
}
