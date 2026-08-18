const totalSessions =
    document.getElementById("totalSessions");

const readingSessions =
    document.getElementById("readingSessions");

const careSessions =
    document.getElementById("careSessions");

const historyFilter =
    document.getElementById("historyFilter");

const activityFilter =
    document.getElementById("activityFilter");

const historyTableArea =
    document.getElementById("historyTableArea");

const historyTableBody =
    document.getElementById("historyTableBody");

const emptyHistoryMessage =
    document.getElementById("emptyHistoryMessage");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

// Get saved history from the browser.
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

// Save an updated history list.
function saveHistory(history) {
    localStorage.setItem(
        "gaiaHistory",
        JSON.stringify(history)
    );
}

// Format a saved date and time.
function formatDate(dateValue) {
    const date = new Date(dateValue);

    return date.toLocaleString();
}

// Add enclosure names to the filter.
function createEnclosureFilter(history) {
    const enclosureNames = [];

    for (let session of history) {
        if (
            !enclosureNames.includes(
                session.enclosure
            )
        ) {
            enclosureNames.push(
                session.enclosure
            );
        }
    }

    enclosureNames.sort();

    for (let enclosureName of enclosureNames) {
        const option =
            document.createElement("option");

        option.value = enclosureName;
        option.textContent = enclosureName;

        historyFilter.appendChild(option);
    }
}

// Display the history summary.
function displaySummary(history) {
    let readingCount = 0;
    let careCount = 0;

    for (let session of history) {
        if (session.activity === "Reading") {
            readingCount++;
        } else {
            careCount++;
        }
    }

    totalSessions.textContent =
        history.length;

    readingSessions.textContent =
        readingCount;

    careSessions.textContent =
        careCount;
}

// Create one table row.
function createHistoryRow(session) {
    const row =
        document.createElement("tr");

    const dateCell =
        document.createElement("td");

    dateCell.textContent =
        formatDate(session.date);

    const enclosureCell =
        document.createElement("td");

    enclosureCell.textContent =
        session.enclosure;

    const activityCell =
        document.createElement("td");

    activityCell.textContent =
        session.activity;

    const detailCell =
        document.createElement("td");

    detailCell.textContent =
        session.details;

    const healthCell =
        document.createElement("td");

    if (
        session.healthScore === null ||
        session.healthScore === undefined
    ) {
        healthCell.textContent = "--";
    } else {
        healthCell.textContent =
            session.healthScore + "%";
    }

    row.appendChild(dateCell);
    row.appendChild(enclosureCell);
    row.appendChild(activityCell);
    row.appendChild(detailCell);
    row.appendChild(healthCell);

    historyTableBody.appendChild(row);
}

// Filter and display saved history.
function displayHistory() {
    const history = getHistory();

    const selectedEnclosure =
        historyFilter.value;

    const selectedActivity =
        activityFilter.value;

    const filteredHistory =
        history.filter(function (session) {
            const enclosureMatches =
                selectedEnclosure === "all" ||
                session.enclosure ===
                selectedEnclosure;

            const activityMatches =
                selectedActivity === "all" ||
                session.activity ===
                selectedActivity;

            return (
                enclosureMatches &&
                activityMatches
            );
        });

    filteredHistory.sort(function (first, second) {
        return (
            new Date(second.date) -
            new Date(first.date)
        );
    });

    historyTableBody.innerHTML = "";

    if (filteredHistory.length === 0) {
        historyTableArea.style.display = "none";
        emptyHistoryMessage.style.display = "block";
    } else {
        historyTableArea.style.display = "block";
        emptyHistoryMessage.style.display = "none";

        for (let session of filteredHistory) {
            createHistoryRow(session);
        }
    }

    displaySummary(history);
}

// Remove every saved history entry.
function clearHistory() {
    const confirmed = confirm(
        "Are you sure you want to clear all session history?"
    );

    if (!confirmed) {
        return;
    }

    saveHistory([]);

    historyFilter.innerHTML =
        '<option value="all">Show All Enclosures</option>';

    activityFilter.value = "all";

    displayHistory();
}

const savedHistory = getHistory();

createEnclosureFilter(savedHistory);
displayHistory();

historyFilter.addEventListener(
    "change",
    displayHistory
);

activityFilter.addEventListener(
    "change",
    displayHistory
);

clearHistoryButton.addEventListener(
    "click",
    clearHistory
);
