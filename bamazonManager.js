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

inquirer.prompt([{
        name: "mgrChoice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function(answer) {
            if (answer.mgrChoice === "View Products for Sale") {
                connection.query("SELECT item_id,product_name,price,stock_quantity FROM products", function(err, results) {
                    if (err) throw err;
                    console.log(results);
                });
            } else if (answer.mgrChoice === "View Low Inventory") {
                connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, results) {
                    if (err) throw err;
                    console.log(results);
                });
            } else if (answer.mgrChoice === "Add to Inventory") {
                inquirer.prompt([{
                        name: "idSelected",
                        type: "input",
                        message: "Enter the id of the item you would like to add."
                    },
                    {
                        name: "quantity_Selected",
                        type: "input",
                        message: "Enter updated quantity."
                    },
                ]).then(function(answer) {
                        connection.query("UPDATE products SET ? WHERE ?",[
                        	{
                        		stock_quantity:answer.quantity_Selected
                        	},
                        	{
                        		item_id:answer.idSelected
                        	}
                        	], function(err){
                        	if (err) throw err;
                        	console.log("Items added successfully");	
                        });
                     });  


                    } else if (answer.mgrChoice === "Add New Product") {
                    	inquirer.prompt([
                    	{
                    		name:"newProduct",
                    		type:"insert",
                    		message: "What product would you like to add to bamazon?"
                    	},
                    	{
                    		name:"newProductDepartment",
                    		type: "insert",
                    		message: "What department does this product belong in?"
                    	},
                    	{
                    		name:"newProductPrice",
                    		type:"insert",
                    		message: "How much does this product cost?"
                    	},
                    	{
                    		name:"newProductQuantity",
                    		type:"insert",
                    		message: "How many of this item are in inventory?"
                    	}

                    		]).then(function(answer){
                    			var values = {
                    				product_name:answer.newProduct,
                    				department_name:answer.newProductDepartment,
                    				price:answer.newProductPrice,
                    				stock_quantity: answer.newProductQuantity
                    			};
                   
                    			connection.query("INSERT INTO products SET ?", values, function(err){
                    				if (err) throw err;
                    				console.log("Item Added!");
                    			})
                    		});

                    	
                    }
                })