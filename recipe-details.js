// Get recipe ID from URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

// const apiKey = "e761a83da06b4e0294c3acab0f5b0bb4"; // Your Spoonacular API key
const apiKey = "2d5b84afd7cc467babfb0f3eb7246195";

async function fetchRecipeDetails(recipeId) {
    try {
        const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=true`;

        const response = await fetch(detailsUrl);
        const recipe = await response.json();

        displayRecipeDetails(recipe); // Function to display recipe details
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}

// Function to display the fetched recipe details
function displayRecipeDetails(recipe) {
    const detailsContainer = document.querySelector(".recipe-container");

    if (!recipe || !recipe.title) {
        detailsContainer.innerHTML = "<h2>Recipe Not Found</h2>";
        return;
    }

    // Check if instructions exist
    const instructions = recipe.analyzedInstructions.length > 0
        ? recipe.analyzedInstructions[0].steps.map(step => `<li>${step.number}. ${step.step}</li>`).join("")
        : "<p>No instructions available.</p>";

    detailsContainer.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>Summary:</h3>
        <p> ${recipe.summary}</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
        <p><strong>Spoonacular Score:</strong> ${Math.round(recipe.spoonacularScore)}/100</p>
        
        <h3>Ingredients:</h3>
        <ul>
            ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
        </ul>

        <h3>Instructions:</h3>
        <ol>${instructions}</ol>
    `;
}

// Call function to fetch and display details
if (recipeId) {
    fetchRecipeDetails(recipeId);
} else {
    document.querySelector(".recipe-container").innerHTML = "<h2>Invalid Recipe</h2>";
}

