import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCNwiON_-peDsHEcybdED_emSZbFxvFUdk",
  authDomain: "meterwebsite-71308.firebaseapp.com",
  databaseURL: "https://meterwebsite-71308-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "meterwebsite-71308",
  storageBucket: "meterwebsite-71308.appspot.com",
  messagingSenderId: "98211402956",
  appId: "1:98211402956:web:6ac7eb906e7d9b7a1f9e69"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);