/* ==========================================================
   TCL TRUCKERSMP CASH LEAGUE
   APP.JS
   FIREBASE EDITION
   PART 1 - FOUNDATION
========================================================== */

"use strict";

/* ==========================================================
   FIREBASE IMPORTS
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/* ==========================================================
   GLOBAL DATA
========================================================== */

let players = [];

/* ==========================================================
   PAGE DETECTION
========================================================== */

const currentPage =
    window.location.pathname.split("/").pop();

/* ==========================================================
   COMMON ELEMENTS
========================================================== */

const playersCount =
    document.getElementById("playersCount");

const playersHero =
    document.getElementById("playersCountHero");

const deliveriesCount =
    document.getElementById("deliveriesCount");

const distanceCount =
    document.getElementById("distanceCount");

const leaderName =
    document.getElementById("leaderName");

const top1 =
    document.getElementById("top1");

const top2 =
    document.getElementById("top2");

const top3 =
    document.getElementById("top3");

    /* ==========================================================
   LATEST WINNERS
========================================================== */

const winner1 =
    document.getElementById("winner1");

const winner2 =
    document.getElementById("winner2");

const winner3 =
    document.getElementById("winner3");

const winner1Prize =
    document.getElementById("winner1Prize");

const winner2Prize =
    document.getElementById("winner2Prize");

const winner3Prize =
    document.getElementById("winner3Prize");

/* ==========================================================
   LOAD PLAYERS FROM FIRESTORE
========================================================== */

async function loadPlayers() {

    try {

        const snapshot =
            await getDocs(collection(db, "players"));

        players = [];

        snapshot.forEach((doc) => {

            players.push({

                id: doc.id,

                fullname: "",
                username: "",
                name: "",
                truckersmpid: "",
                company: "",
                province: "",
                country: "",
                avatar: "",
                points: 0,
                deliveries: 0,
                distance: 0,
                approved: false,

                ...doc.data()

            });

        });

        console.log(
            "Players Loaded:",
            players.length
        );

    }

    catch (error) {

        console.error(
            "Error loading players:",
            error
        );

    }

}

/* ==========================================================
   APPROVED PLAYERS ONLY
========================================================== */

function approvedPlayers() {

    return players.filter(player => player.approved);

}
/* ==========================================================
   HOMEPAGE STATISTICS
========================================================== */

function updateHomepage() {

    const approved = approvedPlayers();

    const totalPlayers = approved.length;

    const totalDeliveries = approved.reduce(
        (sum, player) => sum + Number(player.deliveries || 0),
        0
    );

    const totalDistance = approved.reduce(
        (sum, player) => sum + Number(player.distance || 0),
        0
    );

    approved.sort((a, b) => {

        if (Number(b.points || 0) !== Number(a.points || 0)) {
            return Number(b.points || 0) - Number(a.points || 0);
        }

        return Number(b.deliveries || 0) - Number(a.deliveries || 0);

    });

    if (playersCount)
        playersCount.textContent = totalPlayers;

    if (playersHero)
        playersHero.textContent = totalPlayers;

    if (deliveriesCount)
        deliveriesCount.textContent =
            totalDeliveries.toLocaleString();

    if (distanceCount)
        distanceCount.textContent =
            totalDistance.toLocaleString() + " KM";

    if (leaderName) {

        leaderName.textContent =
            approved.length
                ? approved[0].username ||
                  approved[0].fullname ||
                  approved[0].name
                : "No Drivers";

    }

}

/* ==========================================================
   TOP THREE DRIVERS
========================================================== */

function updateTopDrivers() {

    const approved = approvedPlayers();

    approved.sort((a, b) => {

        if (Number(b.points || 0) !== Number(a.points || 0)) {

            return Number(b.points || 0) -
                   Number(a.points || 0);

        }

        return Number(b.deliveries || 0) -
               Number(a.deliveries || 0);

    });

    if (top1)
        top1.textContent =
            approved[0]
            ? approved[0].username || approved[0].fullname
            : "No Driver";

    if (top2)
        top2.textContent =
            approved[1]
            ? approved[1].username || approved[1].fullname
            : "No Driver";

    if (top3)
        top3.textContent =
            approved[2]
            ? approved[2].username || approved[2].fullname
            : "No Driver";

}

/* ==========================================================
   LATEST WINNERS
========================================================== */

function updateLatestWinners() {

    const approved = approvedPlayers();

    approved.sort((a, b) => {

        if (Number(b.points || 0) !== Number(a.points || 0)) {

            return Number(b.points || 0) -
                   Number(a.points || 0);

        }

        return Number(b.deliveries || 0) -
               Number(a.deliveries || 0);

    });

    if (winner1) {

        winner1.textContent =
            approved[0]
            ? approved[0].username || approved[0].fullname || approved[0].name
            : "Coming Soon";

    }

    if (winner2) {

        winner2.textContent =
            approved[1]
            ? approved[1].username || approved[1].fullname || approved[1].name
            : "Coming Soon";

    }

    if (winner3) {

        winner3.textContent =
            approved[2]
            ? approved[2].username || approved[2].fullname || approved[2].name
            : "Coming Soon";

    }

    if (winner1Prize)
        winner1Prize.textContent = "R500";

    if (winner2Prize)
        winner2Prize.textContent = "R250";

    if (winner3Prize)
        winner3Prize.textContent = "R150";

}

/* ==========================================================
   COUNTDOWN TIMER
========================================================== */

const countdownElement = document.getElementById("countdown");

function updateCountdown() {

    const seasonStart = new Date("August 10, 2026 00:00:00").getTime();
    const now = new Date().getTime();

    const distance = seasonStart - now;

    if (distance <= 0) {
        countdownElement.innerHTML = "🚛 Season 1 is LIVE!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================================================
   REFRESH HOME PAGE
========================================================== */

function refreshHomepage() {

    updateHomepage();

    updateTopDrivers();

    updateLatestWinners();

}
/* ==========================================================
   LEADERBOARD
========================================================== */

function renderLeaderboard() {

    const tbody = document.getElementById("leaderboardBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    const approved = approvedPlayers()

        .sort((a, b) => {

            if (Number(b.points || 0) !== Number(a.points || 0)) {

                return Number(b.points || 0) -
                       Number(a.points || 0);

            }

            return Number(b.deliveries || 0) -
                   Number(a.deliveries || 0);

        });

    if (approved.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="6" style="text-align:center;padding:25px;">

                No approved drivers found.

            </td>

        </tr>

        `;

        return;

    }

    approved.forEach((player, index) => {

        const row = document.createElement("tr");

        let rank;

        switch (index) {

            case 0:
                rank = "🥇";
                break;

            case 1:
                rank = "🥈";
                break;

            case 2:
                rank = "🥉";
                break;

            default:
                rank = "#" + (index + 1);

        }

        row.innerHTML = `

        <td>${rank}</td>

        <td>

            ${player.username ||
              player.fullname ||
              player.name ||
              "-"}

        </td>

        <td>

            ${player.company || "-"}

        </td>

        <td>

            ${Number(player.points || 0)}

        </td>

        <td>

            ${Number(player.deliveries || 0)}

        </td>

        <td>

            ${Number(player.distance || 0).toLocaleString()} KM

        </td>

        `;

        tbody.appendChild(row);

    });

}
/* ==========================================================
   LEADERBOARD SEARCH
========================================================== */

function initializeSearch() {

    const searchBox =
        document.getElementById("searchDriver");

    if (!searchBox) return;

    searchBox.addEventListener("keyup", () => {

        const value =
            searchBox.value.toLowerCase();

        const rows =
            document.querySelectorAll("#leaderboardBody tr");

        rows.forEach(row => {

            row.style.display =

                row.textContent
                    .toLowerCase()
                    .includes(value)

                    ? ""

                    : "none";

        });

    });

}
/* ==========================================================
   REFRESH LEADERBOARD
========================================================== */

function refreshLeaderboard() {

    renderLeaderboard();

    initializeSearch();

}

/* ==========================================================
   APPLICATION STARTUP
========================================================== */

async function initializeApp() {

    await loadPlayers();

    refreshHomepage();

    refreshLeaderboard();

}

initializeApp();