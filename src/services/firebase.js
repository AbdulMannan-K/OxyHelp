// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANc-lmRll85NiQkJgpcpww9dActLDIn8A",
    authDomain: "oxy-capsules.firebaseapp.com",
    projectId: "oxy-capsules",
    storageBucket: "oxy-capsules.appspot.com",
    messagingSenderId: "581682460415",
    appId: "1:581682460415:web:5d0db82336c975e644beca",
    measurementId: "G-2HH0RLZ0XM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
