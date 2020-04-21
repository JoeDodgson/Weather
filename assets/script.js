// Declare variables
openWeatherMapAPIkey = "e0f8ef0d68d0fa761676e0a5997449c5";
// Retrieve the previous searches from local storage
citiesHistory = localStorage.getItem("citiesHistory") || "";

// When the document has loaded, display the weather for the last searched city
$(document).ready(function() {

    // If there is city history data, pass into the createCityHistory and getWeather functions 
    if(citiesHistory !== ""){

        // Pass all searched cities into the createCityHistory function
        createCityHistory(citiesHistory);

        // Pass the last searched city into the getWeather function    
        getWeather(citiesHistory[citiesHistory.length - 1]);
    }
});

// Event listener for the listed cities. A clicked city is passed into the getWeather function
$(".city-history").click(function() {
    var cityName = this.textContent;
    getWeather(cityName);
});

// A function to retrieve the current & forecast weather and update the display on the web page 
// Example API call api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=e0f8ef0d68d0fa761676e0a5997449c5
function getWeather(cityName){
    
}

// A function to retrieve the UV index and update the display on the web page 
function getUVIndex(lat,lon) {
    
}

// A function to update the display of city search history on the web page 
function createCityHistory(citiesHistory){

}