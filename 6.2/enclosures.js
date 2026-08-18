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
        waterAvailable: true
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
        waterAvailable: true
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
        waterAvailable: true
    }
};

const enclosureList =
    document.getElementById("enclosureList");

const totalEnclosures =
    document.getElementById("totalEnclosures");

const totalAnimals =
    document.getElementById("totalAnimals");

const totalAlerts =
    document.getElementById("totalAlerts");

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

// Get the IDs of profiles that were deleted.
function getDeletedProfileIds() {
    const deletedData =
        localStorage.getItem("gaiaDeletedProfiles");

    if (deletedData === null) {
        return [];
    }

    try {
        return JSON.parse(deletedData);
    } catch (error) {
        return [];
    }
}

// Combine starter profiles with saved profiles.
function getAllProfiles() {
    const savedProfiles = getSavedProfiles();
    const deletedProfileIds =
        getDeletedProfileIds();

    const profiles = {
        ...defaultProfiles,
        ...savedProfiles
    };

    for (let profileId of deletedProfileIds) {
        delete profiles[profileId];
    }

    return profiles;
}

// Choose the correct animal image.
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

// Calculate a health score.
function calculateHealthScore(profile) {
    let score = 100;

    const temperatureDifference = Math.abs(
        profile.temperature -
        profile.idealTemperature
    );

    const humidityDifference = Math.abs(
        profile.humidity -
        profile.idealHumidity
    );

    score -= temperatureDifference * 2;
    score -= humidityDifference;

    if (!profile.waterAvailable) {
        score -= 10;
    }

    if (score < 0) {
        score = 0;
    }

    return Math.round(score);
}

// Count the current care alerts.
function countProfileAlerts(profile) {
    let alertCount = 0;

    if (
        profile.temperature <
        profile.minimumTemperature ||
        profile.temperature >
        profile.maximumTemperature
    ) {
        alertCount++;
    }

    if (
        profile.humidity <
        profile.minimumHumidity ||
        profile.humidity >
        profile.maximumHumidity
    ) {
        alertCount++;
    }

    if (!profile.waterAvailable) {
        alertCount++;
    }

    return alertCount;
}

// Delete an enclosure.
function deleteEnclosure(profileId, profileName) {
    const confirmed = confirm(
        "Are you sure you want to delete " +
        profileName +
        "?"
    );

    if (!confirmed) {
        return;
    }

    const savedProfiles = getSavedProfiles();

    if (savedProfiles[profileId] !== undefined) {
        delete savedProfiles[profileId];

        localStorage.setItem(
            "gaiaProfiles",
            JSON.stringify(savedProfiles)
        );
    }

    const deletedProfileIds =
        getDeletedProfileIds();

    if (!deletedProfileIds.includes(profileId)) {
        deletedProfileIds.push(profileId);
    }

    localStorage.setItem(
        "gaiaDeletedProfiles",
        JSON.stringify(deletedProfileIds)
    );

    displayEnclosures();
}

// Create one enclosure card.
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

    speciesText.innerHTML =
        "<strong>Species:</strong> " +
        profile.species;

    const habitatText =
        document.createElement("p");

    habitatText.innerHTML =
        "<strong>Habitat:</strong> " +
        profile.habitatType;

    const temperatureText =
        document.createElement("p");

    temperatureText.innerHTML =
        "<strong>Temperature:</strong> " +
        profile.temperature +
        " °F";

    const humidityText =
        document.createElement("p");

    humidityText.innerHTML =
        "<strong>Humidity:</strong> " +
        profile.humidity +
        "%";

    const scoreText =
        document.createElement("p");

    scoreText.innerHTML =
        "<strong>Health Score:</strong> " +
        calculateHealthScore(profile) +
        "%";

    const alertText =
        document.createElement("p");

    alertText.innerHTML =
        "<strong>Care Alerts:</strong> " +
        countProfileAlerts(profile);

    const buttonArea =
        document.createElement("div");

    buttonArea.classList.add("form-buttons");

    const viewLink =
        document.createElement("a");

    viewLink.classList.add("primary-button");

    viewLink.href =
        "details.html?id=" +
        profileId;

    viewLink.textContent =
        "View Profile";

    const editLink =
        document.createElement("a");

    editLink.classList.add("secondary-button");

    editLink.href =
        "profile.html?id=" +
        profileId;

    editLink.textContent =
        "Edit";

    const deleteButton =
        document.createElement("button");

    deleteButton.classList.add("delete-button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener(
        "click",
        function () {
            deleteEnclosure(
                profileId,
                profile.name
            );
        }
    );

    buttonArea.appendChild(viewLink);
    buttonArea.appendChild(editLink);
    buttonArea.appendChild(deleteButton);

    card.appendChild(animalImage);
    card.appendChild(nameHeading);
    card.appendChild(speciesText);
    card.appendChild(habitatText);
    card.appendChild(temperatureText);
    card.appendChild(humidityText);
    card.appendChild(scoreText);
    card.appendChild(alertText);
    card.appendChild(buttonArea);

    enclosureList.appendChild(card);
}

// Display every profile and update the totals.
function displayEnclosures() {
    const profiles = getAllProfiles();
    const profileIds = Object.keys(profiles);

    let animalCount = 0;
    let alertCount = 0;

    enclosureList.innerHTML = "";

    for (let profileId of profileIds) {
        const profile = profiles[profileId];

        createEnclosureCard(
            profileId,
            profile
        );

        animalCount++;
        alertCount +=
            countProfileAlerts(profile);
    }

    if (profileIds.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.textContent =
            "No enclosures have been added.";

        enclosureList.appendChild(emptyMessage);
    }

    totalEnclosures.textContent =
        profileIds.length;

    totalAnimals.textContent =
        animalCount;

    totalAlerts.textContent =
        alertCount;
}

displayEnclosures();
