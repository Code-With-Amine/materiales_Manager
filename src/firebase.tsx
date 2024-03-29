// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCkzTiD6mSAHWOb_4DVqkyodNMPeOzR3xs",
  authDomain: "gestionecoles-11dc0.firebaseapp.com",
  projectId: "gestionecoles-11dc0",
  storageBucket: "gestionecoles-11dc0.appspot.com",
  messagingSenderId: "488374565279",
  appId: "1:488374565279:web:a1dceb9a3a823923b6e5aa",
  measurementId: "G-C68NVRZ5C9",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
