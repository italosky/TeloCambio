// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjAMc7sriSyo4JWNjtiL4BVxq5-CFwC7c",
  authDomain: "telocambio-5abab.firebaseapp.com",
  projectId: "telocambio-5abab",
  storageBucket: "telocambio-5abab.appspot.com",
  messagingSenderId: "231713560463",
  appId: "1:231713560463:web:b3a57843294d8a4baaddfa",
  measurementId: "G-2R0FP4LD9D",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
export { auth, appFirebase, db };