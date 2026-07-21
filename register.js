/* ==========================================================
   TCL TRUCKERSMP CASH LEAGUE
   REGISTER.JS
   VERSION 4.0
========================================================== */

"use strict";

/* ==========================================================
   IMPORTS
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* ==========================================================
   LEAGUE CONFIGURATION
========================================================== */

let CURRENT_SEASON = null;

const REGISTRATION_FEE = "R25";

const DEFAULT_COUNTRY = "South Africa";

const DEFAULT_AVATAR = "../images/default-profile.png";

const DEFAULT_LEVEL = 1;

const DEFAULT_EXPERIENCE = 0;

const DEFAULT_POINTS = 0;

const DEFAULT_DELIVERIES = 0;

const DEFAULT_DISTANCE = 0;

const DEFAULT_ACHIEVEMENT = "Rookie Driver";

const REFERRAL_PREFIX = "TCL";

const DEFAULT_REFERRAL_COUNT = 0;

const DEFAULT_REFERRAL_REWARD = 0;

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const form = document.getElementById("registerForm");

const message = document.getElementById("registerMessage");

const submitButton =
    form?.querySelector("button[type='submit']");

const username =
    document.getElementById("username");

const truckersmpid =
    document.getElementById("truckersmpid");

const steam =
    document.getElementById("steam");

const company =
    document.getElementById("company");

const discord =
    document.getElementById("discord");

const phone =
    document.getElementById("phone");

const province =
    document.getElementById("province");

    const referral =
    document.getElementById("referral");

/* ==========================================================
   PAGE CHECK
========================================================== */

if (!form) {

    console.error("Register form not found.");

    throw new Error("Registration page not detected.");

}

/* ==========================================================
   STARTUP
========================================================== */

console.log("==========================================");
console.log(" TCL TruckersMP Cash League");
console.log(" Registration System Version 4.0");
console.log(" Current Season:", CURRENT_SEASON);
console.log(" Firebase Connected");
console.log(" Registration Ready");
console.log("==========================================");
/* ==========================================================
   HELPER FUNCTIONS
========================================================== */

function generateReferralCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = REFERRAL_PREFIX + "-";

    for (let i = 0; i < 6; i++) {

        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );

    }

    return code;

}

function clean(value) {

    return value.trim();

}

function showMessage(text, colour = "#22c55e") {

    message.textContent = text;

    message.style.color = colour;

    message.style.display = "block";

}

function clearMessage() {

    message.textContent = "";

    message.style.display = "none";

}

function setLoading(loading) {

    if (!submitButton) return;

    submitButton.disabled = loading;

    submitButton.textContent =

        loading

            ? "Registering..."

            : "Register Driver";

}

function resetForm() {

    form.reset();

}

function focusField(field) {

    field.focus();

    field.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}

function phoneNumber() {

    return phone.value.replace(/\s+/g, "");

}
/* ==========================================================
   GET ACTIVE SEASON
========================================================== */

async function getActiveSeason(){

    try{


        const q = query(

            collection(db,"seasons"),

            where(
                "active",
                "==",
                true
            )

        );


        const snapshot = await getDocs(q);



        if(snapshot.empty){


            throw new Error(
                "No active season found."
            );


        }



        const season =
            snapshot.docs[0].data();



        CURRENT_SEASON =
            season.name;



        return CURRENT_SEASON;



    }


    catch(error){


        console.error(
            "Season Load Error:",
            error
        );


        showMessage(

            "Registration is currently unavailable. No active season.",

            "#ef4444"

        );


        return null;


    }


}
/* ==========================================================
   REGISTER DRIVER
========================================================== */

async function registerDriver(event){

event.preventDefault();

clearMessage();



const activeSeason =
    await getActiveSeason();



if(!activeSeason){

    return;

}


    if(!validateForm()){

        return;

    }


    try{


        setLoading(true);



        if(await usernameExists()){

            showMessage(
                "Username already registered for this season.",
                "#ef4444"
            );

            return;

        }



        if(await truckersmpIdExists()){

            showMessage(
                "TruckersMP ID already registered for this season.",
                "#ef4444"
            );

            return;

        }



        if(await discordExists()){

            showMessage(
                "Discord account already registered.",
                "#ef4444"
            );

            return;

        }



        if(await phoneExists()){

            showMessage(
                "WhatsApp number already registered.",
                "#ef4444"
            );

            return;

        }




        await addDoc(

            collection(db,"players"),

            {


                username:
                    clean(username.value),


                truckersmpid:
                    clean(truckersmpid.value),


                steam:
                    clean(steam.value),


                company:
                    clean(company.value),


                discord:
                    clean(discord.value),


                phone:
                    phoneNumber(),


                province:
                    clean(province.value),

                    referralCode:
    generateReferralCode(),

referredBy:
    referral.value.trim() === ""
        ? null
        : referral.value.trim().toUpperCase(),

referralCount:
    DEFAULT_REFERRAL_COUNT,

referralReward:
    DEFAULT_REFERRAL_REWARD,



                country:
                    DEFAULT_COUNTRY,


                season:
                    CURRENT_SEASON,


                registrationFee:
                    REGISTRATION_FEE,


                points:
                    DEFAULT_POINTS,


                deliveries:
                    DEFAULT_DELIVERIES,


                distance:
                    DEFAULT_DISTANCE,


                level:
                    DEFAULT_LEVEL,


                experience:
                    DEFAULT_EXPERIENCE,


                achievement:
                    DEFAULT_ACHIEVEMENT,


                approved:false,


                paymentVerified:false,


                createdAt:
                    serverTimestamp()


            }


        );



        showMessage(

    "Registration successful! Your referral code has been created. Send proof of payment to TCL Admin for approval."

);



        resetForm();



    }


    catch(error){


        console.error(
            "Registration Error:",
            error
        );


        showMessage(

            "Registration failed. Please try again.",

            "#ef4444"

        );


    }


    finally{


        setLoading(false);


    }


}

/* ==========================================================
   VALIDATION
========================================================== */

function validateForm() {

    if (clean(username.value).length < 3) {

        showMessage(
            "TruckersMP Username must contain at least 3 characters.",
            "#ef4444"
        );

        focusField(username);

        return false;

    }

    if (!/^\d+$/.test(clean(truckersmpid.value))) {

        showMessage(
            "Enter a valid TruckersMP ID.",
            "#ef4444"
        );

        focusField(truckersmpid);

        return false;

    }

    if (
        !clean(steam.value)
            .startsWith("https://steamcommunity.com/")
    ) {

        showMessage(
            "Please enter a valid Steam Community profile link.",
            "#ef4444"
        );

        focusField(steam);

        return false;

    }

    if (clean(discord.value).length < 3) {

        showMessage(
            "Please enter your Discord username.",
            "#ef4444"
        );

        focusField(discord);

        return false;

    }

    if (!/^\d{10,15}$/.test(phoneNumber())) {

        showMessage(
            "Please enter a valid WhatsApp number.",
            "#ef4444"
        );

        focusField(phone);

        return false;

    }

    if (province.value === "") {

        showMessage(
            "Please select your province.",
            "#ef4444"
        );

        focusField(province);

        return false;

    }

if (
    referral.value.trim() !== "" &&
    !/^TCL-[A-Z0-9]{6}$/i.test(referral.value.trim())
) {

    showMessage(
        "Referral code is not valid.",
        "#ef4444"
    );

    focusField(referral);

    return false;

}

    clearMessage();

    return true;

}
/* ==========================================================
   DUPLICATE CHECKS
========================================================== */

async function exists(field, value) {

    const q = query(

        collection(db, "players"),

        where(field, "==", value),

        where("season", "==", CURRENT_SEASON)

    );

    const snapshot = await getDocs(q);

    return !snapshot.empty;

}

async function usernameExists() {

    return await exists(

        "username",

        clean(username.value)

    );

}

async function truckersmpIdExists() {

    return await exists(

        "truckersmpid",

        clean(truckersmpid.value)

    );

}

async function discordExists() {

    return await exists(

        "discord",

        clean(discord.value)

    );

}

async function phoneExists() {

    return await exists(

        "phone",

        phoneNumber()

    );

}
/* ==========================================================
   EVENT LISTENERS
========================================================== */

form.addEventListener("submit", registerDriver);

/* ==========================================================
   CLEAR MESSAGES WHEN USER TYPES
========================================================== */

const fields = form.querySelectorAll("input, select");

fields.forEach(field => {

    field.addEventListener("input", () => {

        if (message.textContent !== "") {

            clearMessage();

        }

    });

    field.addEventListener("change", () => {

        if (message.textContent !== "") {

            clearMessage();

        }

    });

});

/* ==========================================================
   AUTO FORMAT INPUTS
========================================================== */

/* Username */

username.addEventListener("blur", () => {

    username.value = clean(username.value);

});

/* TruckersMP ID */

truckersmpid.addEventListener("input", () => {

    truckersmpid.value =
        truckersmpid.value.replace(/\D/g, "");

});

/* Steam URL */

steam.addEventListener("blur", () => {

    steam.value = clean(steam.value);

});

/* Company */

company.addEventListener("blur", () => {

    company.value = clean(company.value);

});

/* Discord */

discord.addEventListener("blur", () => {

    discord.value = clean(discord.value);

});

/* WhatsApp */

phone.addEventListener("input", () => {

    phone.value = phone.value.replace(/[^\d]/g, "");

});

/* ==========================================================
   PAGE READY
========================================================== */

console.log("==========================================");

console.log("TCL Registration System Ready");

console.log("Current Season :", CURRENT_SEASON);

console.log("Registration Fee :", REGISTRATION_FEE);

console.log("Waiting for Driver Registration...");

console.log("==========================================");