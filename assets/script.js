// Declare variables
var openWeatherMapAPIkey = "e0f8ef0d68d0fa761676e0a5997449c5";
var today;
var cityName = "";
var lat;
var lon;
var currentTemp;
var currentHumidity;
var currentWindSpeed;
var currentUVIndex;

// Retrieve the previous searches from local storage
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// When the document has loaded, display the weather for the last searched city
$(document).ready(function() {
    
    // If there is city history data, pass into the renderCityHistory and getWeather functions 
    if(searchHistory !== []){
        
        // Pass all searched cities into the renderCityHistory function
        renderCityHistory(searchHistory);
        
        // Pass the last searched city into the getWeather function    
        getWeather(searchHistory[searchHistory.length - 1]);
    }
});

// Event listener for the listed cities. A clicked city is passed into the getWeather function
$(document).on("click", ".city-history", function() {
    var cityName = this.textContent;
    console.log(this);
    getWeather(cityName);
});

// Event listener for the search button
$("#submit-btn").click(function() {
    
    // Prevent default actions from happening - e.g. page flickering
    event.preventDefault();
        
    // Check if the user has typed anything into the search field
    if($("#city-input").val() == ""){
        alert("You must type a city in the Search field");
    }
    else{
        // Passes the input text into the getWeather function
        cityName = $("#city-input").val();
        getWeather(cityName);
        
        // Clear the searched text from the input
        $("#city-input").val("");
    }
});

// Retrieve current weather, update the display and call the getUVIndex, getForecast and storeSearch functions
function getWeather(cityName){
    
    // Concatenate the cityName into the OWM weather API query URL
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + openWeatherMapAPIkey + "&units=metric"; 
    
    // ajax call to using the query URL
    $.ajax({
        type: "GET",
        url: queryURL,
        dataType: "json",
        success: function(data) {
            // Concatenate the returned city name with its country
            dataCityName = data.name + ", " + data.sys.country;
            
            // Take current date, month and year
            today = new Date();
            currentDateArray = [
                today.getDate(),
                today.getMonth(),
                today.getFullYear()
            ]
            
            //Add a zero in front of the date and month if less than 10
            currentDateArray.forEach(formatDate);
            
            // Concatenate current date into a string
            currentDateString = currentDateArray[0] + "/" + currentDateArray[1] + "/" + currentDateArray[2];         
            
            // Get weather icon
            currentWeatherIconID = data.weather[0].icon;
            currentWeatherIconURL = "http://openweathermap.org/img/wn/" + currentWeatherIconID +"@2x.png";
            
            // Update the current weather header
            $("#current-weather-header").text(dataCityName + " (" + currentDateString + ")  ");
            $("#current-weather-icon").attr("src",currentWeatherIconURL);
            
            // Retrieve all of the required weather data
            // Round the temperature to the nearest 0.1 degrees
            currentTemp = Math.round(data.main.temp * 10) / 10;
            // Take the humidity as it is
            currentHumidity = data.main.humidity;
            // Convert wind speed from m/s to mph and round to the nearest 1 mph
            currentWindSpeed = Math.round(data.wind.speed * 3600 / 1609.34);
            
            // Update the weather data displayed (except UV index, which comes from its own API)
            $("#current-temp").text("Temperature: " + currentTemp + "°C");
            $("#current-hum").text("Humidity: " + currentHumidity + "%");
            $("#current-wind").text("Wind speed: " + currentWindSpeed + "mph");
            
            // Pass the lat and long coordinates into the getUVIndex() function
            lat = data.coord.lat;
            lon = data.coord.lon;
            getUVIndex(lat,lon);
            
            // Call getForecast function and pass the cityName
            getForecast(cityName);
            
            // Call the storeSearch function and pass in the cityName
            storeSearch(cityName);
        }
    });
}

// Retrieve the forecast weather and update the display on the web page 
function getForecast(cityName){
    
    // Concatenate the cityName into the OWM forecast API query URL
    queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName  + "&appid=" + openWeatherMapAPIkey + "&units=metric";
    
    // ajax call using the query URL
    $.ajax({
        type: "GET",
        url: queryURL,
        dataType: "json",
        success: function(data) {
            // Remove any previous forecast cards
            $(".card").remove();
            
            //Update the 5 days forecast section - dynamically create the 5 cards
            for(i = 1; i <= 5; i++){
                // Find the index of the forecasts for the same time on each day
                // Forecast elements are at 3 hour intervals, so 8 elements = 24 hours
                j = i * 8 - 1;
                
                // Retrieve the required data from the API
                // Date
                date = data.list[j].dt_txt;
                forecastDate = date.slice(8,10) + "/" + date.slice(5,7) + "/" + date.slice(2,4);
                
                // Weather icon - use the ID to create an icon image URL
                forecastIconID = data.list[j].weather[0].icon;
                forecastIconURL = "http://openweathermap.org/img/wn/" + forecastIconID + "@2x.png";
                
                // Temperature
                forecastTemp = Math.round(data.list[j].main.temp * 10) / 10;
                
                // Humidity
                forecastHumidity = data.list[j].main.humidity;
                
                // Wind speed - convert from m/s to mph and round to the nearest 1 mph
                forecastWind = Math.round(data.list[j].wind.speed * 3600 / 1609.34 );
                
                // Create a new element for the forecast card
                var card = document.createElement("div");
                card.setAttribute("class","card text-white bg-primary mb-3 col-md-2");
                
                // Create a new element for the card body (to contain title, icon and text elements)
                var cardBody = document.createElement("div");
                cardBody.setAttribute("class","card-body");
                
                // Create a new element for the card title (populated with the date)
                var cardTitle = document.createElement("h5");
                cardTitle.setAttribute("class","card-title");
                cardTitle.textContent = forecastDate;
                
                // Create a new element for the forecast weather icon
                var cardIcon = document.createElement("img");
                cardIcon.setAttribute("class","card-text");
                cardIcon.setAttribute("height","45px");
                cardIcon.setAttribute("width","45px");
                cardIcon.setAttribute("alt","Weather icon");
                cardIcon.setAttribute("src",forecastIconURL);
                
                // Create a new element temperature card text
                var cardTemp = document.createElement("p");
                cardTemp.setAttribute("class","card-text");
                cardTemp.textContent = "Temp: " + forecastTemp + "°C";
                
                // Create a new element humidity card text
                var cardHumidity = document.createElement("p");
                cardHumidity.setAttribute("class","card-text");
                cardHumidity.textContent = "Humidity: " + forecastHumidity + "%";
                
                // Create a new element wind speed card text
                var cardWind = document.createElement("p");
                cardWind.setAttribute("class","card-text");
                cardWind.textContent = "Wind speed: " + forecastWind + "mph";
                
                // Append card sub-elements into the card body
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardIcon);
                cardBody.appendChild(cardTemp);
                cardBody.appendChild(cardHumidity);
                cardBody.appendChild(cardWind);
                
                // Append the card body into the forecast card
                card.appendChild(cardBody);
                
                // Append the forecast card into the forecast container
                $(".forecast").append(card);
            }            
        }
    });
    
}


// A function to retrieve the UV index and update the display on the web page 
function getUVIndex(lat,lon) {
    
    // Concatenate the lat and lon coordinates into the OWM UV index API query URL
    queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon  + "&appid=" + openWeatherMapAPIkey;
    
    // ajax call using the query URL    
    $.ajax({
        type: "GET",
        url: queryURL,
        dataType: "json",
        success: function(data) {

            // Retrieve the UV index value
            currentUVIndex = data.value;

            // Update the UV index value displayed
            $("#current-uv").text(currentUVIndex);

            // Remove any classes which may have been previously added
            $("#current-uv").removeClass("low moderate high very-high extreme");

            // Add a class, based on UV Index value
            if(currentUVIndex < 2.5){
                $("#current-uv").addClass("low");
            } else if(currentUVIndex < 5.5) {
                $("#current-uv").addClass("moderate");
            } else if(currentUVIndex < 7.5) {
                $("#current-uv").addClass("high");
            } else if(currentUVIndex < 10.5) {
                $("#current-uv").addClass("very-high");
            } else {
                $("#current-uv").addClass("extreme");
            }
        }
    })
}

// A function to update the display of city search history on the web page 
function renderCityHistory(searchHistory){

    // Clear out the previous search history
    $(".city-history").remove();

    // Check to see if the searchHistory array is blank or does not exist
    if(searchHistory !== [] && searchHistory !== "null"){

        // Go through each element in the searchHistory array
        for(i = 0; i < searchHistory.length; i++){

            // Create a new element for each past search, with required attributes and city name
            var pastSearch = document.createElement("div");
            pastSearch.setAttribute("class","city-history boxed");
            pastSearch.textContent = searchHistory[i];

            // Append the new element to the cities list container
            $("#cities-list").append(pastSearch);
        }
    }
}

// Function to store the name in the searchHistory array and save to localStorage 
function storeSearch(cityName){
            
    // Checks whether the searched city is in the searchHistory array
    var cityNameIndex = searchHistory.indexOf(cityName);
    
    // If the searched city was not in the searchHistory array, add it at the end
    if(cityNameIndex === -1){
        searchHistory.push(cityName);
    }
    // If the searched city was already in the searchHistory array, move to the last element
    else{
        var endOfLoop = searchHistory.length
        for(i = cityNameIndex; i < endOfLoop; i++){
            searchHistory[i] = searchHistory[i + 1];
        }
        searchHistory[endOfLoop - 1] = cityName;
    }
    
    // Update the cities shown in the search history
    renderCityHistory(searchHistory); 

    // Store the cities history in the local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Adds a zero in front of date and month if < 10
function formatDate(item, index, arr){
    if(arr[index] < 10){
        arr[index] = "0" + arr[index];
    }
}