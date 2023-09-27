const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const app = express();
const path = require('path');
const multer = require('multer');

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ["POST","GET","PUT","DELETE"],
        credentials: true
    }
));

const storage = multer.diskStorage({

    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
    destination: (req, file, cb) => {
        cb(null, '../FrontEnd/public'); 
    },
});


const upload = multer({ storage : storage })


// Connect own database
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    port:3306,
    password:"password",
    database:"reactecommerce"
})

//Admin post new product.
app.post("/post-item", upload.single('image'), (req, res) => {
    const sql = "INSERT INTO products (product_name, product_description, product_price, product_image, product_quantity) VALUES (?,?,?,?,?)";

    const filename = req.file.filename;
    const values = [
        req.body.product_name,        
        req.body.product_description,
        req.body.product_price,
        filename,
        req.body.product_quantity
    ];

    db.query(sql, values, (err, data) =>{
        if(err){
            return res.status(500).json({ message: "Server error post new product."});
        } else{
            return res.status(200).json({ data, message: "Sever posted product success."});
        }
    });
});

//Admin delete item.
app.delete("/category-delete-item/:cProductId", (req, res) =>{
    const sql = "DELETE FROM products WHERE product_id = ?";
    const productId = req.params.cProductId;
    
    db.query(sql, [productId], (err, result) =>{
        if(!err){
            return res.json({
                Status : `Success to deleted productId-${productId} item.`,
                result
            });
        } else{
            return res.json({ message: "Error inside server."})
        }
    })

})

//Admin edit item.
app.put("/edit-category-item/:productId", upload.single('image'), (req, res) =>{
    const sql = "UPDATE products SET `product_name` = ?, `product_description` = ?, `product_price` = ?, `product_image` = ?, `product_quantity` = ? WHERE product_id = ?";

    const productId = req.params.productId;
    const image = req.file.filename;
    const values = [
        req.body.product_name,
        req.body.product_description,
        req.body.product_price,
        image,
        req.body.product_quantity
    ]

    db.query(sql, [...values, productId], (err, result) =>{
        if(!err){
            return res.json({
                Status : "Success to edit product.",
                result
            });
        } else{
            return res.json({ Message: "Error inside server."})
        }
    })
})


app.get('/users', (req, res) =>{
    const sql = "SELECT * FROM users";
    return db.query(sql, (err, data) =>{
        return res.json(Object.values(JSON.parse(JSON.stringify(data))));
    })
})

// When Logged In will show this token
const verifyUser = (req, res, next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.json({ Message: "Please provide the token."});
    } else{
        jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) =>{
            if(err){
                return res.json({ Message: " Authentication Error."})
            } else{
                req.id = decoded.id;
                req.name = decoded.name;
                req.email = decoded.email;
                req.phone = decoded.phone;
                req.address = decoded.address;
                req.gender = decoded.gender;
                req.isAdmin = decoded.isAdmin;
                next();
            }
        })
    }
}

// Get the user details form User db
app.get("/", verifyUser, (req, res) =>{
    return res.json({
        Status: "Success", 
        id: req.id,
        name: req.name,
        email: req.email,
        phone: req.phone,
        address: req.address,
        gender: req.gender,
        isAdmin: req.isAdmin})
})

// User register
app.post('/register', (req, res)=>{
    const sql = "INSERT INTO users (`name`, `email`, `phone`, `password`, `address`, `gender`) VALUES (?, ?, ?, ?, ?, ?)";
    const values =[
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.password,
        req.body.address,
        req.body.gender
    ]
    return db.query(sql, values, (err, data) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ error:"Error registering user" });
        }
        else{
            return res.status(200).json({ message: "User registered successful"});
        }
    });
});

// User login
app.post("/login",(req, res) =>{
    
    const sql = "SELECT *FROM users WHERE email = ? AND password = ?";

    db.query(sql, [
        req.body.email,
        req.body.password
    ], (err, data) =>{
        if(err) return res.json({ Message: "Server Side Error"});
        if(data.length > 0){
            
            const id = data[0].id;
            const name = data[0].name;
            const email = data[0].email;
            const password = data[0].password;
            const address = data[0].address;
            const phone = data[0].phone;
            const gender = data[0].gender;
            const isAdmin = data[0].isAdmin;

            const token = jwt.sign({ id, name, email, password, address, phone, gender, isAdmin }, "our-jsonwebtoken-secret-key", {expiresIn: "1d"});
            res.cookie('token', token);
            return res.json({ Status: "Success"});
        } else{
            return res.json({ Message: "No Records Existed"})
        }
    })
})

// Edit specific user
app.put("/edit/:id", (req, res) =>{
    const sql = "UPDATE users SET `name` = ?, `email` = ?, `phone` = ?, `password` = ?, `address` = ?, `gender` = ? WHERE id = ?";

    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.password,
        req.body.address,
        req.body.gender
    ]

    db.query(sql, [...values, id], (err, result) =>{
        if(!err){
            return res.json({
                Status : "Success",
                result
            });
        } else{
            return res.json({ Message: "Error inside server."})
        }
    })
})


app.get("/logout", (req, res) =>{
    res.clearCookie('token');
    return res.json({ Status: "Success"})
})


// Get Products
app.get("/products", (req, res) =>{
    const sql = "SELECT * FROM products";
    return db.query(sql, (err, data) =>{
        return res.json(Object.values(JSON.parse(JSON.stringify(data))));
    })
})

app.get("/single-item/:id", (req, res) =>{
    const productId = req.params.id;
    const sql = "SELECT * FROM products WHERE product_id = ?";

    db.query(sql, [productId], (err, result) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
      
        else if(result.length === 0){
            return res.status(404).json({ message: "Product not found" });
        }
        
        else{
            const product = result[0];
            res.json(product);
        }
    })
})



// Add to cart
app.post("/add-to-cart", (req, res) =>{
    const sql = "INSERT INTO cart (user_id, product_id, product_name, product_description, product_image, product_price, product_quantity) VALUES ( ?, ?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.user_id,
        req.body.product_id,
        req.body.product_name,
        req.body.product_description,
        req.body.product_image,
        req.body.product_price,
        req.body.product_quantity
    ]

    db.query(sql, values, (err, data) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ error: "Sever error Add to cart" });
        }
        else{
            return res.status(200).json({ data, message: "Sever cart added success"});
        }
    });
})

//Get cart id
app.get("/cart", (req, res) =>{
    const sql = "SELECT user_id, product_id, product_quantity FROM cart";
    return db.query(sql, (err, data) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error." });
        } else{
            return res.status(200).json({ data, message: "Server success to get cart."})
        }
    });
});

//Get all cart Item.
app.get("/my-cart", (req, res) =>{
    const sql = "SELECT * FROM cart";
    return db.query(sql, (err, data) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error." });
        } else{
            return res.status(200).json({ data, message: "Server success to get cart."})
        }
    });
})

//Update existing cart Item.
app.put("/cart-update/:productId/:userId", (req, res) =>{
    const sql = "UPDATE cart SET `product_quantity` = ? , `updated_at` = ? WHERE product_id = ? AND user_id = ?";

    const userId = req.body.user_id;
    const productId = req.body.product_id;
    const values = [ 
        req.body.product_quantity,
        req.body.updated_at
    ]

    db.query(sql, [...values, productId, userId], (err, result) =>{
        if(!err){
            return res.json({
                Status : "Success to added to cart.",
                result
            });
        } else{
            return res.json({ message: "Error inside server."})
        }
    })
})

//Delete specific cart item.
app.delete("/cart-delete-item/:cProductId/:cUserId", (req, res) =>{
    const sql = "DELETE FROM cart WHERE product_id = ? AND user_id = ?";
    const productId = req.params.cProductId;
    const userId = req.params.cUserId;
    
    db.query(sql, [productId, userId], (err, result) =>{
        if(!err){
            return res.json({
                Status : `Success to deleted productId-${productId} item.`,
                result
            });
        } else{
            return res.json({ message: "Error inside server."})
        }
    })

})

//Delete ALL items.
app.delete("/cart-clear-items/:userId", (req, res) =>{
    const sql = "DELETE FROM cart WHERE user_id = ?";
    const userId = req.params.userId;
    
    db.query(sql, [userId], (err, result) =>{
        if(!err){
            return res.json({
                Status : `Success to clear all items.`,
                result
            });
        } else{
            return res.json({ message: "Error inside server."})
        }
    })

})

app.post("/cart-history", (req, res) =>{
    const sql = "INSERT INTO cart_history (`user_id`, `product_id`, `product_name`, `product_image`, `product_price`, `product_quantity`) VALUES (?, ?, ?, ?, ?, ?)";

    const values =[
        req.body.user_id,
        req.body.product_id,
        req.body.product_name,
        req.body.product_image,
        req.body.product_price,
        req.body.product_quantity
    ]
    
    return db.query(sql, values, (err, data) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ error:"Error inserted to history" });
        }
        else{
            return res.status(200).json({ message: "History inserted successful"});
        }
    });
});

//After checkout then add bought amount.
app.put("/cart-bought/:productId", (req, res) =>{
    const sql = "UPDATE products SET `bought_amount` = ? WHERE product_id = ?";

    const productId = req.params.productId;
    const values = [ 
        req.body.bought_amount
    ]
    db.query(sql, [...values, productId], (err, result) =>{
        if(!err){
            return res.json({
                Status : "Success to added to cart.",
                result
            });
        } else{
            return res.json({ message: "Error inside server."})
        }
    });
});

//Get user cart history.
app.get("/cart-history", (req, res) =>{
    const sql = "SELECT * FROM cart_history";

    return db.query(sql, (err, data) =>{
        if(err){
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error." });
        } else{
            return res.status(200).json({ data, message: "Server success to get cart."})
        }
    });
});

//Delete cart history.
app.delete("/delete-cart-history/:cartId",  (req, res) =>{
    const sql = "DELETE FROM cart_history WHERE cart_history_id = ?";
    const cartId = req.params.cartId;
    
    db.query(sql, [cartId], (err, result) =>{
        if(!err){
            return res.json({
                Status : `Success to deleted cartId-${cartId} history.`,
                result
            });
        } else{
            return res.json({ message: "Error inside server."})
        }
    })
})

 //Delete all of the history data.
app.delete("/clear-all-history/:userId",  (req, res) =>{
    const sql = "DELETE FROM cart_history WHERE user_id = ?";
    const userId = req.params.userId;
    
    db.query(sql, [userId], (err, result) =>{
        if(!err){
            return res.json({
                Status : `Success to deleted userId-${userId} all of the history data.`,
                result
            });
        } else{
            return res.json({ message: "Error inside server."})
        }
    })
})




app.listen(7000, () =>{
    console.log("Listening 7000");
});