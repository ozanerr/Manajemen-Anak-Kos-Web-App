// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCRwvvLBmfLAYkStuzj5Q6OAmfudnz2uNo",
    authDomain: "manajemen-anak-kos.firebaseapp.com",
    projectId: "manajemen-anak-kos",
    storageBucket: "manajemen-anak-kos.firebasestorage.app",
    messagingSenderId: "188948811750",
    appId: "1:188948811750:web:54a638bc618ea203ca1027",
    measurementId: "G-M6DZM4V3HV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider().setCustomParameters({
    prompt: "select_account",
});
const gitHubProvider = new GithubAuthProvider();

export { app, auth, googleProvider, gitHubProvider };
