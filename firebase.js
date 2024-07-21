// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2XhwrolEHImx2K9sV6T9-ZkL7las7oYM",
  authDomain: "mon-avocat-reservation.firebaseapp.com",
  projectId: "mon-avocat-reservation",
  storageBucket: "mon-avocat-reservation.appspot.com",
  messagingSenderId: "649228790899",
  appId: "1:649228790899:web:593c0971e8413e595a0e06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };
