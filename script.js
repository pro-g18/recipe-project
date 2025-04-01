// API Key
const apiKey = "2d5b84afd7cc467babfb0f3eb7246195";
// const apiKey = "e761a83da06b4e0294c3acab0f5b0bb4";
async function fetchRecipes(searchTerm, ingredients, intolerances, maxReadyTime) {
    try {
        const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}
        &addRecipeInformation=true
        &fillIngredients=true
        &query=${searchTerm}
        &includeIngredients=${ingredients}
        &intolerances=${intolerances}
        &maxReadyTime=${maxReadyTime}
        &sort=popularity
        &withImages=true
        &imageType=jpg,png
        &number=10
    `;


        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.results.length === 0) {
            alert("No recipes found!");
            return;
        }

        displayRecipes(data.results); // Function to show recipes
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// Function to fetch full recipe details
function displayRecipes(recipes) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    // Store results in sessionStorage
    sessionStorage.setItem("savedRecipes", JSON.stringify(recipes));

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ready Time:</strong> ${recipe.readyInMinutes} minutes</p>
            <p><strong>Spoonacular Score:</strong> ${Math.round(recipe.spoonacularScore)} / 100</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <button onclick="openRecipeDetails(${recipe.id})">View Details</button>
        `;

        resultsContainer.appendChild(recipeCard);
    });
}

// Function to open recipe details in a new tab
function openRecipeDetails(recipeId) {
    window.open(`recipe-details.html?id=${recipeId}`, "_blank"); // Open in new tab
}


document.addEventListener("DOMContentLoaded", function () {
    // Search Bar Functionality (Enter + Search Button)
    document.getElementById("searchButton").addEventListener("click", searchRecipes);
    document.getElementById("searchInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchRecipes();
        }
    });

    // Popular Categories Functionality
    // Update this section to listen to the correct category items
    const categoryItems = document.querySelectorAll(".category-item");
    categoryItems.forEach(item => {
    item.addEventListener("click", function () {
        const category = item.querySelector(".category-tag").textContent.toLowerCase();
        searchByCategory(category); // Call searchByCategory with the selected category

    document.addEventListener("DOMContentLoaded", function () {
    const savedRecipes = sessionStorage.getItem("savedRecipes");
    if (savedRecipes) {
        displayRecipes(JSON.parse(savedRecipes)); // Restore previous results
    }
});

    });
});

});
// Search Recipe Functionality
function searchRecipes() {
    const query = document.getElementById("searchInput").value.trim();
    if (query === "") {
        alert("Please enter a search term.");
        return;
    }
    // URL for searching recipe
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&addRecipeInformation=true&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.results && data.results.length > 0) {
                displayRecipes(data.results);
            } else {
                displayNoResultsMessage();
            }
        })
        .catch(error => console.error("Error fetching recipes:", error));
}
function openRecipeDetails(recipeId) {
    const detailsPageUrl = `recipe-details.html?id=${recipeId}`;
    window.open(detailsPageUrl, "_blank"); // Opens in a new tab
}

// Update displayRecipes function to use openRecipeDetails
function displayRecipes(recipes) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ready Time:</strong> ${recipe.readyInMinutes} minutes</p>
            <p><strong>Spoonacular Score:</strong> ${Math.round(recipe.spoonacularScore)} / 100</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <button onclick="openRecipeDetails(${recipe.id})">View Details</button>
        `;

        resultsContainer.appendChild(recipeCard);
    });
}



// No Result Message
function displayNoResultsMessage() {
    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = `<p class="no-results">No recipes found. Try another search.</p>`;
}
// Recipe Detail Fetching Functionality
function getRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(recipe => {
            displayRecipeDetails(recipe);
        })
        .catch(error => console.error("Error fetching recipe details:", error));
}
// Recipe Detail Displaying Functionality
// Function to display full recipe details including instructions
function displayRecipeDetails(recipe) {
    const detailsContainer = document.getElementById("recipe-details");
    
    // Check if instructions are available
    const instructions = recipe.analyzedInstructions.length > 0 
        ? recipe.analyzedInstructions[0].steps.map(step => `<li>${step.number}. ${step.step}</li>`).join("") 
        : "<p>No instructions available.</p>";

    detailsContainer.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p><strong>Summary:</strong> ${recipe.summary}</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
        <p><strong>Spoonacular Score:</strong> ${Math.round(recipe.spoonacularScore)}/100</p>
        
        <h3>Ingredients:</h3>
        <ul>
            ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
        </ul>

        <h3>Nutrition:</h3>
        <p>Calories: ${recipe.nutrition.nutrients.find(n => n.name === "Calories")?.amount || "N/A"} kcal</p>
        <p>Protein: ${recipe.nutrition.nutrients.find(n => n.name === "Protein")?.amount || "N/A"}g</p>
        <p>Carbs: ${recipe.nutrition.nutrients.find(n => n.name === "Carbohydrates")?.amount || "N/A"}g</p>
        <p>Fat: ${recipe.nutrition.nutrients.find(n => n.name === "Fat")?.amount || "N/A"}g</p>

        <h3>Instructions:</h3>
        <ol>${instructions}</ol>
    `;
}

// Clear Recipe Details
function clearRecipeDetails() {
    document.getElementById("recipeDetails").innerHTML = "";
}
// Search By Category Functionality
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
