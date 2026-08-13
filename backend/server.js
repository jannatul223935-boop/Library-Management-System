const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", function (req, res) {
    res.json({
        message: "📚 Library Management System Server Running..."
    });
});
     // User Registration
app.post("/register", function (req, res) {

    const { name, email, password, role } = req.body;

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, password, role], function (error, result) {

        if (error) {
            res.json({
                success: false,
                message: "Registration Failed"
            });
        } else {
            res.json({
                success: true,
                message: "Registration Successful"
            });
        }

    });

});
        // User Login
app.post("/login", function (req, res) {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=? AND password=?";

    db.query(sql, [email, password], function (error, result) {

        if (error) {
            res.json({
                success: false,
                message: "Login Failed"
            });
        } else if (result.length > 0) {
            res.json({
                success: true,
                message: "Login Successful",
                user: result[0]
            });
        } else {
            res.json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

    });

});

                 // Add Book
app.post("/add-book", function (req, res) {

    const { title, author, category, quantity } = req.body;

    const sql = "INSERT INTO books (title, author, category, quantity) VALUES (?, ?, ?, ?)";

    db.query(sql, [title, author, category, quantity], function (error, result) {

        if (error) {
            res.json({
                success: false,
                message: "Book Added Failed"
            });
        } else {
            res.json({
                success: true,
                message: "Book Added Successfully"
            });
        }

    });

});
        // Server Start
app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});
