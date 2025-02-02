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

// Convert image file to Base64 string
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file); // Converts image to Base64
    });
}

// Handle image upload and display
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    console.log('File selected:', file);

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
            console.log('Image displayed successfully.');
        };
        reader.readAsDataURL(file);
    }
});

// Enable pin-adding mode
addPinButton.addEventListener('click', function() {
    pinMode = true;
    addPinButton.textContent = "Click on Image to Place Pin";
    console.log('Pin-adding mode enabled.');
});

// Place a pin on the image
imageContainer.addEventListener('click', function(event) {
    if (!pinMode) return;

    const rect = imageContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pin = document.createElement('div');
    pin.classList.add('pin');
    pin.style.left = `${(x / rect.width) * 100}%`;
    pin.style.top = `${(y / rect.height) * 100}%`;

    pin.addEventListener('dblclick', function() {
        pins = pins.filter(p => p.x !== x || p.y !== y);
        pin.remove();
    });

    imageContainer.appendChild(pin);
    pins.push({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    pinMode = false;
    addPinButton.textContent = "Add Pin";
    console.log('Pin placed at:', { x, y });
});

// Save map to Firestore
saveButton.addEventListener('click', async function() {
    if (!uploadedImageFile || pins.length === 0) {
        alert('Please upload an image and add pins before saving.');
        return;
    }

    console.log('Preparing to convert image to Base64...');
    const base64Image = await convertToBase64(uploadedImageFile);
    if (!base64Image) {
        alert('Image conversion failed.');
        return;
    }

    // Log image URL and pin data for debugging
    console.log('Saving to Firestore with Base64 image data:', base64Image);
    console.log('Pins:', pins);

    const mapCode = Math.random().toString(36).substr(2, 6); // Generate unique code
    console.log('Generated map code:', mapCode);

    try {
        // Save map to Firestore
        console.log('Saving map data to Firestore...');
        await setDoc(doc(db, 'treasure_maps', mapCode), {
            imageBase64: base64Image,
            pins
        });
        alert('Map saved successfully! Share this code: ' + mapCode);
        console.log('Map saved successfully to Firestore.');
    } catch (error) {
        console.error('Error saving map to Firestore:', error);
        alert('There was an error saving the map.');
    }
});
