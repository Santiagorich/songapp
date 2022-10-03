import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "acvhelper-93c1a.firebaseapp.com",
  databaseURL: "https://acvhelper-93c1a-default-rtdb.firebaseio.com",
  projectId: "acvhelper-93c1a",
  storageBucket: "acvhelper-93c1a.appspot.com",
  messagingSenderId: "651177855214",
  appId: "1:651177855214:web:d5b6c1d9b01fa77c900bff",
  measurementId: "G-7M0BE5XFG2"
};
console.log(process.env.REACT_APP_FIREBASE_API_KEY);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export default app;