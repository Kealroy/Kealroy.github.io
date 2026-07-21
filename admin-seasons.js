/* ==========================================================
   TCL TRUCKERSMP CASH LEAGUE
   ADMIN SEASON MANAGEMENT
   VERSION 1.0
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
    updateDoc,
    doc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



/* ==========================================================
   DOM ELEMENTS
========================================================== */


const seasonForm =
    document.getElementById("seasonForm");


const seasonName =
    document.getElementById("seasonName");


const seasonStart =
    document.getElementById("seasonStart");


const seasonEnd =
    document.getElementById("seasonEnd");


const seasonMessage =
    document.getElementById("seasonMessage");


const currentSeason =
    document.getElementById("currentSeason");




/* ==========================================================
   CHECK PAGE
========================================================== */


if(!seasonForm){

    console.log(
        "Season management not loaded on this page."
    );

}




/* ==========================================================
   MESSAGE
========================================================== */


function showSeasonMessage(text,color="#22c55e"){


    if(!seasonMessage)
        return;


    seasonMessage.textContent=text;


    seasonMessage.style.color=color;


}




/* ==========================================================
   CREATE SEASON
========================================================== */


async function createSeason(event){


event.preventDefault();



try{


    showSeasonMessage(
        "Creating season..."
    );



    /*
       Disable previous active seasons
    */


    const activeQuery = query(

        collection(db,"seasons"),

        where(
            "active",
            "==",
            true
        )

    );



    const activeSnapshot =
        await getDocs(activeQuery);



    for(
        const season of activeSnapshot.docs
    ){


        await updateDoc(

            doc(
                db,
                "seasons",
                season.id
            ),

            {

                active:false

            }

        );


    }





    /*
       Create new season
    */


    await addDoc(

        collection(db,"seasons"),

        {


            name:
                seasonName.value,


            startDate:
                seasonStart.value,


            endDate:
                seasonEnd.value,


            active:true,


            createdAt:
                serverTimestamp()


        }

    );




    showSeasonMessage(

        "Season created successfully!"

    );



    seasonForm.reset();



    loadCurrentSeason();



}


catch(error){


console.error(
    "Season Error:",
    error
);



showSeasonMessage(

    "Could not create season.",

    "#ef4444"

);


}


}





/* ==========================================================
   LOAD ACTIVE SEASON
========================================================== */


async function loadCurrentSeason(){


if(!currentSeason)
return;



try{


const q = query(

    collection(db,"seasons"),

    where(
        "active",
        "==",
        true
    )

);



const snapshot =
    await getDocs(q);



if(snapshot.empty){


    currentSeason.innerHTML =

    "No active season.";


    return;

}




let html="";



snapshot.forEach(doc=>{


const data=doc.data();



html += `


<div class="season-box">


<h3>

${data.name}

</h3>


<p>

Start:
${data.startDate}

</p>


<p>

End:
${data.endDate}

</p>


<p>

Status:
🟢 Active

</p>


</div>


`;



});



currentSeason.innerHTML=html;



}

catch(error){


console.error(error);


currentSeason.innerHTML=

"Could not load season.";


}



}





/* ==========================================================
   EVENTS
========================================================== */


if(seasonForm){


seasonForm.addEventListener(

"submit",

createSeason

);


loadCurrentSeason();


}




console.log(

"TCL Season Management Loaded"

);