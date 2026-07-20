// Store the slideshow information in an array.
const isopods = [
    {
        image: "images/dairy-cow.jpg",
        name: "Dairy Cow Isopod",
        description: "Dairy Cow isopods have bold black-and-white markings."
    },
    {
        image: "images/panda-king.jpg",
        name: "Panda King Isopod",
        description: "Panda King isopods are known for their dark and light panda-like pattern."
    },
    {
        image: "images/powder-orange.jpg",
        name: "Powder Orange Isopod",
        description: "Powder Orange isopods have a bright orange color and move quickly."
    },
    {
        image: "images/granulatum.jpg",
        name: "Armadillidium granulatum",
        description: "Armadillidium granulatum has a textured shell and can roll into a ball."
    }
];

// Start with the first image in the array.
let currentImage = 0;

// Connect the JavaScript to the HTML elements.
const isopodImage = document.getElementById("isopodImage");
const isopodName = document.getElementById("isopodName");
const isopodDescription = document.getElementById("isopodDescription");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

// Display the current image and information.
function showImage() {
    isopodImage.src = isopods[currentImage].image;
    isopodImage.alt = isopods[currentImage].name;
    isopodName.textContent = isopods[currentImage].name;
    isopodDescription.textContent = isopods[currentImage].description;
}

// Move forward one image.
function nextImage() {
    currentImage++;

    if (currentImage >= isopods.length) {
        currentImage = 0;
    }

    showImage();
}

// Move backward one image.
function previousImage() {
    currentImage--;

    if (currentImage < 0) {
        currentImage = isopods.length - 1;
    }

    showImage();
}

// Run the functions when the buttons are clicked.
nextButton.addEventListener("click", nextImage);
previousButton.addEventListener("click", previousImage);

// Automatically move to the next image every 5 seconds.
setInterval(nextImage, 5000);

// Display the first image when the page loads.
showImage();
