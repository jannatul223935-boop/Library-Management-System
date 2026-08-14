// =========================
// REGISTER
// =/========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const role =
            document.getElementById("role").value;


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

        .catch(function (error) {

            console.log(error);

            alert("Something went wrong!");

        });

    });

}


// =========================
// LOGIN
// =========================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


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

                // Save logged-in user's role
                localStorage.setItem(
                    "userRole",
                    data.user.role
                );

                // Save logged-in user's ID
                localStorage.setItem(
                    "userId",
                    data.user.id
                );


                if (data.user.role === "admin") {

                    window.location.href =
                        "admin.html";

                } else {

                    window.location.href =
                        "user.html";

                }

            }

        })

        .catch(function (error) {

            console.log(error);

            alert("Something went wrong!");

        });

    });

}


// =========================
// USER ROLE & USER ID
// =========================

const userRole =
    localStorage.getItem("userRole");

const userId =
    localStorage.getItem("userId");


// =========================
// PAGE MODE
// =========================

// books.html
// books.html?mode=borrow
// books.html?mode=return

const urlParams =
    new URLSearchParams(window.location.search);

const pageMode =
    urlParams.get("mode");


// =========================
// AVAILABLE BOOKS
// =========================

const bookTable =
    document.getElementById("bookTable");

const availableBooksSection =
    document.getElementById("availableBooksSection");


if (pageMode === "return") {

    // Return mode-এ Available Books hide হবে

    if (availableBooksSection) {

        availableBooksSection.style.display =
            "none";

    }

} else {

    if (bookTable) {

        fetch("http://localhost:3000/books")

            .then(response => response.json())

            .then(data => {

                data.books.forEach(function (book) {

                    let action = "";


                    // =========================
                    // ADMIN
                    // =========================

                    if (userRole === "admin") {

                        action = `

                            <button
                            class="edit-btn"
                                onclick="editBook(${book.id})">

                                Edit

                            </button>


                            <button
                            class="edit-btn"
                                onclick="deleteBook(${book.id})">

                                Delete

                            </button>

                        `;

                    }


                    // =========================
                    // USER
                    // =========================

                    else {

                        if (book.quantity > 0) {

                            action = `

                                <button
                                class="borrow-btn"
                                    onclick="borrowBook(${book.id})">

                                    Borrow

                                </button>

                            `;

                        } else {

                            action =
                                "Not Available";

                        }

                    }


                    bookTable.innerHTML += `

                        <tr>

                            <td>
                                ${book.id}
                            </td>

                            <td>
                                ${book.title}
                            </td>

                            <td>
                                ${book.author}
                            </td>

                            <td>
                                ${book.category}
                            </td>

                            <td>
                                ${book.quantity}
                            </td>

                            <td>
                                ${action}
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

}


// =========================
// BORROW BOOK
// =========================

function borrowBook(bookId) {

    if (!userId) {

        alert("User not logged in!");

        return;

    }


    fetch("http://localhost:3000/borrow-book", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            // Logged-in user's ID
            user_id: Number(userId),

            // Selected book ID
            book_id: bookId

        })

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {

            window.location.href =
                "books.html?mode=borrow";

        }

    })

    .catch(function (error) {

        console.log(error);

        alert("Borrow Failed!");

    });

}


// =========================
// BORROWED BOOKS
// =========================

const borrowedBookTable =
    document.getElementById(
        "borrowedBookTable"
    );

const borrowedBooksSection =
    document.getElementById(
        "borrowedBooksSection"
    );


// =========================
// ADMIN - HIDE BORROWED BOOKS
// =========================

if (
    borrowedBooksSection &&
    userRole === "admin"
) {

    borrowedBooksSection.style.display =
        "none";

}


// =========================
// BORROW MODE - HIDE BORROWED BOOKS
// =========================

if (
    borrowedBooksSection &&
    pageMode === "borrow"
) {

    borrowedBooksSection.style.display =
        "none";

}

// =========================
// VIEW MODE - HIDE BORROWED BOOKS
// =========================

if (
    borrowedBooksSection &&
    (pageMode === "view" || pageMode === null)
) {

    borrowedBooksSection.style.display = "none";

}
// =========================
// RETURN MODE / VIEW MODE
// =========================

if (
    borrowedBookTable &&
    userRole !== "admin" &&
    pageMode === "return"
) {

    if (!userId) {

        alert("User not logged in!");

    } else {

        fetch(
            `http://localhost:3000/borrowed-books/${userId}`
        )

        .then(response => response.json())

        .then(data => {

            if (!data.success) {

                alert(data.message);

                return;

            }


            data.books.forEach(function (book) {

                let action = "";


                // =========================
                // BORROWED
                // =========================

                if (
                    book.status === "Borrowed"
                ) {

                    action = `

                        <button
                        class="return-btn"
                            onclick="returnBook(${book.borrow_id})">

                            Return

                        </button>

                    `;

                }


                // =========================
                // RETURNED
                // =========================

                else {

                    action =
                        "Returned";

                }


                // =========================
                // RETURN DATE
                // =========================

                let returnDate = "-";

                if (book.return_date) {

                    returnDate =
                        new Date(
                            book.return_date
                        ).toLocaleDateString();

                }


               borrowedBookTable.innerHTML += `

    <tr>

        <td>
            ${book.borrow_id}
        </td>

        <td>
            ${book.title}
        </td>

        <td>
            ${book.author}
        </td>

        <td>
            ${new Date(book.borrow_date).toLocaleDateString()}
        </td>

        <td>
            ${
                book.return_date
                    ? new Date(book.return_date).toLocaleDateString()
                    : "-"
            }
        </td>

        <td>
            ${book.status}
        </td>

        <td>
            ${action}
        </td>

    </tr>

`;

            });

        })

        .catch(function (error) {

            console.log(error);

            alert(
                "Failed to Load Borrowed Books"
            );

        });

    }

}


// =========================
// RETURN BOOK
// =========================

function returnBook(borrowId) {

    fetch(
        `http://localhost:3000/return-book/${borrowId}`,
        {

            method: "PUT"

        }

    )

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {

            window.location.href =
                "books.html?mode=return";

        }

    })

    .catch(function (error) {

        console.log(error);

        alert("Return Failed!");

    });

}


// =========================
// EDIT BOOK
// =========================

function editBook(bookId) {

    const title =
        prompt("Enter Book Title:");

    const author =
        prompt("Enter Author:");

    const category =
        prompt("Enter Category:");

    const quantity =
        prompt("Enter Quantity:");


    if (
        !title ||
        !author ||
        !category ||
        quantity === null
    ) {

        return;

    }


    fetch(
        `http://localhost:3000/edit-book/${bookId}`,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                title: title,

                author: author,

                category: category,

                quantity: quantity

            })

        }

    )

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {

            location.reload();

        }

    })

    .catch(function (error) {

        console.log(error);

        alert("Edit Failed!");

    });

}


// =========================
// DELETE BOOK
// =========================

function deleteBook(bookId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmDelete) {

        return;

    }


    fetch(
        `http://localhost:3000/delete-book/${bookId}`,
        {

            method: "DELETE"

        }

    )

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {

            location.reload();

        }

    })

    .catch(function (error) {

        console.log(error);

        alert("Delete Failed!");

    });

}
// =========================
// ADD BOOK
// =========================

const addBookForm = document.getElementById("addBookForm");

if (addBookForm) {

    addBookForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const category = document.getElementById("category").value;
        const quantity = document.getElementById("quantity").value;

        fetch("http://localhost:3000/add-book", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                author,
                category,
                quantity
            })

        })

        .then(response => response.json())

        .then(data => {

            alert(data.message);

            if (data.success) {

                window.location.href = "books.html";

            }

        })

        .catch(function (error) {

            console.log(error);

            alert("Failed to Add Book!");

        });

    });

}