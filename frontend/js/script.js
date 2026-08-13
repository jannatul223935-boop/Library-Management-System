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