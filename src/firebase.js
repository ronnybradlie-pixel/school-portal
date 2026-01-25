import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyCfFCoAh7mt4n7G6W5DiofZMe0QNHi-x4c",
  authDomain: "school-portal-b7c93.firebaseapp.com",
  projectId: "school-portal-b7c93",
  storageBucket: "school-portal-b7c93.firebasestorage.app",
  messagingSenderId: "429221803394",
  appId: "1:429221803394:web:cc0983d98992e532910b9b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
