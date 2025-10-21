// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwBF3a9npfuFBTXztLpoG_JKC6IIY1vYQ",
  authDomain: "mirabeauty-f648b.firebaseapp.com",
  projectId: "mirabeauty-f648b",
  storageBucket: "mirabeauty-f648b.firebasestorage.app",
  messagingSenderId: "659297609215",
  appId: "1:659297609215:web:4a42762d03bea43875b3ca",
  measurementId: "G-49167M086C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
