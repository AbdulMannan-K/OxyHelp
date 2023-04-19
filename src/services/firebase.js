// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB0NJwaynENhuOSc5x2qJx12NF2-ADO8PI",
    authDomain: "oxyhelp-845d6.firebaseapp.com",
    projectId: "oxyhelp-845d6",
    storageBucket: "oxyhelp-845d6.appspot.com",
    messagingSenderId: "797445366814",
    appId: "1:797445366814:web:dbef69a08c369685923a0f",
    measurementId: "G-6S31EEFEZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
