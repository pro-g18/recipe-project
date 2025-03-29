const apiKey = "2d5b84afd7cc467babfb0f3eb7246195";

document.addEventListener("DOMContentLoaded", function () {
    // Attach event listeners
    document.getElementById("searchButton").addEventListener("click", searchRecipes);
    document.getElementById("searchInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchRecipes();
        }
    });

    // Add event listeners for popular categories
    const categoryButtons = document.querySelectorAll(".category-button");
    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            searchByCategory(button.dataset.category);
        });
    });
});

function searchRecipes() {
    const query = document.getElementById("searchInput").value.trim();
    if (query === "") {
        alert("Please enter a search term.");
        return;
    }

    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&addRecipeInformation=true&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                displayRecipes(data.results);
            } else {
                displayNoResultsMessage();
            }
        })
        .catch(error => console.error("Error fetching recipes:", error));
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = ""; // Clear previous results

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-item");

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ready in:</strong> ${recipe.readyInMinutes} mins</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <button onclick="getRecipeDetails(${recipe.id})">View Details</button>
        `;

        recipeList.appendChild(recipeCard);
    });
}

function displayNoResultsMessage() {
    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = `<p class="no-results">No recipes found. Try another search.</p>`;
}

function getRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(recipe => {
            displayRecipeDetails(recipe);
        })
        .catch(error => console.error("Error fetching recipe details:", error));
}

function displayRecipeDetails(recipe) {
    const recipeDetails = document.getElementById("recipeDetails");
    recipeDetails.innerHTML = `
        <div class="recipe-detail-box">
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p><strong>Time:</strong> ${recipe.readyInMinutes} mins</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <h3>Ingredients:</h3>
            <ul>${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}</ul>
            <h3>Instructions:</h3>
            <p>${recipe.instructions ? recipe.instructions : "Instructions not available."}</p>
            <button onclick="clearRecipeDetails()">Close</button>
        </div>
    `;
}

function clearRecipeDetails() {
    document.getElementById("recipeDetails").innerHTML = "";
}

function searchByCategory(category) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${category}&number=10&addRecipeInformation=true&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                displayRecipes(data.results);
            } else {
                displayNoResultsMessage();
            }
        })
        .catch(error => console.error("Error fetching category recipes:", error));
}
