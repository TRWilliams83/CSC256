const defaultProfiles = {
    lorena: {
        name: "Lorena",
        species: "Leopard Gecko",
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
        species: "Bioactive Enclosure",
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

const averageHealth =
    document.getElementById("averageHealth");

const activeAlerts =
    document.getElementById("activeAlerts");

const healthyEnclosures =
    document.getElementById("healthyEnclosures");

const enclosureFilter =
    document.getElementById("enclosureFilter");

const insightList =
    document.getElementById("insightList");

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

// Calculate one health score.
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

// Generate current alerts and recommendations.
function createRecommendations(profile) {
    const recommendations = [];

    if (
        profile.temperature <
        profile.minimumTemperature
    ) {
        recommendations.push(
            "Temperature is too low. Check the heating equipment."
        );
    }

    if (
        profile.temperature >
        profile.maximumTemperature
    ) {
        recommendations.push(
            "Temperature is too high. Reduce heat or increase ventilation."
        );
    }

    if (
        profile.humidity <
        profile.minimumHumidity
    ) {
        recommendations.push(
            "Humidity is too low. Add water or mist the enclosure."
        );
    }

    if (
        profile.humidity >
        profile.maximumHumidity
    ) {
        recommendations.push(
            "Humidity is too high. Increase ventilation."
        );
    }

    if (!profile.waterAvailable) {
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

// Count actual problems without counting the healthy message.
function countAlerts(profile) {
    let count = 0;

    if (
        profile.temperature <
        profile.minimumTemperature ||
        profile.temperature >
        profile.maximumTemperature
    ) {
        count++;
    }

    if (
        profile.humidity <
        profile.minimumHumidity ||
        profile.humidity >
        profile.maximumHumidity
    ) {
        count++;
    }

    if (!profile.waterAvailable) {
        count++;
    }

    return count;
}

// Add each profile to the filter menu.
function createFilterOptions(profiles) {
    const profileIds = Object.keys(profiles);

    for (let profileId of profileIds) {
        const option =
            document.createElement("option");

        option.value = profileId;
        option.textContent =
            profiles[profileId].name;

        enclosureFilter.appendChild(option);
    }
}

// Create a care insight card.
function createInsightCard(profileId, profile) {
    const card =
        document.createElement("article");

    card.classList.add("enclosure-card");

    const nameHeading =
        document.createElement("h3");

    nameHeading.textContent =
        profile.name;

    const speciesText =
        document.createElement("p");

    speciesText.textContent =
        profile.species;

    const score =
        calculateHealthScore(profile);

    const scoreText =
        document.createElement("p");

    scoreText.innerHTML =
        "<strong>Health Score:</strong> " +
        score +
        "%";

    const readingText =
        document.createElement("p");

    readingText.innerHTML =
        "<strong>Current Conditions:</strong><br>" +
        profile.temperature +
        " °F | " +
        profile.humidity +
        "% humidity";

    const targetText =
        document.createElement("p");

    targetText.innerHTML =
        "<strong>Preferred Conditions:</strong><br>" +
        profile.minimumTemperature +
        "–" +
        profile.maximumTemperature +
        " °F | " +
        profile.minimumHumidity +
        "–" +
        profile.maximumHumidity +
        "% humidity";

    const recommendationHeading =
        document.createElement("h4");

    recommendationHeading.textContent =
        "Recommendations";

    const recommendationList =
        document.createElement("ul");

    const recommendations =
        createRecommendations(profile);

    for (let recommendation of recommendations) {
        const listItem =
            document.createElement("li");

        listItem.textContent =
            recommendation;

        recommendationList.appendChild(listItem);
    }

    const viewLink =
        document.createElement("a");

    viewLink.classList.add("primary-button");

    viewLink.href =
        "details.html?id=" +
        profileId;

    viewLink.textContent =
        "View Profile";

    card.appendChild(nameHeading);
    card.appendChild(speciesText);
    card.appendChild(scoreText);
    card.appendChild(readingText);
    card.appendChild(targetText);
    card.appendChild(recommendationHeading);
    card.appendChild(recommendationList);
    card.appendChild(viewLink);

    insightList.appendChild(card);
}

// Update the health overview.
function displayOverview(profiles) {
    const profileIds = Object.keys(profiles);

    let totalHealth = 0;
    let totalAlertCount = 0;
    let healthyCount = 0;

    for (let profileId of profileIds) {
        const profile = profiles[profileId];

        totalHealth +=
            calculateHealthScore(profile);

        const profileAlerts =
            countAlerts(profile);

        totalAlertCount += profileAlerts;

        if (profileAlerts === 0) {
            healthyCount++;
        }
    }

    let average = 0;

    if (profileIds.length > 0) {
        average = Math.round(
            totalHealth / profileIds.length
        );
    }

    averageHealth.textContent =
        average + "%";

    activeAlerts.textContent =
        totalAlertCount;

    healthyEnclosures.textContent =
        healthyCount;
}

// Display the selected insight cards.
function displayInsights(selectedId) {
    const profiles = getAllProfiles();

    insightList.innerHTML = "";

    if (selectedId === "all") {
        const profileIds =
            Object.keys(profiles);

        for (let profileId of profileIds) {
            createInsightCard(
                profileId,
                profiles[profileId]
            );
        }
    } else {
        createInsightCard(
            selectedId,
            profiles[selectedId]
        );
    }
}

const profiles = getAllProfiles();

createFilterOptions(profiles);
displayOverview(profiles);
displayInsights("all");

enclosureFilter.addEventListener(
    "change",
    function () {
        displayInsights(
            enclosureFilter.value
        );
    }
);
