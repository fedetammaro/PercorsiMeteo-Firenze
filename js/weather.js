//This file is such a mess...

//List containing all the good weather IDs by OpenWeatherMap. It's used to check the weather status
var good_weather_ids = [701,711,721,731,741,751,761,762,800,801,802,803,804,951,952,953,954,955];

var day_weather_dictionary = {
    200: "wi wi-storm-showers", 201: "wi wi-storm-showers", 202: "wi wi-storm-showers", 210: "wi wi-storm-showers",
    211: "wi wi-storm-showers", 212: "wi wi-storm-showers", 221: "wi wi-storm-showers", 230: "wi wi-storm-showers",
    231: "wi wi-storm-showers", 232: "wi wi-storm-showers", 300: "wi wi-rain", 901: "wi wi-storm-showers",
    960: "wi wi-storm-showers", 961: "wi wi-storm-showers", 301: "wi wi-rain", 302: "wi wi-rain", 310: "wi wi-rain",
    311: "wi wi-rain", 312: "wi wi-rain", 313: "wi wi-rain", 314: "wi wi-rain", 321: "wi wi-rain", 520: "wi wi-rain",
    521: "wi wi-rain", 522: "wi wi-rain", 531: "wi wi-rain", 500: "wi wi-day-rain-mix", 501: "wi wi-day-rain-mix",
    502: "wi wi-day-rain-mix", 503: "wi wi-day-rain-mix", 504: "wi wi-day-rain-mix", 511: "wi wi-snow",
    600: "wi wi-snow", 601: "wi wi-snow", 602: "wi wi-snow", 611: "wi wi-snow", 612: "wi wi-snow", 615: "wi wi-snow",
    616: "wi wi-snow", 620: "wi wi-snow", 621: "wi wi-snow", 622: "wi wi-snow", 903: "wi wi-snowflake-cold",
    701: "wi wi-day-fog", 711: "wi wi-day-fog", 721: "wi wi-day-fog", 731: "wi wi-day-fog", 741: "wi wi-day-fog",
    751: "wi wi-day-fog", 761: "wi wi-day-fog", 762: "wi wi-day-fog", 771: "wi wi-tornado", 781: "wi wi-tornado",
    900: "wi wi-tornado", 902: "wi wi-tornado", 958: "wi wi-tornado", 959: "wi wi-tornado", 800: "wi wi-day-sunny",
    801: "wi-day-cloudy", 802: "wi wi-cloud", 803: "wi wi-cloudy", 804: "wi wi-cloudy", 904: "wi wi-hot",
    905: "wi wi-day-cloudy-gusts", 951: "wi wi-day-cloudy-gusts", 952: "wi wi-day-cloudy-gusts",
    953: "wi wi-day-cloudy-gusts", 954: "wi wi-day-cloudy-gusts", 955: "wi wi-day-cloudy-gusts",
    956: "wi wi-day-cloudy-gusts", 957: "wi wi-day-cloudy-gusts", 906: "wi wi-day-hail"
};

var night_weather_dictionary = {
    200: "wi wi-storm-showers", 201: "wi wi-storm-showers", 202: "wi wi-storm-showers", 210: "wi wi-storm-showers",
    211: "wi wi-storm-showers", 212: "wi wi-storm-showers", 221: "wi wi-storm-showers", 230: "wi wi-storm-showers",
    231: "wi wi-storm-showers", 232: "wi wi-storm-showers", 300: "wi wi-rain", 901: "wi wi-storm-showers",
    960: "wi wi-storm-showers", 961: "wi wi-storm-showers", 301: "wi wi-rain", 302: "wi wi-rain", 310: "wi wi-rain",
    311: "wi wi-rain", 312: "wi wi-rain", 313: "wi wi-rain", 314: "wi wi-rain", 321: "wi wi-rain", 520: "wi wi-rain",
    521: "wi wi-rain", 522: "wi wi-rain", 531: "wi wi-rain", 500: "wi wi-night-alt-rain-mix",
    501: "wi wi-night-alt-rain-mix", 502: "wi wi-night-alt-rain-mix", 503: "wi wi-night-alt-rain-mix",
    504: "wi wi-night-alt-rain-mix", 511: "wi wi-snow", 600: "wi wi-snow", 601: "wi wi-snow", 602: "wi wi-snow",
    611: "wi wi-snow", 612: "wi wi-snow", 615: "wi wi-snow", 616: "wi wi-snow", 620: "wi wi-snow", 621: "wi wi-snow",
    622: "wi wi-snow", 903: "wi wi-snowflake-cold", 701: "wi wi-night-fog", 711: "wi wi-night-fog",
    721: "wi wi-night-fog", 731: "wi wi-night-fog", 741: "wi wi-night-fog", 751: "wi wi-night-fog",
    761: "wi wi-night-fog", 762: "wi wi-night-fog", 771: "wi wi-tornado", 781: "wi wi-tornado", 900: "wi wi-tornado",
    902: "wi wi-tornado", 958: "wi wi-tornado", 959: "wi wi-tornado", 800: "wi wi-night-clear",
    801: "wi wi-night-alt-cloudy", 802: "wi wi-cloud", 803: "wi wi-cloudy", 804: "wi wi-cloudy",
    905: "wi wi-night-alt-cloudy-gusts", 951: "wi wi-night-alt-cloudy-gusts", 952: "wi wi-night-alt-cloudy-gusts",
    953: "wi wi-night-alt-cloudy-gusts", 954: "wi wi-night-alt-cloudy-gusts", 955: "wi wi-night-alt-cloudy-gusts",
    956: "wi wi-night-alt-cloudy-gusts", 957: "wi wi-night-alt-cloudy-gusts", 906: "wi wi-night-alt-hail"
};


/**
 * Function used to check if the current weather is bad or not.
 * @param id is the OpenWeatherMap ID of the current weather
 * @returns {boolean} which is true if the outside weather is bad, false if good
 */
function checkWeather(id){
    return good_weather_ids.indexOf(id) === -1;
}