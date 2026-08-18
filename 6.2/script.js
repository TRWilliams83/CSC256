const defaultProfiles = {
    lorena: {
        name: "Lorena",
        species: "Leopard Gecko",
        habitatType: "Desert Habitat",
        enclosureSize: "40-Gallon Low-Profile Enclosure",
        temperature: 82,
        humidity: 37,
        idealTemperature: 82,
        idealHumidity: 45,
        minimumTemperature: 78,
        maximumTemperature: 88,
        minimumHumidity: 35,
        maximumHumidity: 50,
        waterAvailable: true,
        lastFeeding: "2026-08-17",
        lastUpdated: "Starter profile"
    },

    bohb: {
        name: "Bohb",
        species: "Pac-Man Frog",
        habitatType: "Tropical Forest Floor",
        enclosureSize: "20-Gallon Glass Enclosure",
        temperature: 76,
        humidity: 59,
        idealTemperature: 78,
        idealHumidity: 70,
        minimumTemperature: 75,
        maximumTemperature: 82,
        minimumHumidity: 65,
        maximumHumidity: 80,
        waterAvailable: true,
        lastFeeding: "2026-08-16",
        lastUpdated: "Starter profile"
    },

    rainforest: {
        name: "Rainforest",
        species: "Mourning Geckos",
        habitatType: "Tropical Bioactive Habitat",
        enclosureSize: "18 × 18 × 18 Enclosure",
        temperature: 74,
        humidity: 55,
        idealTemperature: 75,
        idealHumidity: 65,
        minimumTemperature: 72,
        maximumTemperature: 80,
        minimumHumidity: 60,
        maximumHumidity: 75,
        waterAvailable: true,
        lastFeeding: "",
        lastUpdated: "Starter profile"
    }
};

const enclosureList =
    document.getElementById("enclosureList");

const selectedName =
    document.getElementById("selectedName");

const selectedSpecies =
    document.getElementById("selectedSpecies");

const temperatureReading =
    document.getElementById("temperatureReading");

const humidityReading =
    document.getElementById("humidityReading");

const healthScore =
    document.getElementById("healthScore");

const recommendationList =
    document.getElementById("recommendationList");

const activityList =
    document.getElementById("activityList");

const readingButton =
    document.getElementById("readingButton");

const feedingButton =
    document.getElementById("feedingButton");

const waterButton =
    document.getElementById("waterButton");

let selectedEnclosure = null;
let enclosures = {};

// Get profiles saved through the profile form.
function getSavedProfiles() {
    const savedData =
        localStorage.getItem("gaiaProfiles");

    if (savedData === null) {
        return {};
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        return {};
    }
}

// Combine starter profiles with saved profiles.
function getAllProfiles() {
    const savedProfiles = getSavedProfiles();

    return {
        ...defaultProfiles,
        ...savedProfiles
    };
}

// Save one updated profile.
function saveProfile(profileId, profile) {
    const savedProfiles = getSavedProfiles();

    savedProfiles[profileId] = profile;

    localStorage.setItem(
        "gaiaProfiles",
        JSON.stringify(savedProfiles)
    );
}

// Get saved history.
function getHistory() {
    const savedHistory =
        localStorage.getItem("gaiaHistory");

    if (savedHistory === null) {
        return [];
    }

    try {
        return JSON.parse(savedHistory);
    } catch (error) {
        return [];
    }
}

// Add a session to saved history.
function addHistorySession(
    enclosure,
    activity,
    details,
    score
) {
    const history = getHistory();

    const newSession = {
        date: new Date().toISOString(),
        enclosure: enclosure.name,
        activity: activity,
        details: details,
        healthScore: score
    };

    history.push(newSession);

    localStorage.setItem(
        "gaiaHistory",
        JSON.stringify(history)
    );

    displayRecentActivity();
}

// Calculate an enclosure's health score.
function calculateHealthScore(enclosure) {
    let score = 100;

    const temperatureDifference = Math.abs(
        enclosure.temperature -
        enclosure.idealTemperature
    );

    const humidityDifference = Math.abs(
        enclosure.humidity -
        enclosure.idealHumidity
    );

    score -= temperatureDifference * 2;
    score -= humidityDifference;

    if (!enclosure.waterAvailable) {
        score -= 10;
    }

    if (score < 0) {
        score = 0;
    }

    return Math.round(score);
}

// Create recommendations based on current conditions.
function createRecommendations(enclosure) {
    const recommendations = [];

    if (
        enclosure.temperature <
        enclosure.minimumTemperature
    ) {
        recommendations.push(
            "Temperature is too low. Check the heating equipment."
        );
    }

    if (
        enclosure.temperature >
        enclosure.maximumTemperature
    ) {
        recommendations.push(
            "Temperature is too high. Reduce heat or increase ventilation."
        );
    }

    if (
        enclosure.humidity <
        enclosure.minimumHumidity
    ) {
        recommendations.push(
            "Humidity is too low. Add water or mist the enclosure."
        );
    }

    if (
        enclosure.humidity >
        enclosure.maximumHumidity
    ) {
        recommendations.push(
            "Humidity is too high. Increase ventilation."
        );
    }

    if (!enclosure.waterAvailable) {
        recommendations.push(
            "Fresh water needs to be added."
        );
    }

    if (recommendations.length === 0) {
        recommendations.push(
            "Current conditions are within the preferred ranges."
        );
    }

    return recommendations;
}

// Format the last feeding date.
function formatFeedingDate(dateValue) {
    if (
        dateValue === undefined ||
        dateValue === ""
    ) {
        return "Not recorded";
    }

    const date =
        new Date(dateValue + "T00:00:00");

    return date.toLocaleDateString();
}

// Choose the correct image for each enclosure.
function getProfileImage(profileId) {
    if (profileId === "lorena") {
        return "images/leopard-gecko.jpg";
    }

    if (profileId === "bohb") {
        return "images/pacman-frog.jpg";
    }

    if (profileId === "rainforest") {
        return "images/mourning-geckos.jpg";
    }

    return "images/gaia-image.jpg";
}

// Build one Dashboard enclosure card.
function createEnclosureCard(profileId, profile) {
    const card =
        document.createElement("article");

    card.classList.add("enclosure-card");

    const animalImage =
        document.createElement("img");

    animalImage.classList.add("animal-image");

    animalImage.src =
        getProfileImage(profileId);

    animalImage.alt =
        profile.name +
        " the " +
        profile.species;

    const nameHeading =
        document.createElement("h3");

    nameHeading.textContent =
        profile.name;

    const speciesText =
        document.createElement("p");

    speciesText.textContent =
        profile.species;

    const scoreText =
        document.createElement("p");

    const score =
        calculateHealthScore(profile);

    scoreText.innerHTML =
        "Health Score: <strong>" +
        score +
        "%</strong>";

    const selectButton =
        document.createElement("button");

    selectButton.classList.add("select-button");
    selectButton.type = "button";
    selectButton.dataset.enclosure = profileId;
    selectButton.textContent = "View Enclosure";

    selectButton.addEventListener(
        "click",
        function () {
            displayEnclosure(profileId);
        }
    );

    card.appendChild(animalImage);
    card.appendChild(nameHeading);
    card.appendChild(speciesText);
    card.appendChild(scoreText);
    card.appendChild(selectButton);

    enclosureList.appendChild(card);
}

// Build every Dashboard card.
function displayEnclosureCards() {
    enclosureList.innerHTML = "";

    const profileIds =
        Object.keys(enclosures);

    for (let profileId of profileIds) {
        createEnclosureCard(
            profileId,
            enclosures[profileId]
        );
    }
}

// Display the selected enclosure.
function displayEnclosure(profileId) {
    selectedEnclosure = profileId;

    const enclosure =
        enclosures[profileId];

    const score =
        calculateHealthScore(enclosure);

    const recommendations =
        createRecommendations(enclosure);

    selectedName.textContent =
        enclosure.name;

    selectedSpecies.textContent =
        enclosure.species +
        " | Last feeding: " +
        formatFeedingDate(enclosure.lastFeeding);

    temperatureReading.textContent =
        enclosure.temperature +
        " °F";

    humidityReading.textContent =
        enclosure.humidity +
        "%";

    healthScore.textContent =
        score +
        "%";

    recommendationList.innerHTML = "";

    for (let recommendation of recommendations) {
        const listItem =
            document.createElement("li");

        listItem.textContent =
            recommendation;

        recommendationList.appendChild(listItem);
    }
}

// Display the newest saved activities.
function displayRecentActivity() {
    const history = getHistory();

    history.sort(function (first, second) {
        return (
            new Date(second.date) -
            new Date(first.date)
        );
    });

    const recentHistory =
        history.slice(0, 5);

    activityList.innerHTML = "";

    if (recentHistory.length === 0) {
        const listItem =
            document.createElement("li");

        listItem.textContent =
            "No recent activity is available.";

        activityList.appendChild(listItem);
        return;
    }

    for (let session of recentHistory) {
        const listItem =
            document.createElement("li");

        listItem.textContent =
            session.enclosure +
            ": " +
            session.details;

        activityList.appendChild(listItem);
    }
}

// Confirm that an enclosure has been selected.
function enclosureIsSelected() {
    if (selectedEnclosure === null) {
        alert("Please select an enclosure first.");
        return false;
    }

    return true;
}

// Enter new temperature and humidity readings.
readingButton.addEventListener(
    "click",
    function () {
        if (!enclosureIsSelected()) {
            return;
        }

        const enclosure =
            enclosures[selectedEnclosure];

        const newTemperature = prompt(
            "Enter the current temperature in Fahrenheit:",
            enclosure.temperature
        );

        if (newTemperature === null) {
            return;
        }

        const newHumidity = prompt(
            "Enter the current humidity percentage:",
            enclosure.humidity
        );

        if (newHumidity === null) {
            return;
        }

        const temperatureNumber =
            Number(newTemperature);

        const humidityNumber =
            Number(newHumidity);

        if (
            Number.isNaN(temperatureNumber) ||
            Number.isNaN(humidityNumber)
        ) {
            alert("Please enter valid numbers.");
            return;
        }

        if (
            humidityNumber < 0 ||
            humidityNumber > 100
        ) {
            alert(
                "Humidity must be between 0 and 100."
            );

            return;
        }

        enclosure.temperature =
            temperatureNumber;

        enclosure.humidity =
            humidityNumber;

        enclosure.lastUpdated =
            new Date().toLocaleDateString();

        saveProfile(
            selectedEnclosure,
            enclosure
        );

        const score =
            calculateHealthScore(enclosure);

        addHistorySession(
            enclosure,
            "Reading",
            "Temperature updated to " +
                temperatureNumber +
                " °F and humidity updated to " +
                humidityNumber +
                "%.",
            score
        );

        displayEnclosureCards();
        displayEnclosure(selectedEnclosure);
    }
);

// Record a feeding.
feedingButton.addEventListener(
    "click",
    function () {
        if (!enclosureIsSelected()) {
            return;
        }

        const enclosure =
            enclosures[selectedEnclosure];

        const foodAnswer = prompt(
            "What food was given?",
            enclosure.lastFood || ""
        );

        if (foodAnswer === null) {
            return;
        }

        const foodType =
            foodAnswer.trim();

        if (foodType === "") {
            alert("Please enter the type of food.");
            return;
        }

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        enclosure.lastFeeding = today;
        enclosure.lastFood = foodType;

        enclosure.lastUpdated =
            new Date().toLocaleDateString();

        saveProfile(
            selectedEnclosure,
            enclosure
        );

        const score =
            calculateHealthScore(enclosure);

        addHistorySession(
            enclosure,
            "Feeding",
            foodType +
                " was recorded as the food given.",
            score
        );

        displayEnclosure(selectedEnclosure);

        alert(
            "Feeding recorded for " +
            enclosure.name +
            ": " +
            foodType
        );
    }
);

// Update water availability.
waterButton.addEventListener(
    "click",
    function () {
        if (!enclosureIsSelected()) {
            return;
        }

        const enclosure =
            enclosures[selectedEnclosure];

        const waterAnswer = prompt(
            "Update water status:\n" +
            "Enter 1 if fresh water is available.\n" +
            "Enter 2 if fresh water needs to be added."
        );

        if (waterAnswer === null) {
            return;
        }

        if (waterAnswer.trim() === "1") {
            enclosure.waterAvailable = true;
        } else if (waterAnswer.trim() === "2") {
            enclosure.waterAvailable = false;
        } else {
            alert("Please enter either 1 or 2.");
            return;
        }

        enclosure.lastUpdated =
            new Date().toLocaleDateString();

        saveProfile(
            selectedEnclosure,
            enclosure
        );

        const score =
            calculateHealthScore(enclosure);

        let waterMessage;

        if (enclosure.waterAvailable) {
            waterMessage =
                "Fresh water is available.";
        } else {
            waterMessage =
                "Fresh water needs to be added.";
        }

        addHistorySession(
            enclosure,
            "Water",
            waterMessage,
            score
        );

        displayEnclosureCards();
        displayEnclosure(selectedEnclosure);

        alert(
            enclosure.name +
            ": " +
            waterMessage
        );
    }
);

// Start the Dashboard.
function startDashboard() {
    enclosures = getAllProfiles();

    displayEnclosureCards();
    displayRecentActivity();

    const profileIds =
        Object.keys(enclosures);

    if (profileIds.length > 0) {
        displayEnclosure(profileIds[0]);
    }
}

startDashboard();
