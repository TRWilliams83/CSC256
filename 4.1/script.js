// Get the form and output area
const gameForm = document.getElementById("gameForm");
const gameOutput = document.getElementById("gameOutput");

// Run when the form is submitted
gameForm.addEventListener("submit", function (event) {
    // Stop the page from refreshing
    event.preventDefault();

    // Get the values from the form fields
    const username = document.getElementById("username").value;
    const weapons = document.getElementById("weapons").value;
    const health = document.getElementById("health").value;
    const points = document.getElementById("points").value;

    // Display the entered information
    gameOutput.innerHTML =
        "<strong>User Name:</strong> " + username + "<br>" +
        "<strong>Weapons:</strong> " + weapons + "<br>" +
        "<strong>Health/Damage:</strong> " + health + "<br>" +
        "<strong>Point Total:</strong> " + points;
});
