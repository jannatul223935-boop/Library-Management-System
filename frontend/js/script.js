const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        fetch("http://localhost:3000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password,
                role
            })

        })
        .then(response => response.json())
        .then(data => {

            alert(data.message);

            if (data.success) {
                window.location.href = "login.html";
            }

        })
        .catch(function () {

            alert("Something went wrong!");

        });

    });

}


// Login

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        })

        .then(response => response.json())

        .then(data => {

            alert(data.message);

            if (data.success) {

                if (data.user.role === "admin") {

                    window.location.href = "admin.html";

                } else {

                    window.location.href = "user.html";

                }

            }

        })

        .catch(function () {

            alert("Something went wrong!");

        });

    });

}


// View Books

const bookTable = document.getElementById("bookTable");

if (bookTable) {

    fetch("http://localhost:3000/books")

        .then(response => response.json())

        .then(data => {

            data.books.forEach(function (book) {

                bookTable.innerHTML += `
                    <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.category}</td>
                        <td>${book.quantity}</td>
                        <td>
                            ${
                                book.quantity > 0
                                ? `<button onclick="borrowBook(${book.id})">
                                    Borrow
                                   </button>`
                                : "Not Available"
                            }
                        </td>
                    </tr>
                `;

            });

        })

        .catch(function (error) {

            console.log(error);
            alert("Failed to Load Books");

        });

}


// Borrow Book

function borrowBook(bookId) {

    fetch("http://localhost:3000/borrow-book", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            user_id: 2,
            book_id: bookId
        })

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {
            location.reload();
        }

    })

    .catch(function () {

        alert("Borrow Failed!");

    });

}


// My Borrowed Books

const borrowedBookTable = document.getElementById("borrowedBookTable");

if (borrowedBookTable) {

    fetch("http://localhost:3000/borrowed-books/2")

        .then(response => response.json())

        .then(data => {

            if (!data.success) {

                alert(data.message);
                return;

            }

            data.books.forEach(function (book) {

                borrowedBookTable.innerHTML += `
                    <tr>
                        <td>${book.borrow_id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>
                            ${new Date(book.borrow_date).toLocaleDateString()}
                        </td>
                        <td>${book.status}</td>
                        <td>
                            ${
                                book.status === "Borrowed"
                                ? `<button onclick="returnBook(${book.borrow_id})">
                                    Return
                                   </button>`
                                : "Returned"
                            }
                        </td>
                    </tr>
                `;

            });

        })

        .catch(function (error) {

            console.log(error);
            alert("Failed to Load Borrowed Books");

        });

}


// Return Book

function returnBook(borrowId) {

    fetch(`http://localhost:3000/return-book/${borrowId}`, {

        method: "PUT"

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {
            location.reload();
        }

    })

    .catch(function () {

        alert("Return Failed!");

    });

}
