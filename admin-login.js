/* ======================================================
   TCL TruckersMP Cash League
   Admin Login
====================================================== */

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

/* ======================================================
   Elements
====================================================== */

const form = document.getElementById("adminLoginForm");
const message = document.getElementById("message");
const loginButton = form?.querySelector("button[type='submit']");

/* ======================================================
   Check Elements
====================================================== */

if (!form || !message) {

    console.error("Admin login form elements not found.");

    throw new Error("Missing login form elements.");

}

/* ======================================================
   Already Logged In?
====================================================== */

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "admin-dashboard.html";

    }

});

/* ======================================================
   Login
====================================================== */

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {

        message.className = "error";
        message.textContent = "Please enter your email and password.";

        return;

    }

    if (loginButton) {

        loginButton.disabled = true;

    }

    message.className = "";
    message.textContent = "Signing in...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.className = "success";
        message.textContent = "✅ Login successful";

        setTimeout(() => {

            window.location.href = "admin-dashboard.html";

        }, 800);

    }

    catch (error) {

        console.error(error);

        message.className = "error";

        switch (error.code) {

            case "auth/user-not-found":
                message.textContent = "No admin account found.";
                break;

            case "auth/wrong-password":
                message.textContent = "Incorrect password.";
                break;

            case "auth/invalid-credential":
                message.textContent = "Invalid email or password.";
                break;

            case "auth/invalid-email":
                message.textContent = "Invalid email address.";
                break;

            case "auth/too-many-requests":
                message.textContent = "Too many failed attempts. Please try again later.";
                break;

            default:
                message.textContent = "Login failed. Please try again.";

        }

    }

    finally {

        if (loginButton) {

            loginButton.disabled = false;

        }

    }

});