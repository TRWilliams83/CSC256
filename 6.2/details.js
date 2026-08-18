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
        lastFeeding: "",
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
        lastFeeding: "",
        lastUpdated: "Starter profile"
    },

    rainforest: {
        name: "Rainforest",
        species: "Bioactive Enclosure",
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

const profileName =
    document.getElementById("profileName");

const profileSpecies =
    document.getElementById("profileSpecies");

const animalName =
    document.getElementById("animalName");

const animalSpecies =
    document.getElementById("animalSpecies");

const habitatType =
    document.getElementById("habitatType");

const enclosureSize =
    document.getElementById("enclosureSize");

const lastFeeding =
    document.getElementById("lastFeeding");

const waterAvailable =
    document.getElementById("waterAvailable");

const lastUpdated =
    document.getElementById("lastUpdated");

const currentTemperature =
    document.getElementById("currentTemperature");

const currentHumidity =
    document.getElementById("currentHumidity");

const currentHealthScore =
    document.getElementById("currentHealthScore");

const preferredTemperature =
    document.getElementById("preferredTemperature");

const preferredHumidity =
    document.getElementById("preferredHumidity");

const idealTemperature =
    document.getElementById("idealTemperature");

const idealHumidity =
    document.getElementById("idealHumidity");

const profileRecommendations =
    document.getElementById("profileRecommendations");

const editProfileLink =
    document.getElementById("editProfileLink");

const imagePlaceholder =
    document.querySelector(".animal-image-placeholder");

// Get profiles saved through the Add/Edit Profile page.
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

// Combine the starter profiles with saved profiles.
function getAllProfiles() {
    const savedProfiles = getSavedProfiles();

    return {
        ...defaultProfiles,
        ...savedProfiles
    };
}

// Get the enclosure ID from the page address.
const pageParameters =
    new URLSearchParams(window.location.search);

let enclosureId =
    pageParameters.get("id");

const enclosureProfiles =
    getAllProfiles();

// Use Lorena if the address does not have a valid ID.
if (
    enclosureId === null ||
    enclosureProfiles[enclosureId] === undefined
) {
    enclosureId = "lorena";
}

const selectedProfile =
    enclosureProfiles[enclosureId];

// Calculate the enclosure health score.
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

// Create recommendations from the current conditions.
function createRecommendations(enclosure) {
    const recommendations = [];

    if (
        enclosure.temperature <
        enclosure.minimumTemperature
    ) {
        recommendations.push(
            "Temperature is below the preferred range. Check the heating equipment."
        );
    }

    if (
        enclosure.temperature >
        enclosure.maximumTemperature
    ) {
        recommendations.push(
            "Temperature is above the preferred range. Reduce heat or increase ventilation."
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

// Format the saved feeding date.
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

// Display the selected profile.
function displayProfile() {
    const score =
        calculateHealthScore(selectedProfile);

    const recommendations =
        createRecommendations(selectedProfile);

    document.title =
        selectedProfile.name +
        " | Project Gaia";

    profileName.textContent =
        selectedProfile.name +
        " Enclosure";

    profileSpecies.textContent =
        selectedProfile.species +
        " habitat profile";

    animalName.textContent =
        selectedProfile.name;

    animalSpecies.textContent =
        selectedProfile.species;

    habitatType.textContent =
        selectedProfile.habitatType;

    enclosureSize.textContent =
        selectedProfile.enclosureSize;

    lastFeeding.textContent =
        formatFeedingDate(
            selectedProfile.lastFeeding
        );

    if (selectedProfile.waterAvailable) {
        waterAvailable.textContent = "Yes";
    } else {
        waterAvailable.textContent = "No";
    }

    if (
        selectedProfile.lastUpdated === undefined ||
        selectedProfile.lastUpdated === ""
    ) {
        lastUpdated.textContent = "Not recorded";
    } else {
        lastUpdated.textContent =
            selectedProfile.lastUpdated;
    }

    currentTemperature.textContent =
        selectedProfile.temperature +
        " °F";

    currentHumidity.textContent =
        selectedProfile.humidity +
        "%";

    currentHealthScore.textContent =
        score +
        "%";

    preferredTemperature.textContent =
        selectedProfile.minimumTemperature +
        "–" +
        selectedProfile.maximumTemperature +
        " °F";

    preferredHumidity.textContent =
        selectedProfile.minimumHumidity +
        "–" +
        selectedProfile.maximumHumidity +
        "%";

    idealTemperature.textContent =
        selectedProfile.idealTemperature +
        " °F";

    idealHumidity.textContent =
        selectedProfile.idealHumidity +
        "%";

    imagePlaceholder.textContent =
        selectedProfile.name +
        " Image";

    editProfileLink.href =
        "profile.html?id=" +
        enclosureId;

    profileRecommendations.innerHTML = "";

    for (let recommendation of recommendations) {
        const listItem =
            document.createElement("li");

        listItem.textContent = recommendation;

        profileRecommendations.appendChild(listItem);
    }
}

displayProfile();
