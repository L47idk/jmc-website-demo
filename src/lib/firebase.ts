import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAW-fL3upSZMnGVBFCl_l62HUgxVaj2E7c",
  authDomain: "josephite-math-club.firebaseapp.com",
  projectId: "josephite-math-club",
  storageBucket: "josephite-math-club.firebasestorage.app",
  messagingSenderId: "104604999238",
  appId: "1:104604999238:web:03c89af5182c25b706b447",
};

// Initialize Firebase only if we have a valid-looking API key or in a way that doesn't crash
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
