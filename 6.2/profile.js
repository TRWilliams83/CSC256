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
        lastFeeding: ""
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
        lastFeeding: ""
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
        lastFeeding: ""
    }
};

const profileForm =
    document.getElementById("profileForm");

const formTitle =
    document.getElementById("formTitle");

const formDescription =
    document.getElementById("formDescription");

const formMessage =
    document.getElementById("formMessage");

const pageParameters =
    new URLSearchParams(window.location.search);

const editingId =
    pageParameters.get("id");

// Get profiles previously saved in the browser.
function getSavedProfiles() {
    const savedData =
        localStorage.getItem("gaiaProfiles");

    if (savedData === null) {
        return {};
    }

    return JSON.parse(savedData);
}

// Combine the original profiles with saved changes.
function getAllProfiles() {
    const savedProfiles = getSavedProfiles();

    return {
        ...defaultProfiles,
        ...savedProfiles
    };
}

// Load an existing profile into the form.
function loadProfile() {
    if (editingId === null) {
        return;
    }

    const profiles = getAllProfiles();
    const profile = profiles[editingId];

    if (profile === undefined) {
        formMessage.textContent =
            "The selected profile could not be found.";

        formMessage.style.display = "block";
        return;
    }

    formTitle.textContent =
        "Edit " + profile.name;

    formDescription.textContent =
        "Update the animal, habitat, and care information.";

    document.title =
        "Edit " +
        profile.name +
        " | Project Gaia";

    profileForm.elements.animalName.value =
        profile.name;

    profileForm.elements.species.value =
        profile.species;

    profileForm.elements.habitatType.value =
        profile.habitatType;

    profileForm.elements.enclosureSize.value =
        profile.enclosureSize;

    profileForm.elements.currentTemperature.value =
        profile.temperature;

    profileForm.elements.currentHumidity.value =
        profile.humidity;

    profileForm.elements.minimumTemperature.value =
        profile.minimumTemperature;

    profileForm.elements.maximumTemperature.value =
        profile.maximumTemperature;

    profileForm.elements.idealTemperature.value =
        profile.idealTemperature;

    profileForm.elements.minimumHumidity.value =
        profile.minimumHumidity;

    profileForm.elements.maximumHumidity.value =
        profile.maximumHumidity;

    profileForm.elements.idealHumidity.value =
        profile.idealHumidity;

    profileForm.elements.lastFeeding.value =
        profile.lastFeeding;

    profileForm.elements.waterAvailable.checked =
        profile.waterAvailable;
}

// Turn a profile name into a simple ID.
function createProfileId(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

// Validate the preferred temperature and humidity ranges.
function rangesAreValid(profile) {
    const temperatureIsValid =
        profile.minimumTemperature <=
        profile.idealTemperature &&
        profile.idealTemperature <=
        profile.maximumTemperature;

    const humidityIsValid =
        profile.minimumHumidity <=
        profile.idealHumidity &&
        profile.idealHumidity <=
        profile.maximumHumidity;

    if (!temperatureIsValid) {
        formMessage.textContent =
            "The ideal temperature must be between the minimum and maximum temperatures.";

        formMessage.style.display = "block";
        return false;
    }

    if (!humidityIsValid) {
        formMessage.textContent =
            "The ideal humidity must be between the minimum and maximum humidity values.";

        formMessage.style.display = "block";
        return false;
    }

    return true;
}

// Collect all current form values.
function getFormProfile() {
    return {
        name:
            profileForm.elements.animalName.value.trim(),

        species:
            profileForm.elements.species.value.trim(),

        habitatType:
            profileForm.elements.habitatType.value.trim(),

        enclosureSize:
            profileForm.elements.enclosureSize.value.trim(),

        temperature: Number(
            profileForm.elements.currentTemperature.value
        ),

        humidity: Number(
            profileForm.elements.currentHumidity.value
        ),

        minimumTemperature: Number(
            profileForm.elements.minimumTemperature.value
        ),

        maximumTemperature: Number(
            profileForm.elements.maximumTemperature.value
        ),

        idealTemperature: Number(
            profileForm.elements.idealTemperature.value
        ),

        minimumHumidity: Number(
            profileForm.elements.minimumHumidity.value
        ),

        maximumHumidity: Number(
            profileForm.elements.maximumHumidity.value
        ),

        idealHumidity: Number(
            profileForm.elements.idealHumidity.value
        ),

        lastFeeding:
            profileForm.elements.lastFeeding.value,

        waterAvailable:
            profileForm.elements.waterAvailable.checked,

        lastUpdated:
            new Date().toLocaleDateString()
    };
}

// Save the profile when the form is submitted.
profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const profile = getFormProfile();

    if (!rangesAreValid(profile)) {
        return;
    }

    const savedProfiles = getSavedProfiles();

    let profileId = editingId;

    if (profileId === null) {
        profileId = createProfileId(profile.name);
    }

    savedProfiles[profileId] = profile;

    localStorage.setItem(
        "gaiaProfiles",
        JSON.stringify(savedProfiles)
    );

    formMessage.textContent =
        profile.name +
        " was saved successfully.";

    formMessage.style.display = "block";

    formTitle.textContent =
        "Edit " + profile.name;

    formDescription.textContent =
        "The profile was saved in this browser.";

    document.title =
        "Edit " +
        profile.name +
        " | Project Gaia";
});

// Restore saved values when resetting an edit form.
profileForm.addEventListener("reset", function () {
    formMessage.style.display = "none";

    if (editingId !== null) {
        setTimeout(loadProfile, 0);
    }
});

loadProfile();
