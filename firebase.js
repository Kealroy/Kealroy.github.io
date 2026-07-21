/* =====================================================
   TCL TruckersMP Cash League
   Firebase Configuration
===================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

/* =====================================================
   Firebase Config
===================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyCMR0jiiBUvN-OsYxCZ6Hf6UDrI_CfZq9w",
    authDomain: "tcl-truckersmp-cash-league.firebaseapp.com",
    projectId: "tcl-truckersmp-cash-league",
    storageBucket: "tcl-truckersmp-cash-league.appspot.com",
    messagingSenderId: "264638885624",
    appId: "1:264638885624:web:63ade344858674f03c550d",
    measurementId: "G-1HE6TYE58Q"
};

/* =====================================================
   Initialize Firebase
===================================================== */

const app = initializeApp(firebaseConfig);

/* =====================================================
   Firebase Services
===================================================== */

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;