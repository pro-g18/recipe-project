document.addEventListener("DOMContentLoaded", function () {
    // Check if navbar already exists to prevent duplication
    if (!document.querySelector(".navbar")) {
        fetch("navbar.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data);
                initializeNavbar(); // Attach event listeners after insertion
            })
            .catch(error => console.log("Error loading navbar:", error));
    }
});

function initializeNavbar() {
    const menuToggle = document.querySelector(".menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            document.querySelector(".navbar-menu").classList.toggle("active");
        });
    }
}
