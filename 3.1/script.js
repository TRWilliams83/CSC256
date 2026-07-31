// Array that stores the movie titles
let movieList = [];

// Get the webpage elements
const movieInput = document.getElementById("movieInput");
const addButton = document.getElementById("addButton");
const displayButton = document.getElementById("displayButton");
const resetButton = document.getElementById("resetButton");
const movieOutput = document.getElementById("movieOutput");

// Add a movie title to the array
addButton.addEventListener("click", function () {
    const movieTitle = movieInput.value.trim();

    if (movieTitle !== "") {
        movieList.push(movieTitle);
        movieInput.value = "";
    }
});

// Sort and display the movie titles
displayButton.addEventListener("click", function () {
    movieList.sort();

    movieOutput.innerHTML = "";

    for (let i = 0; i < movieList.length; i++) {
        movieOutput.innerHTML += movieList[i] + "<br><br>";
    }
});

// Clear the movie list
resetButton.addEventListener("click", function () {
    movieList = [];
    movieOutput.innerHTML = "";
    movieInput.value = "";
});
