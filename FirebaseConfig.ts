// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYnpjQd1Zb4IGBWMXQJAj_1X-WWhj7Eyo",
  authDomain: "base-stage.firebaseapp.com",
  projectId: "base-stage",
  storageBucket: "base-stage.appspot.com",
  messagingSenderId: "773034247340",
  appId: "1:773034247340:web:bfe753fcd71623a2a78b09",
  measurementId: "G-PZH7NCK4Y8"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
