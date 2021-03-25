let DateTime = luxon.DateTime;
let dateNow = DateTime.now()
let featureCity = document.querySelector("#feature-city");
let searchInput = document.querySelector("#city");
let cardContainer = document.querySelector(".card-container");
let searchBtn = document.querySelector(".search-btn");
let historyContainer = document.querySelector(".btn-group-vertical")
let cityLocation;
let historyBtn = document.querySelector(".btn-group-vertical")
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let dayCounter;

function reappendCity(event) {
    let targetBtn = event.target
    let pastCity = targetBtn.innerText
    console.log(pastCity)
    fetch("http://api.openweathermap.org/geo/1.0/direct?appid=40491e6057ab901eb30d4f74c5bf1b85&q=" + pastCity)
            .then(response => response.json())
            .then( data => {
            console.log(data[0])
            let latResp = data[0].lat
            let lonResp = data[0].lon
            cityLocation = {
            lat: latResp,
            lon: lonResp
            }
        clear()
        featureCity.innerText = pastCity
        getWeather(cityLocation)
        });
}

function clear() {
    cardContainer.innerHTML = "";
}

function appendSearch() {
    for(let i = 0; i < searchHistory.length; i++){
        let cityBtn = document.createElement("button");
        cityBtn.classList = "btn btn-outline-secondary";
        cityBtn.setAttribute("type", "button");
        let cityEl = searchHistory[i].city;
        cityBtn.innerHTML = cityEl;
        historyContainer.appendChild(cityBtn);
    };
}

function getGeocode(event) {
    event.preventDefault();
    let searchCity = searchInput.value;
    if(searchCity === ""){
        alert("Please enter a value")
    } else {
        clear();
        console.log(searchCity)
        let featureDate = dateNow.toLocaleString()
        featureCity.innerText = `${searchCity} ${featureDate}`
        console.log("clicked")
            fetch("http://api.openweathermap.org/geo/1.0/direct?appid=40491e6057ab901eb30d4f74c5bf1b85&q=" + searchCity)
            .then(response => response.json())
            .then( data => {
            console.log(data[0])
            let latResp = data[0].lat
            let lonResp = data[0].lon
            cityLocation = {
            lat: latResp,
            lon: lonResp
            }
        getWeather(cityLocation)
        });

        historyObj = {
            city: searchCity
        }; 

        let valueExist = false;
        // prevent duplicates in search history
        for(let i = 0; i < searchHistory.length; i++){
            let cityItem = searchHistory[i];
            let historyCity = cityItem.city;
            if( historyCity.toUpperCase() === searchCity.toUpperCase()) {
                valueExist = true;
                break;
            } 
        };
        if(valueExist){

        } else {
            searchHistory.push(historyObj)
        }
        
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        
    };
    historyContainer.innerHTML = "";
    appendSearch();
}



// &lat=33.767&lon=-118.1892

function getWeather(cityLocation) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?appid=40491e6057ab901eb30d4f74c5bf1b85&units=imperial&lat=" + cityLocation.lat + "&lon=" + cityLocation.lon)
    .then(response => response.json())
    .then(data => {
    console.log(data)
   
    // access the list array 
    let currentDayObj = data.daily[0]
    console.log(currentDayObj)

    let humidityResponse = currentDayObj.humidity;
    console.log(`the humidity is ${humidityResponse}`);
    let tempResponse = parseInt(currentDayObj.temp.day);
    console.log(`the temp is ${tempResponse}`);
    let windResponse = currentDayObj.wind_speed;
    console.log(`today's wind speed is ${windResponse}`);
    let uvResponse = parseInt(currentDayObj.uvi)
    console.log(`todays UV index is ${uvResponse}`)
    let descriptionResponse = currentDayObj.weather[0].icon;
    console.log(`today's weather is ${descriptionResponse }`);
        
    // feature city append values of list[0]
        
        let featureIconCode = data.daily[0].weather[0].icon;
        let featureIconUrl = "http://openweathermap.org/img/wn/" + featureIconCode + "@2x.png";
        let featureImg = document.createElement("img");
        featureImg.setAttribute("src", featureIconUrl)
        featureImg.classList = "day-icon"

        let featureTemp = document.querySelector("#feature-temp-val");
        featureTemp.innerText = `${tempResponse}°F`;
        let featureHum = document.querySelector("#feature-hum-val");
        featureHum.innerText = `${humidityResponse}%`;
        let featureWind = document.querySelector("#feature-wind-val");
        featureWind.innerText = `${parseInt(windResponse)}MPH`;
        let featureUv = document.querySelector("#feature-uv-val");
        featureUv.innerText = uvResponse;

         // UV index colors
         if (uvResponse >= 1 && uvResponse <= 2){
            featureUv.style.backgroundColor = "green"
         } else if (uvResponse >= 3 && uvResponse <= 5){
            featureUv.style.backgroundColor = "yellow"
         } else if (uvResponse >= 6 && uvResponse <= 7) {
            featureUv.style.backgroundColor = "red"
        } else if (uvResponse >= 8 && uvResponse <= 10){
            featureUv.style.backgroundColor = "pink"
        } else if  (uvResponse >= 11 ){
            featureUv.style.backgroundColor = "purple"
        } else {
            featureUv.style.backgroundColor = "";
         }

        featureCity.appendChild(featureImg)
        // loop over the nex 5 days and append to containers
        for(let i = 1; i < 6; i++){
            // create outside div col
            let colDiv = document.createElement("div");
            colDiv.classList = "col";
            let cardDiv = document.createElement("div");
            cardDiv.classList = "card day-card text-white bg-primary mb-3";
            cardDiv.setAttribute("style", "max-width: 18rem;");
            let cardBody = document.createElement("div");
            cardBody.classList = "card-body";
            let cardHead = document.createElement("h5");
            cardHead.classList = "card-title date";
            let cardTemp = document.createElement("p");
            cardTemp.classList = "card-text temp-val";
            let cardHum = document.createElement("p");
            cardHead.classList = "card-text hum-val";

            let iconCode = data.daily[i].weather[0].icon;
            let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            let img = document.createElement("img");
            img.setAttribute("src", iconUrl)
            img.classList = "day-icon"
            let temp = parseInt(data.daily[i].temp.day)
            let hum = data.daily[i].humidity

            let dayCounter = 1
            // date LUXON TODO finish this
            let dateRepeat = dateNow.plus({days: dayCounter})
            console.log(dateRepeat)
            cardHead.innerText =   `${dateRepeat.toLocaleString}`;
            cardTemp.innerText = `Temp: ${temp}°F`;
            cardHum.innerText = `Humidity: ${hum}%`;

            cardBody.appendChild(cardHead);
            cardBody.appendChild(img);
            cardBody.appendChild(cardTemp);
            cardBody.appendChild(cardHum);
            
            cardDiv.appendChild(cardBody);
            colDiv.appendChild(cardDiv);

            cardContainer.appendChild(colDiv);
            dayCounter ++
        }
       
    })
}

appendSearch()
historyBtn.addEventListener("click", reappendCity)
searchBtn.addEventListener("click", getGeocode)
// TODO
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city