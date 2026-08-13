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

        // View All Books
app.get("/books", function (req, res) {

    const sql = "SELECT * FROM books";

    db.query(sql, function (error, result) {

        if (error) {
            res.json({
                success: false,
                message: "Failed to Load Books"
            });
        } else {
            res.json({
                success: true,
                books: result
            });
        }

    });

});

         // Edit Book
app.put("/edit-book/:id", function (req, res) {

    const id = req.params.id;
    const { title, author, category, quantity } = req.body;

    const sql = "UPDATE books SET title=?, author=?, category=?, quantity=? WHERE id=?";

    db.query(sql, [title, author, category, quantity, id], function (error, result) {

        if (error) {
            res.json({
                success: false,
                message: "Book Update Failed"
            });
        } else {
            res.json({
                success: true,
                message: "Book Updated Successfully"
            });
        }

    });

});
      // Delete Book
app.delete("/delete-book/:id", function (req, res) {

    const id = req.params.id;

    const sql = "DELETE FROM books WHERE id=?";

    db.query(sql, [id], function (error, result) {

        if (error) {
            res.json({
                success: false,
                message: "Book Delete Failed"
            });
        } else {
            res.json({
                success: true,
                message: "Book Deleted Successfully"
            });
        }

    });

});
          // Borrow Book
app.post("/borrow-book", function (req, res) {

    const { user_id, book_id } = req.body;

    const insertQuery = `
        INSERT INTO borrow_records (user_id, book_id, borrow_date, status)
        VALUES (?, ?, CURDATE(), 'Borrowed')
    `;

    db.query(insertQuery, [user_id, book_id], function (error) {

        if (error) {
            return res.json({
                success: false,
                message: "Borrow Failed"
            });
        }

        const updateQuery = "UPDATE books SET quantity = quantity - 1 WHERE id=? AND quantity > 0";

        db.query(updateQuery, [book_id], function (error) {

            if (error) {
                res.json({
                    success: false,
                    message: "Quantity Update Failed"
                });
            } else {
                res.json({
                    success: true,
                    message: "Book Borrowed Successfully"
                });
            }

        });

    });

});

// Return Book
app.put("/return-book/:id", function (req, res) {

    const borrowId = req.params.id;

    const updateBorrow = `
        UPDATE borrow_records
        SET status='Returned', return_date=CURDATE()
        WHERE id=?
    `;

    db.query(updateBorrow, [borrowId], function (error) {

        if (error) {
            return res.json({
                success: false,
                message: "Return Failed"
            });
        }

        const getBook = "SELECT book_id FROM borrow_records WHERE id=?";

        db.query(getBook, [borrowId], function (error, result) {

            if (error || result.length === 0) {
                return res.json({
                    success: false,
                    message: "Book Not Found"
                });
            }

            const bookId = result[0].book_id;

            const updateBook = "UPDATE books SET quantity = quantity + 1 WHERE id=?";

            db.query(updateBook, [bookId], function (error) {

                if (error) {
                    res.json({
                        success: false,
                        message: "Quantity Update Failed"
                    });
                } else {
                    res.json({
                        success: true,
                        message: "Book Returned Successfully"
                    });
                }

            });

        });

    });

});
// Server Start
app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});
