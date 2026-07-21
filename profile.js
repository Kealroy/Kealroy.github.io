/* ==========================================================
   TCL TRUCKERSMP CASH LEAGUE
   PROFILE.JS
   VERSION 3.0 PROFESSIONAL
========================================================== */

"use strict";

/* ==========================================================
   FIREBASE IMPORTS
========================================================== */

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* ==========================================================
   URL PARAMETERS
========================================================== */

const params = new URLSearchParams(window.location.search);

const playerId = params.get("id");

/* ==========================================================
   DEFAULT PROFILE IMAGE
========================================================== */

const DEFAULT_AVATAR =
    "../images/default-profile.png";

/* ==========================================================
   PAGE ELEMENTS
========================================================== */

const profileImage =
    document.getElementById("profileImage");

const driverName =
    document.getElementById("driverName");

const driverCompany =
    document.getElementById("driverCompany");

const deliveries =
    document.getElementById("deliveries");

const points =
    document.getElementById("points");

const rank =
    document.getElementById("rank");

const level =
    document.getElementById("level");

const bio =
    document.getElementById("bio");

const distance =
    document.getElementById("distance");

const province =
    document.getElementById("province");

const country =
    document.getElementById("country");

const truckersmpid =
    document.getElementById("truckersmpid");

const joined =
    document.getElementById("joined");

const driverStatus =
    document.getElementById("driverStatus");

const driverStatusHero =
    document.getElementById("driverStatusHero");

const lastUpdated =
    document.getElementById("lastUpdated");

const achievement =
    document.getElementById("achievement");

const levelProgress =
    document.getElementById("levelProgress");

const levelProgressText =
    document.getElementById("levelProgressText");

    /* ==========================================================
   REFERRAL ELEMENTS
========================================================== */

const myReferralCode =
    document.getElementById("myReferralCode");

const referralCount =
    document.getElementById("referralCount");

const referralReward =
    document.getElementById("referralReward");

const copyReferral =
    document.getElementById("copyReferral");

    const shareReferral =
    document.getElementById("shareReferral");
/* ==========================================================
   HELPERS
========================================================== */

function setText(element, value) {

    if (element) {

        element.textContent = value;

    }

}

function setImage(src) {

    if (!profileImage) return;

    profileImage.src = src || DEFAULT_AVATAR;

    profileImage.onerror = () => {

        profileImage.src = DEFAULT_AVATAR;

    };

}

function formatNumber(value) {

    return Number(value || 0).toLocaleString();

}

function formatDate(dateString) {

    if (!dateString) return "-";

    try {

        return new Date(dateString).toLocaleString();

    }

    catch {

        return "-";

    }

}

/* ==========================================================
   LEVEL SYSTEM
========================================================== */

function calculateLevel(pointsValue) {

    return Math.floor(pointsValue / 500) + 1;

}

function levelProgressPercent(pointsValue) {

    const currentLevelPoints =
        pointsValue % 500;

    return Math.floor(
        (currentLevelPoints / 500) * 100
    );

}

/* ==========================================================
   ACHIEVEMENT SYSTEM
========================================================== */

function getAchievement(player) {

    const pts =
        Number(player.points || 0);

    const deliveries =
        Number(player.deliveries || 0);

    if (pts >= 5000)
        return "👑 Legend Driver";

    if (pts >= 3000)
        return "🏆 Elite Driver";

    if (pts >= 1500)
        return "🥇 Professional Driver";

    if (deliveries >= 500)
        return "🚛 Delivery Master";

    if (deliveries >= 100)
        return "📦 Experienced Driver";

    return "🌱 Rookie Driver";

}
/* ==========================================================
   LOAD PLAYER PROFILE
========================================================== */

async function loadProfile() {

    if (!playerId) {

        setText(driverName, "Driver Not Found");

        setText(
            bio,
            "No driver ID was supplied in the URL."
        );

        return;

    }

    try {

        /* ==========================================
           GET DRIVER
        ========================================== */

        const playerRef =
            doc(db, "players", playerId);

        const playerSnap =
            await getDoc(playerRef);

        if (!playerSnap.exists()) {

            setText(driverName, "Driver Not Found");

            setText(
                bio,
                "The requested driver does not exist."
            );

            return;

        }

        const player =
            playerSnap.data();

        /* ==========================================
           BASIC INFORMATION
        ========================================== */

        const displayName =

            player.username ||

            player.fullname ||

            player.name ||

            "Unknown Driver";

        setText(driverName, displayName);

        setText(
            driverCompany,
            player.company || "Independent Driver"
        );

        const companyCard =
    document.getElementById("company");

setText(
    companyCard,
    player.company || "Independent Driver"
);

        setText(
            deliveries,
            formatNumber(player.deliveries)
        );

        setText(
            points,
            formatNumber(player.points)
        );

        if (distance) {

            distance.textContent =
                formatNumber(player.distance) +
                " KM";

        }

setText(
    truckersmpid,
    player.truckersmpid || "-"
);

/* ==========================================
   REFERRAL PROGRAM
========================================== */

if(myReferralCode){

    myReferralCode.value =
        player.referralCode || "";

}

if(referralCount){

    referralCount.textContent =
        Number(player.referralCount || 0);

}

if(referralReward){

    referralReward.textContent =
        "R" + Number(player.referralReward || 0);

}


        /* ==========================================
           PROFILE IMAGE
        ========================================== */

        setImage(player.avatar);

        /* ==========================================
           APPROVAL STATUS
        ========================================== */

        const statusText =

    player.approved

        ? "🟢 Approved Driver"

        : "🟠 Pending Approval";

if (driverStatus) {

    driverStatus.textContent = statusText;

}

if (driverStatusHero) {

    driverStatusHero.textContent = statusText;

}

        /* ==========================================
           LEVEL
        ========================================== */

        const driverLevel =
            calculateLevel(
                Number(player.points || 0)
            );

        setText(level, driverLevel);

        /* ==========================================
           LEVEL PROGRESS
        ========================================== */

        const progress =
            levelProgressPercent(
                Number(player.points || 0)
            );

        if (levelProgress) {

            levelProgress.value = progress;

        }

        if (levelProgressText) {

            levelProgressText.textContent =
                progress +
                "% to Level " +
                (driverLevel + 1);

        }

        /* ==========================================
           ACHIEVEMENT
        ========================================== */

        setText(
            achievement,
            getAchievement(player)
        );

        /* ==========================================
           LOAD ALL PLAYERS
        ========================================== */

        const snapshot =
            await getDocs(
                collection(db, "players")
            );

        const players = [];

        snapshot.forEach((docSnap) => {

            const data =
                docSnap.data();

            if (data.approved) {

                players.push({

                    id: docSnap.id,

                    username:
                        data.username ||

                        data.fullname ||

                        data.name ||

                        "Unknown",

                    points:
                        Number(data.points || 0),

                    deliveries:
                        Number(data.deliveries || 0)

                });

            }

        });

        /* ==========================================
           SORT RANKINGS
        ========================================== */

        players.sort((a, b) => {

            if (b.points !== a.points) {

                return b.points - a.points;

            }

            return (
                b.deliveries -
                a.deliveries
            );

        });

        /* ==========================================
           CALCULATE RANK
        ========================================== */

        const playerRank =

    players.findIndex(

        p => p.id === playerId

    ) + 1;

if (playerRank > 0) {

    setText(
        rank,
        "#" + playerRank
    );

}

else {

    setText(
        rank,
        "-"
    );

}

updateExtraStatistics(
    player,
    playerRank,
    players.length
);

createProfileSummary(
    player,
    playerRank,
    players.length
);
    }

    catch (error) {

        console.error(error);

        setText(
            driverName,
            "Error Loading Driver"
        );

        setText(
            bio,
            "Something went wrong while loading the profile."
        );

    }

}
/* ==========================================================
   DRIVER TITLE SYSTEM
========================================================== */

function getDriverTitle(points) {

    points = Number(points || 0);

    if (points >= 5000) return "👑 League Legend";

    if (points >= 3000) return "🏆 Champion";

    if (points >= 2000) return "🥇 Elite Driver";

    if (points >= 1000) return "🥈 Professional Driver";

    if (points >= 500) return "🥉 Advanced Driver";

    if (points >= 250) return "🚛 Experienced Driver";

    return "🌱 Rookie Driver";

}

/* ==========================================================
   PERFORMANCE RATING
========================================================== */

function getPerformanceRating(player) {

    const pts = Number(player.points || 0);
    const deliveries = Number(player.deliveries || 0);

    if (deliveries === 0)
        return "0%";

    const rating = Math.round(
        (pts / deliveries) * 100
    );

    return rating + "%";

}

/* ==========================================================
   MEDAL
========================================================== */

function getRankMedal(rank) {

    switch(rank){

        case 1:
            return "🥇";

        case 2:
            return "🥈";

        case 3:
            return "🥉";

        default:
            return "🏅";

    }

}

/* ==========================================================
   PROFILE SUMMARY
========================================================== */

function createProfileSummary(player, rankPosition, totalPlayers){

    const profileSummary =
        document.getElementById("profileSummary");

    if(!profileSummary)
        return;

    const medal =
        getRankMedal(rankPosition);

    const title =
        getDriverTitle(player.points);

    const rating =
        getPerformanceRating(player);

    profileSummary.innerHTML = `

        <div class="feature-card">

            <h2>${medal} ${title}</h2>

            <p>

                <strong>League Rank:</strong>

                ${
                    rankPosition > 0
                    ? "#" + rankPosition
                    : "-"
                }

            </p>

            <p>

                <strong>Total Drivers:</strong>

                ${totalPlayers}

            </p>

            <p>

                <strong>Performance:</strong>

                ${rating}

            </p>

            <p>

                <strong>Achievement:</strong>

                ${getAchievement(player)}

            </p>

        </div>

    `;

}

/* ==========================================================
   LEAGUE PERCENTILE
========================================================== */

function calculatePercentile(rankPosition, totalPlayers){

    if(totalPlayers === 0)
        return "-";

    return Math.round(

        ((totalPlayers-rankPosition+1)
        /totalPlayers)

        *100

    );

}

/* ==========================================================
   PROFILE STATISTICS
========================================================== */

function updateExtraStatistics(player, rankPosition, totalPlayers){

    const percentile =
        document.getElementById("percentile");

const title =
document.getElementById("driverTitleCard");

const rating =
document.getElementById("performanceRatingCard");

    if(percentile){

        percentile.textContent =
            calculatePercentile(
                rankPosition,
                totalPlayers
            ) + "%";

    }

    if(title){

        title.textContent =
            getDriverTitle(player.points);

    }

    if(rating){

        rating.textContent =
            getPerformanceRating(player);

    }

}
/* ==========================================================
   START APPLICATION
========================================================== */

loadProfile();

/* ==========================================================
   COPY REFERRAL CODE
========================================================== */

if(copyReferral){

    copyReferral.addEventListener("click", async () => {

        if(!myReferralCode.value){

            alert("No referral code available.");

            return;

        }

        try{

            await navigator.clipboard.writeText(
                myReferralCode.value
            );

            copyReferral.textContent =
                "✅ Copied";

            setTimeout(() => {

                copyReferral.textContent =
                    "📋 Copy";

            },2000);

        }

        catch(error){

            alert(
                "Could not copy referral code."
            );

        }

    });

}

/* ==========================================================
   SHARE REFERRAL
========================================================== */

if(shareReferral){

    shareReferral.addEventListener("click",()=>{

        const code =
            myReferralCode.value;

        if(!code){

            alert("No referral code available.");

            return;

        }

        const message =

`🚛 Join the TCL TruckersMP Cash League!

Use my referral code:

${code}

Register now and compete for weekly cash prizes!`;

        window.open(

"https://wa.me/?text=" +
encodeURIComponent(message),

"_blank"

);

    });

}