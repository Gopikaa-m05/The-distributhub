// FIX: Changed firebase import path to use scoped package for compatibility.
import { initializeApp } from "@firebase/app";
// FIX: Changed firebase import path to use scoped package for compatibility.
import { getAuth } from "@firebase/auth";

// TODO: Replace with your actual Firebase project configuration.
// It's highly recommended to use environment variables for this information.
const firebaseConfig = {
  apiKey: "AIzaSyCMzXO9ZcSTbVH-XFc8wv0ch7Rfsfr2FIw",
  authDomain: "the-distributer-hub.firebaseapp.com",
  projectId: "the-distributer-hub",
  storageBucket: "the-distributer-hub.firebasestorage.app",
  messagingSenderId: "1058883442593",
  appId: "1:1058883442593:web:771dbac873300164f0dde0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
