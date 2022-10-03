import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyBDHcDxbe1oFJQzIVfOcYN4Mjs7OlwNaFk",
  authDomain: "acvhelper-93c1a.firebaseapp.com",
  databaseURL: "https://acvhelper-93c1a-default-rtdb.firebaseio.com",
  projectId: "acvhelper-93c1a",
  storageBucket: "acvhelper-93c1a.appspot.com",
  messagingSenderId: "651177855214",
  appId: "1:651177855214:web:fae2ebecb683cac3900bff",
  measurementId: "G-VWZCWWF1YC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export default app;