import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Add Firebase Storage

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDueKlwbF-3VGcY7GlamSUTRw6OJQIGUh8",
  authDomain: "rm-s-travel-hub.firebaseapp.com",
  projectId: "rm-s-travel-hub",
  storageBucket: "rm-s-travel-hub.appspot.com",
  messagingSenderId: "30692652416",
  appId: "1:30692652416:web:faf5f2fc0aa0d42f80fd65",
  measurementId: "G-708V8RGKJ4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage, createUserWithEmailAndPassword, sendEmailVerification, setDoc, doc };
