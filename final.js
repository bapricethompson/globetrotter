
let comm=document.getElementById("commentName");
let subButton = document.getElementById("submitButton");
let countName=document.getElementById("countryName");
let flag=document.getElementById("flag");
let coat=document.getElementById("coat");
let countryImagesDiv = document.getElementById("countryImages");
let listDeets=document.getElementById("listDeets");
let country="";
let secondDiv=document.getElementById("second");
let modalBig=document.getElementById("modalBig");
let gMap=document.getElementById("map");
let message=document.getElementById("searchMessage");
let countryData={};
let countryRandom=['germany','belgium','egypt','kenya','usa','mexico', 'spain','portugal','france','greece', 'india']
let randButton=document.getElementById("randomButton");
let bordData={};
let detButt=document.getElementById("detailsButton");

const closeButton = document.getElementsByClassName("close")[0];
closeButton.onclick = function() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none"; 
};

window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none"; 
    }
};


//event listener for the modal, modal provides geographical information
detailsButton.addEventListener("click", function() {
    let modal=document.getElementById("myModal");
    let modalContent=document.getElementById("modalContent");
    let modalTitle=document.getElementById("modalTitle");
    let modMap=document.getElementById("modalMap");
    let modalList=document.getElementById("modalList");

    modalList.innerHTML="";

    //update Modal Map
    modMap.src=`https://mainfacts.com/media/images/maps/${countryData.cca2}/${countryData.cca2.toLowerCase()}_blk.gif`;

    modalTitle.innerText=countryData.name.common;

    //landlocked
    let newLiLocked= document.createElement("li");
    newLiLocked.innerHTML = `<strong>Landlocked:</strong> ${countryData.landlocked ? countryData.landlocked : "Not available"}`;
    modalList.appendChild(newLiLocked);

    //area
    let newLiArea= document.createElement("li");
    newLiArea.innerHTML = `<strong> Area (in sq km):</strong> ${countryData.area ? countryData.area.toLocaleString() : "Not available"}`;
    modalList.appendChild(newLiArea);

    //region
    let newLiReg= document.createElement("li");
    newLiReg.innerHTML = `<strong>Sub-region:</strong> ${countryData.subregion ? countryData.subregion : "Not available"}`;
    modalList.appendChild(newLiReg);

    //bordering countries
    let bordUl=document.createElement("ul");
    bordUl.classList.add("scroll");
    if (countryData.borders){
        for (bord in countryData.borders){
            let newBord=document.createElement("li");
            newBord.textContent=countryData.borders[bord];
            bordUl.append(newBord);
        }
    }
    else{
        let newBord=document.createElement("li");
        newBord.textContent="Not available"
        bordUl.append(newBord);
        
    }
    
    let newLiBord= document.createElement("li");
    newLiBord.innerHTML = `<strong>Borders:</strong>`;
    newLiBord.appendChild(bordUl);
    modalList.appendChild(newLiBord);

    modal.style.display = "block";
});


randButton.addEventListener("click", function(){
    randomCountry(countryRandom);
});

subButton.addEventListener("click", function (){
    country=comm.value;
    callAPI(country);
    comm.value="";

});


function flagCoat(data){
    countryImagesDiv.style.display = "flex";
    flag.style.display = "none";
    coat.style.display = "none";

    if (data.flags && data.flags.png) {
        flag.src = data.flags.png;
        flag.style.display = "block";
    }
    
    if (data.coatOfArms && data.coatOfArms.png) {
        coat.src = data.coatOfArms.png;
        coat.style.display = "block";
    }

    //adjust the flag/coat display for countries that don't have both
    if (flag.style.display === "block" && coat.style.display === "block") {
        flag.style.width = "48%";
        coat.style.width = "48%";
        coat.style.margin = "0"; 
    } else if (flag.style.display === "block") {
        flag.style.width = "80%";
        flag.style.margin = "0 auto"; 
    } else if (coat.style.display === "block") {
        coat.style.width = "80%";
        coat.style.margin = "0 auto"; 
    } else {
        countryImagesDiv.style.display = "none";
    }


}


//updates country details on the main page
function updateDetails(data){
    flagCoat(data);
    countName.innerText=data.name.common;
    listDeets.innerHTML="";

    // Capital with error handling
    let newLiCap = document.createElement("li");
    newLiCap.innerHTML = `<strong> Capital:</strong> ${data.capital ? data.capital : "Not available"}`;
    listDeets.appendChild(newLiCap);

    // Population with error handling
    let newLiPop = document.createElement("li");
    newLiPop.innerHTML = `<strong>Population:</strong> ${data.population ? data.population.toLocaleString() : "Not available"}`;
    listDeets.appendChild(newLiPop);

    // UN Member with error handling
    let newLiUN = document.createElement("li");
    newLiUN.innerHTML = `<strong>UN Member:</strong>  ${data.unMember !== undefined ? (data.unMember ? "Yes" : "No") : "Not available"}`;
    listDeets.appendChild(newLiUN);

    // Start of Week with error handling
    let newLiStart = document.createElement("li");
    newLiStart.innerHTML = `<strong>Start of Week:</strong> ${data.startOfWeek 
        ? data.startOfWeek.charAt(0).toUpperCase() + data.startOfWeek.slice(1) 
        : "Not available"}`;
    listDeets.appendChild(newLiStart);

    //current time
    let newLiTime = document.createElement("li");
    newLiTime.innerHTML = `<strong>Current Date and Time:</strong> ${data.timezones[0]
        ? getCurrentTimeWithUTCOffset(data.timezones[0]) 
        : "Not available"}`;
    listDeets.appendChild(newLiTime);

    // Currency with error handling
    let newLiCurr = document.createElement("li");
    let currencyName = "Not available"; 
    if (data.currencies && Object.keys(data.currencies).length > 0) {
        currencyName = data.currencies[Object.keys(data.currencies)[0]].name;
    }
    newLiCurr.innerHTML = `<strong>Currency:</strong> ${currencyName}`;
    listDeets.appendChild(newLiCurr);

    // Languages with error handling
    let langText = data.languages ? Object.values(data.languages).join(", ") : "Not available";
    let newLiLangs = document.createElement("li");
    newLiLangs.innerHTML = `<strong>Languages:</strong> ${langText}`;
    listDeets.appendChild(newLiLangs);

    //Clear message if one present
    message.textContent="";

    //upadate the map
    gMap.innerHTML="";
    gMap.innerHTML=`
                    <iframe id="googMap" class="gmap_iframe"
                            frameborder="0"
                            scrolling="no"
                            marginheight="0"
                            marginwidth="0"
                            style="width: 100%;"
                            src="https://maps.google.com/maps?width=600&amp;height=500&amp;hl=en&amp;q=${data.capitalInfo.latlng[0]},${data.capitalInfo.latlng[1]}&amp;t=&amp;z=5&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                    </iframe>`;

};

//function to call the restcountries api, with error handling
function callAPI(country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`).then( (response)=>{
        if (!response.ok){
            message.textContent="";
            message.textContent="Hmm...something went wrong, please try a different country";
        }
        else{
            message.textContent="";
            message.textContent="Loading....";
            response.json().then( (data) => {
                countryData=data[0];
                console.log("this", countryData);
                updateDetails(countryData);
            });
        }
    })
};

document.addEventListener("keydown", function(event){
    if (event.key=== "Enter"){
        country=comm.value;
        callAPI(country);
        comm.value="";
    }
});

// FLIGHT API
// function callFlightAPI(orig, dest, depart, currency, one) {
//     fetch(`https://test.api.amadeus.com/v1/analytics/itinerary-price-metrics?originIataCode=${orig}&destinationIataCode=${depart}&departureDate=${depart}&currencyCode=${currency}&oneWay=${one}`).then( (response)=>{
//         if (!response.ok){
//             message.textContent="";
//             message.textContent="Hmm...something went wrong, please try a different country";
//         }
//         else{
//             message.textContent="";
//             message.textContent="Loading....";
//             response.json().then( (data) => {
//                 countryData=data[0];
//                 console.log("this", countryData);
//                 updateDetails(countryData);
//             });
//         }
//     })
// };


//choose a random country
function randomCountry(countries){
    randomIndex = Math.floor(Math.random() * countries.length);
    callAPI(countries[randomIndex]);
}


function getCurrentTimeWithUTCOffset(offsetString) {
    let offset = parseFloat(offsetString.replace("UTC", "").replace(":", "."));
    
    //will only work in UT because of this, can't figure out how to improve it
    offset=offset-7;
    
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

    
    const targetTime = new Date(utcTime + offset * 3600000);

    return Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(targetTime);
}

//runs when page loads so there is a country available
randomCountry(countryRandom);
