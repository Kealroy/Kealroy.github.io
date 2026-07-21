/* ==========================================================
   TCL TRUCKERSMP CASH LEAGUE
   SEASONS.JS
   VERSION 2.0
========================================================== */

"use strict";

/* ==========================================================
   IMPORTS
========================================================== */

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* ==========================================================
   ELEMENTS
========================================================== */

const leaderboard =
    document.getElementById("seasonLeaderboard");

const championsGrid =
    document.getElementById("championsGrid");

/* ==========================================================
   LOAD TOP DRIVERS
========================================================== */

async function loadSeasonLeaderboard() {

    if (!leaderboard) return;

    leaderboard.innerHTML = "";

    try {

        const snapshot =
            await getDocs(collection(db, "players"));

        const players = [];

        snapshot.forEach(doc => {

            const data = doc.data();

            if (data.approved) {

                players.push({

                    id: doc.id,

                    ...data

                });

            }

        });

        players.sort((a, b) => {

            if (Number(b.points || 0) !== Number(a.points || 0)) {

                return Number(b.points || 0) -
                       Number(a.points || 0);

            }

            return Number(b.deliveries || 0) -
                   Number(a.deliveries || 0);

        });

        const topFive = players.slice(0, 5);

        if (topFive.length === 0) {

            leaderboard.innerHTML = `

            <tr>

                <td colspan="4"
                    style="text-align:center;padding:25px;">

                    No approved drivers yet.

                </td>

            </tr>

            `;

            return;

        }

        topFive.forEach((player, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `

            <td>

                ${
                    index === 0 ? "🥇" :
                    index === 1 ? "🥈" :
                    index === 2 ? "🥉" :
                    "#" + (index + 1)
                }

            </td>

            <td>

                ${player.username ||
                  player.fullname ||
                  player.name ||
                  "-"}

            </td>

            <td>

                ${Number(player.points || 0)}

            </td>

            <td>

                ${Number(player.deliveries || 0)}

            </td>

            `;

            leaderboard.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   HALL OF FAME
========================================================== */

function loadChampions() {

    if (!championsGrid) return;

    championsGrid.innerHTML = `

    <div class="feature-card">

        <h2>🏆 Season 1</h2>

        <p>Coming Soon</p>

        <p>TCL TruckersMP Cash League</p>

        <p><strong>Prize Pool:</strong> R975</p>

    </div>

    `;

}

/* ==========================================================
   START
========================================================== */

loadSeasonLeaderboard();

loadChampions();

console.log("Seasons Loaded Successfully");