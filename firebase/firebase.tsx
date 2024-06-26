import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
    apiKey: "AIzaSyBlTYhTmtRqwRiN0ToEwMEJN_Eyyg_qXUs",
    authDomain: "ksi-c7214.firebaseapp.com",
    projectId: "ksi-c7214",
    storageBucket: "ksi-c7214.appspot.com",
    messagingSenderId: "229004053093",
    appId: "1:229004053093:web:b954580170f8f48bc1d48c",
    measurementId: "G-EM4FRC2LDT"
  };

  const app = initializeApp(firebaseConfig);


  const auth = getAuth(app);
  
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Auth persistence set to local");
    })
    .catch((error) => {
      console.error("Error setting Auth persistence:", error);
    });

export const db = getFirestore(app);
 
  export {  auth };