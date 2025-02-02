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

        // Display the image from Imgur URL
        const img = document.createElement('img');
        img.src = `https://cors-anywhere.herokuapp.com/${data.imageUrl}`; // Use CORS proxy for testing
        img.id = 'uploadedImage';
        img.crossOrigin = 'anonymous'; // Ensure CORS handling
        mapContainer.innerHTML = '';  // Clear existing map
        mapContainer.appendChild(img);

        // Place pins
        data.pins.forEach(({ x, y }) => {
            const pin = document.createElement('div');
            pin.classList.add('pin');
            pin.style.left = `${x}px`;
            pin.style.top = `${y}px`;
            mapContainer.appendChild(pin);
        });
    } else {
        alert("Map not found! Please check the hunt code.");
    }
}
