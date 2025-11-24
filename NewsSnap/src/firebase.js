import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdtvv54RkzgKYKeRgF-dT1Q54yL2GEwB8",
  authDomain: "news-snap-1874d.firebaseapp.com",
  projectId: "news-snap-1874d",
  storageBucket: "news-snap-1874d.firebasestorage.app",
  messagingSenderId: "431384654165",
  appId: "1:431384654165:web:f1b2b3b7b47a28cfe6bfdc",
  measurementId: "G-22E4PHHC2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Set persistence to keep users logged in
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Firestore collections
export const usersCollection = "users";
export const summariesCollection = "summaries";