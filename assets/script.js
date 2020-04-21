// Declare variables
var openWeatherMapAPIkey = "e0f8ef0d68d0fa761676e0a5997449c5";
var cityName = "";
// Retrieve the previous searches from local storage
// var citiesHistory = localStorage.getItem("citiesHistory") || "";
var citiesHistory = ["New York", "San Francisco", "Birmingham"]

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

// Event listener for the search button
$("#submit-btn").click(function() {

    // Prevent default actions from happening - e.g. page flickering
    event.preventDefault();


    // Checks if the user has typed anything into the search field
    if($("#city-input").val() == ""){
        alert("You must type a city in the Search field");
    }
    else{
        // Passes the input text into the getWeather function
        cityName = $("#city-input").val();
        getWeather(cityName);

        // Inserts the city name into citiesHistory array
        var cityNameIndex = citiesHistory.indexOf(cityName);
        
        // If the searched city was not in the citiesHistory array, put it at the end
        if(cityNameIndex === -1){
            citiesHistory.push(cityName);
        }
        // If the searched city was already in the citiesHistory array, move to the last element
        else{
            var endOfLoop = citiesHistory.length
            for(i = cityNameIndex; i < endOfLoop; i++){
                citiesHistory[i] = citiesHistory[i + 1];
            }
            citiesHistory[citiesHistory.length - 1] = cityName;
        }

        // Update the cities shown in the city history
        createCityHistory(citiesHistory); 
        
        // Clear the searched text from the input
        $("#city-input").val("");
    }

    console.log(citiesHistory);

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