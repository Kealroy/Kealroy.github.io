/* ==========================================================
   TCL TRUCKERSMP CASH LEAGUE
   ADMIN SEASON DISPLAY
   VERSION 1.0
========================================================== */


"use strict";



import {db} from "./firebase.js";


import {

collection,
getDocs,
query,
orderBy

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const currentSeason =
document.getElementById(
"currentSeason"
);



const seasonHistory =
document.getElementById(
"seasonHistory"
);





async function loadSeasons(){


try{


const q = query(

collection(db,"seasons"),

orderBy(
"createdAt",
"desc"
)

);



const snapshot =
await getDocs(q);



let history = "";

let active = false;



snapshot.forEach(doc=>{


const season =
doc.data();



if(season.active){


active=true;


currentSeason.innerHTML=`

<div class="season-box">

<h3>

🟢 ${season.name}

</h3>


<p>

Start Date:
${season.startDate}

</p>


<p>

End Date:
${season.endDate}

</p>


<p>

Status:
ACTIVE

</p>


</div>

`;


}





history += `


<div class="season-history">


<h4>

${season.name}

</h4>


<p>

${season.startDate}
-
${season.endDate}

</p>


<p>

Status:

${season.active 
? "🟢 Active"
: "⚪ Closed"}

</p>


</div>


`;



});





if(!active){


currentSeason.innerHTML=

"No active season created.";


}



seasonHistory.innerHTML =
history;



}



catch(error){


console.error(
"Season Display Error:",
error
);



currentSeason.innerHTML=

"Unable to load seasons.";



}



}



loadSeasons();


console.log(

"TCL Season Display Loaded"

);