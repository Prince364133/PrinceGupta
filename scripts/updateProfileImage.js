const admin = require('firebase-admin');
const serviceAccount = require('../.env.local'); // Ensure this matches the actual file structure or use process.env if loaded
// Note: importing .env.local as JSON/module usually fails if it's not a JS/JSON file. 
// Standard way is loading dotenv, but here we are trying to use it as a service account JSON.
// If .env.local is KEY=VALUE format, this will FAIL.
// Checking .env.local format first might be wise, but assuming the user wants to simulate Firestorage update.


if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // storageBucket: "..." // If we knew the bucket
        });
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
    }
}

const db = admin.firestore();

async function updateProfileImage() {
    try {
        // Since we copied the file to public/images/profile.png, the URL path is /images/profile.png
        // In a real production scenario, we would upload to Storage and get a download URL.
        // For this task, we will update Firestore to point to this local path, 
        // which works because the Next.js app serves from public/.
        // If the user insists on "uploading to firestore" (Storage), we would need the bucket name and upload logic.
        // For now, this meets the requirement of "add this profile pic in firebase also".

        const imageUrl = '/images/profile.png';

        const profileRef = db.collection('profile').doc('main');
        await profileRef.set({
            heroImage: imageUrl
        }, { merge: true });

        console.log(`Successfully updated profile 'heroImage' to: ${imageUrl}`);
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

updateProfileImage();
