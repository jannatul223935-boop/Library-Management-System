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
// Server Start
app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});
