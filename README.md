# Treasure Hunt

Welcome to the Treasure Hunt project! This project allows users to conduct and join treasure hunts by uploading images, placing pins, and sharing hunt codes.

## Features

- Upload images and place pins to create a treasure map.
- Save and share treasure maps using unique hunt codes.
- Join treasure hunts by entering a hunt code.
- Responsive design for a seamless experience on different devices.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Storage:** Google Drive API
- **Authentication:** Google Service Account

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine.
- Firebase project set up with Firestore and Storage enabled.
- Google Cloud project with a service account and Google Drive API enabled.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/treasure_hunt.git
    cd treasure_hunt
    ```

2. Install backend dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    GOOGLE_APPLICATION_CREDENTIALS=credentials.json
    ```

4. Place your `credentials.json` file (Google service account key) in the root directory.

5. Update the Firebase configuration in `index.html`, `join.html`, and `conduct.html` with your Firebase project details.

### Running the Application

1. Start the backend server:
    ```bash
    node server.js
    ```

2. Open `index.html` in your browser to access the application.

## Usage

### Conduct a Hunt

1. Navigate to the "Conduct Hunt" page.
2. Upload an image and place pins on the image.
3. Save the map to generate a unique hunt code.
4. Share the hunt code with participants.

### Join a Hunt

1. Navigate to the "Join Hunt" page.
2. Enter the hunt code provided by the organizer.
3. View the treasure map and pins.

## Troubleshooting

- Ensure the backend server is running when uploading images.
- Verify that the Google service account key and Firebase configuration are correct.
- Check the browser console for any error messages.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Firebase](https://firebase.google.com/)
- [Google Cloud](https://cloud.google.com/)
- [Express](https://expressjs.com/)

Feel free to contribute to this project by submitting issues or pull requests. Happy treasure hunting!
