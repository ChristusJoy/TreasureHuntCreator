// Firebase initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyA_kRvUF-Thdbumx8Uqz6lMvpHTszA1ODo",
  authDomain: "treasurehunt-3e86a.firebaseapp.com",
  projectId: "treasurehunt-3e86a",
  storageBucket: "treasurehunt-3e86a.appspot.com",
  messagingSenderId: "76648533191",
  appId: "1:76648533191:web:d143846a49f2a253abc2e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const huntCodeInput = document.getElementById('huntCode');
const joinButton = document.getElementById('joinHunt');
const mapContainer = document.getElementById('mapContainer');

// Join hunt button click handler
joinButton.addEventListener('click', async () => {
    const huntCode = huntCodeInput.value.trim();
    if (huntCode) {
        loadMap(huntCode);
    } else {
        alert("Please enter a valid hunt code.");
    }
});

// Load the map from Firestore
async function loadMap(mapCode) {
    const docRef = doc(db, "treasure_maps", mapCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();

        // Create image element and set source to Base64 data
        const img = document.createElement('img');
        img.src = data.imageBase64; // Use the Base64 image string from Firestore
        img.id = 'uploadedImage';
        
        img.onload = () => {
            mapContainer.innerHTML = ''; // Clear any existing content in map container
            mapContainer.appendChild(img); // Append image to map container

            // Place pins after image is loaded
            placePins(data.pins, img);
        };

        img.crossOrigin = 'anonymous'; // Ensure CORS handling if necessary
    } else {
        alert("Map not found! Please check the hunt code.");
    }
}

// Function to place pins after image is loaded
function placePins(pins, img) {
    const imgRect = img.getBoundingClientRect(); // Get image's bounding box in the container

    pins.forEach(({ x, y }) => {
        // Create pin element
        const pin = document.createElement('div');
        pin.classList.add('pin');

        // Calculate pin position relative to the image's size and position
        const pinX = (x / 100) * imgRect.width + 100; // Adjusted to the right
        const pinY = (y / 100) * imgRect.height + 100; // Adjusted down

        // Set the position of the pin based on the image's bounding box
        pin.style.left = `${pinX}px`; 
        pin.style.top = `${pinY}px`; 

        mapContainer.appendChild(pin);
    });
}
