// Import required Firebase services
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

let uploadedImage = null;
let uploadedImageFile = null;
let draggedPin = null;
let pinMode = false;
let pins = []; // Store pin positions

// Upload Image to Imgur
async function uploadToImgur(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://api.imgur.com/3/upload", {
        method: "POST",
        headers: {
            Authorization: "Client-ID 257ec2b78ac1751"
        },
        body: formData
    });

    const data = await response.json();
    
    // Log the response to the console for debugging
    console.log(data);

    return data.success ? data.data.link : null;
}


// Handle image upload and display
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        uploadedImageFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            imageContainer.innerHTML = '';
            const img = document.createElement('img');
            img.src = e.target.result;
            img.id = 'uploadedImage';
            imageContainer.appendChild(img);
            uploadedImage = img;
            addPinButton.disabled = false;
            saveButton.disabled = false;
            pins = []; // Reset pins
        };
        reader.readAsDataURL(file);
    }
});

// Enable pin-adding mode
addPinButton.addEventListener('click', function() {
    pinMode = true;
    addPinButton.textContent = "Click on Image to Place Pin";
});

// Place a pin on the image
imageContainer.addEventListener('click', function(event) {
    if (!uploadedImage || !pinMode) return;

    const rect = uploadedImage.getBoundingClientRect();
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
});

// Save map to Firestore
saveButton.addEventListener('click', async function() {
    if (!uploadedImageFile || pins.length === 0) {
        alert("Please upload an image and add pins before saving.");
        return;
    }

    const imageUrl = await uploadToImgur(uploadedImageFile);
    if (!imageUrl) {
        alert("Image upload failed.");
        return;
    }

    const mapCode = Math.random().toString(36).substr(2, 6); // Generate unique code
    await setDoc(doc(db, "treasure_maps", mapCode), {
        imageUrl,
        pins
    });

    alert("Map saved successfully! Share this code: " + mapCode);
});


