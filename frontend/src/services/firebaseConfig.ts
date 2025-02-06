// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARn6_GLhVSV6_GigQZZGSPqrpYjYw2zGw",
  authDomain: "cmpe272-e0b9f.firebaseapp.com",
  projectId: "cmpe272-e0b9f",
  storageBucket: "cmpe272-e0b9f.firebasestorage.app",
  messagingSenderId: "560202303324",
  appId: "1:560202303324:web:198bfb6ccf36857d0d6399",
  measurementId: "G-KQST1WHZVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };