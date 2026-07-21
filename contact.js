/* ==========================================================
   TCL TRUCKERSMP CASH LEAGUE
   CONTACT.JS
========================================================== */

"use strict";

/* ==========================================================
   IMPORTS
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const form = document.getElementById("contactForm");
const status = document.getElementById("contactStatus");

if (!form || !status) {

    console.log("Contact page not detected.");

} else {

    const button = form.querySelector("button");

    /* ======================================================
       SHOW STATUS MESSAGE
    ====================================================== */

    function showMessage(text, colour) {

        status.textContent = text;
        status.style.color = colour;

    }

    /* ======================================================
       SUBMIT CONTACT FORM
    ====================================================== */

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        button.disabled = true;
        button.textContent = "Sending...";

        showMessage("", "");

        try {

            await addDoc(collection(db, "messages"), {

                name: document.getElementById("name").value.trim(),

                email: document.getElementById("email").value.trim(),

                subject: document.getElementById("subject").value.trim(),

                message: document.getElementById("message").value.trim(),

                status: "New",

                createdAt: serverTimestamp()

            });

            form.reset();

            showMessage(
                "✅ Your message has been sent successfully.",
                "#22c55e"
            );

        }

        catch (error) {

            console.error("Contact Error:", error);

            showMessage(
                "❌ Failed to send message. Please try again.",
                "#ef4444"
            );

        }

        finally {

            button.disabled = false;
            button.textContent = "Send Message";

        }

    });

    console.log("✅ Contact page loaded");

}