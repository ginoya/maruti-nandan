// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd_IgCpTPSG2mtUht2x-exb7mvpcVZ5hA",
  authDomain: "record-register-c4962.firebaseapp.com",
  projectId: "record-register-c4962",
  storageBucket: "record-register-c4962.firebasestorage.app",
  messagingSenderId: "436701962277",
  appId: "1:436701962277:web:b1428cd8f4d0c92277dfcc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
