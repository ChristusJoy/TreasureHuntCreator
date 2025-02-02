// Firebase initialization
console.log('Script loaded!');

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Firebase configuration
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

const imageUpload = document.getElementById('imageUpload');
const imageContainer = document.getElementById('imageContainer');
const addPinButton = document.getElementById('addPinButton');
const saveButton = document.createElement('button');
saveButton.textContent = "Save Map";
saveButton.disabled = true;
document.body.appendChild(saveButton);

let uploadedImageFile = null;
let pinMode = false;
let pins = []; // Store pin positions

// Upload Image to Google Drive via Backend API
async function uploadToGoogleDrive(file) {
    const formData = new FormData();
    formData.append("image", file);

    console.log("Uploading image to backend...");
    try {
        const response = await fetch("http://127.0.0.1:3000/upload", { // Ensure backend is running
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        console.log("Backend response:", data);
        if (data.success) {
            console.log("Google Drive URL:", data.url);
            return data.url;
        } else {
            console.error("Upload failed:", data.error);
            return null;
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        alert("Network error: Unable to upload image. Please ensure the backend server is running.");
        return null;
    }
}

// Handle image upload and display
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    console.log("File selected:", file);  // Log selected file
    
    if (file) {
        uploadedImageFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            imageContainer.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.id = 'uploadedImage';
            imageContainer.appendChild(img);
            addPinButton.disabled = false;
            saveButton.disabled = false;
            pins = []; // Reset pins
            console.log("Image displayed successfully.");
        };
        reader.readAsDataURL(file);
    }
});

// Enable pin-adding mode
addPinButton.addEventListener('click', function() {
    pinMode = true;
    addPinButton.textContent = "Click on Image to Place Pin";
    console.log("Pin-adding mode enabled.");
});

// Place a pin on the image
imageContainer.addEventListener('click', function(event) {
    if (!pinMode) return;
    
    const rect = imageContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pin = document.createElement('div');
    pin.classList.add('pin');
    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;

    pin.addEventListener('dblclick', function() {
        pins = pins.filter(p => p.x !== x || p.y !== y);
        pin.remove();
    });

    imageContainer.appendChild(pin);
    pins.push({ x, y });
    pinMode = false;
    addPinButton.textContent = "Add Pin";
    console.log("Pin placed at:", { x, y });
});

// Save map to Firestore
saveButton.addEventListener('click', async function() {
    if (!uploadedImageFile || pins.length === 0) {
        alert("Please upload an image and add pins before saving.");
        return;
    }

    console.log("Preparing to upload image...");
    const imageUrl = await uploadToGoogleDrive(uploadedImageFile);
    if (!imageUrl) {
        alert("Image upload failed.");
        return;
    }

    // Log image URL and pin data for debugging
    console.log("Saving to Firestore with Image URL:", imageUrl);
    console.log("Pins:", pins);

    const mapCode = Math.random().toString(36).substr(2, 6); // Generate unique code
    console.log("Generated map code:", mapCode);

    try {
        // Save map to Firestore
        console.log("Saving map data to Firestore...");
        await setDoc(doc(db, "treasure_maps", mapCode), {
            imageUrl,
            pins
        });
        alert("Map saved successfully! Share this code: " + mapCode);
        console.log("Map saved successfully to Firestore.");
        // Display the map code
        const mapCodeDisplay = document.createElement('p');
        mapCodeDisplay.textContent = `Map Code: ${mapCode}`;
        document.body.appendChild(mapCodeDisplay);
    } catch (error) {
        console.error("Error saving map to Firestore:", error);
        alert("There was an error saving the map.");
    }
});
