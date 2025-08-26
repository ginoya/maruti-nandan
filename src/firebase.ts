// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhfh0L1wkWQk_Rjr3uwZyi15NPZ0Nx66A",
  authDomain: "santkrupa-gold.firebaseapp.com",
  projectId: "santkrupa-gold",
  storageBucket: "santkrupa-gold.firebasestorage.app",
  messagingSenderId: "569024133631",
  appId: "1:569024133631:web:3311d6483a22dad91bcfca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
