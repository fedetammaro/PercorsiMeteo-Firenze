var openweathermap_key = 'YOUR-OPENWEATHERMAP-KEY';
L.mapquest.key = 'YOUR-MAPQUEST-KEY';

var use_position = false;
var get_nearby_points = false;
var use_weather = false;
var use_distance = true;
var using_old_settings = false;
var selected_points = [];
var retrieved_points = [];
var retrieved_weather;
var retrieved_coordinates = [];
var last_address = '';

var position_options = {
    enableHighAccuracy: true
};


//When opening the page, we check if we already retrieved the current weather
if(localStorage.getItem('weather') === null){
    retrieved_weather = '';
}else{
    retrieved_weather = parseInt(localStorage.getItem('weather'));
}


$(document).ready(function(){
    //We prepare a generic dialog
    $("#generic-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "OK",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                },
                class: "btn primary-btn confirm"
            }
        ],
        autoOpen: false,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            $('.ui-widget-overlay').addClass('custom-overlay');
            $('#wrapper').hide();
        }
    });

    //Dialog used when a new search address has been input by the user, warning the selected points will be erased
    $("#address-change-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "OK",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                    slider_prevalue = slider.value;
                    last_address = (' ' + document.getElementById('position_input').value).slice(1);
                    selected_points = [];
                    searchPlaces(true, document.getElementById('position_input').value.toLowerCase());
                },
                class: "btn primary-btn confirm"
            },
            {
                text: "Cancel",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                    document.getElementById('position_input').value = (' ' + last_address).slice(1);
                },
                class: "btn primary-btn cancel"
            }
        ],
        autoOpen: false,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            $('.ui-widget-overlay').addClass('custom-overlay');
            $('#wrapper').hide();
        }
    });

    //Dialog used to warn the user of the possibile loss of points when toggling the weather on/off
    $("#weather-change-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "OK",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                    weatherBasedChange();
                },
                class: "btn primary-btn confirm"
            },
            {
                text: "Cancel",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                    use_weather = !use_weather;
                    document.getElementById('weather_switch').checked = use_weather;
                },
                class: "btn primary-btn cancel"
            }
        ],
        autoOpen: false,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            $('.ui-widget-overlay').addClass('custom-overlay');
            $('#wrapper').hide();
        }
    });

    /*Dialog used to warn the user of the loss of selected points when he searches for nearby points instead of an
    address */
    $("#position-change-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "OK",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                    if(!get_nearby_points){
                        get_nearby_points = true;
                        last_address = '';
                        selected_points = [];
                        activateGPS();
                    }else{
                        get_nearby_points = false;
                        selected_points = [];
                        searchCheck(true);
                    }
                },
                class: "btn primary-btn confirm"
            },
            {
                text: "Cancel",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                },
                class: "btn primary-btn cancel"
            }
        ],
        autoOpen: false,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            $('.ui-widget-overlay').addClass('custom-overlay');
            $('#wrapper').hide();
        }
    });

    //Inhibits the default behaviour for checkboxes so we can handle a custom behaviour
    $('input[type="checkbox"]').click(function(event){
        event.preventDefault();
    });

    //Inhibits the enter key to send the address form and performs a search function instead
    $('#position_input').keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            searchCheck(true);
            return false;
        }
    });

    /*Here if we go back to the search page and we have old form data saved, it will be retrieved and the page will have
    the same status as before */
    if(localStorage.getItem('search_settings') === null){
        document.getElementById('distance_radio').checked = true;
        get_nearby_points = true;
        activateGPS();
    }else{
        using_old_settings = true;
        var searchSettings = JSON.parse(localStorage.getItem('search_settings'));
        use_position = searchSettings['use_position'];
        get_nearby_points = searchSettings['get_nearby_points'];
        use_weather = searchSettings['use_weather'];
        slider.value = parseInt((' ' + searchSettings['search_radius']).slice(1));
        document.getElementById("slide_value").innerHTML = slider.value;

        if(searchSettings['sort_by_distance']){
            document.getElementById('distance_radio').checked = true;
        }else{
            document.getElementById('relevance_radio').checked = true;
            use_distance = false;
        }

        if(use_weather){
            document.getElementById('weather_switch').checked = true;
            retrieved_weather = parseInt(localStorage.getItem('weather'));
            setWeatherIcon();
        }

        selected_points = searchSettings['selected_points'];

        if(use_position){
            document.getElementById('position_switch').checked = true;
        }

        if(get_nearby_points){
            activateGPS();
        }else{
            document.getElementById('position_input').value = (' ' + searchSettings['search_input']).slice(1);
            searchCheck(true);
        }

        localStorage.removeItem('search_settings');
    }
});


/**
 * Function to redirect the user to the login page if he skipped the login
 */
function redirectLogin(){
    window.location = "http://percorsimeteo.altervista.org/index.html";
}


/**
 * Function to save the status of the page before a redirection
 */
function saveSettings(){
    var lastSearchSettings = {};

    lastSearchSettings['use_position'] = (use_position === true);
    lastSearchSettings['get_nearby_points'] = (get_nearby_points === true);
    lastSearchSettings['use_weather'] = (use_weather === true);
    lastSearchSettings['sort_by_distance'] = (use_distance === true);
    lastSearchSettings['search_radius'] = parseInt((' ' + slider.value).slice(1));
    lastSearchSettings['search_input'] = (' ' + last_address).slice(1);
    if(use_position){
        lastSearchSettings['selected_points'] = selected_points.slice(1);
    }else{
        lastSearchSettings['selected_points'] = selected_points.slice();
    }

    localStorage.setItem('search_settings', JSON.stringify(lastSearchSettings));
}


/**
 * Function invoked when the user wants to retrieve the nearby points. Shows a dialog then calls activateGPS()
 */
function getPointsNearby(){
    if(get_nearby_points){
        $("#generic-dialog")
            .dialog('option', 'title', 'Get points nearby')
            .text("You already retrieved your nearby points.")
            .dialog("open");
    }else{
        if(selected_points.length > 0){
            $("#position-change-dialog")
                .text("Are you sure you want to search points somewhere else? This will reset your selected points!")
                .dialog("open");
        }else{
            get_nearby_points = true;
            last_address = '';
            activateGPS();
        }
    }
}


/**
 * Redirects the user to the display route page
 */
function redirectDisplayRoute(){
    saveSettings();
    window.location = "http://percorsimeteo.altervista.org/display_route.php?uid=" + localStorage.getItem('user_id')
        + "&weather=" + use_weather;
}


/**
 * Function that creates a list of all IDs of retrieved points. Also creates the Sortable list of selected points.
 */
function getPointsIdList(){
    retrieved_points = [];
    var points_list = document.getElementsByClassName('single_poi');
    for(var index = 0; index < points_list.length; index++){
        retrieved_points.push(points_list[index].id);
    }

    var selected_list = document.getElementById('selected_pois');
    var draggable_list = Sortable.create(selected_list, {
        onEnd: function(evt){
            var itemEl = evt.item;  // dragged HTMLElement
            selected_points.move(evt.oldIndex, evt.newIndex);
        }
    });
}


/**
 * Function that places a removed points back to its original place in the retrieved points list
 * @param place_id is the ID of the points to be put back in its original place
 */
function restorePointOrder(place_id){
    var nextPoints = retrieved_points.slice(retrieved_points.indexOf(place_id) + 1);
    var points_list = document.getElementById('all_pois').getElementsByClassName('single_poi');
    if(nextPoints.length === 0){
        document.getElementById('all_pois').insertBefore(document.getElementById(place_id),
            points_list[points_list.length]);
    }
    if(points_list.length === 0){
        document.getElementById('all_pois').appendChild(document.getElementById(place_id));
        return;
    }
    for(var index = 0; index < points_list.length; index++){
        if(nextPoints.indexOf(points_list[index].id) != -1){
            document.getElementById('all_pois').insertBefore(document.getElementById(place_id), points_list[index]);
            return;
        }
    }
}


/**
 * Function that moves a retrieved point to the selected points list, both visually and functionally
 * @param place_id is the ID of the place the user selected to add
 */
function addPoint(place_id){
    if($('#selected_pois li').length == 0){
        document.getElementById('selected_pois').style.borderBottom = 'solid 1px';
    }
    document.getElementById(place_id).firstElementChild.classList.remove('glyphicon-plus-sign');
    document.getElementById(place_id).firstElementChild.classList.remove('plus_tag');
    document.getElementById(place_id).firstElementChild.classList.add('glyphicon-minus-sign');
    document.getElementById(place_id).firstElementChild.classList.add('minus_tag');
    document.getElementById(place_id).firstElementChild.setAttribute('onclick', 'removePoint(this.parentNode.id)');

    $('#selected_pois').append(document.getElementById(place_id));
    var drag_handle = document.createElement('i');
    drag_handle.setAttribute('class', 'handle fa fa-bars');
    document.getElementById(place_id).insertBefore(drag_handle, document.getElementById(place_id).firstElementChild);

    if(!using_old_settings){
        selected_points.push(place_id);
    }
}


/**
 * Function that moves a selected point back to te retrieved points list, both visually and functionally
 * @param place_id is the ID of the place the user selected to remove
 */
function removePoint(place_id){
    if($('#selected_pois li').length == 1){
        document.getElementById('selected_pois').style.borderBottom = '0';
    }
    restorePointOrder(place_id);
    document.getElementById(place_id).removeChild(document.getElementById(place_id).firstElementChild);
    document.getElementById(place_id).firstElementChild.classList.add('glyphicon-plus-sign');
    document.getElementById(place_id).firstElementChild.classList.add('plus_tag');
    document.getElementById(place_id).firstElementChild.classList.remove('glyphicon-minus-sign');
    document.getElementById(place_id).firstElementChild.classList.remove('minus_tag');
    document.getElementById(place_id).firstElementChild.setAttribute('onclick', 'addPoint(this.parentNode.id)');
    selected_points.splice(selected_points.indexOf(place_id), 1);
}


/**
 * Function that toggles the user position as starting point on/off
 */
function togglePosition(){
    use_position = !use_position;
    document.getElementById('position_switch').checked = use_position;
}


/**
 * Function that toggles the weather usage on/off. Then proceeds to call weatherBasedChange() to check the weather
 */
function toggleWeather(){
    use_weather = !use_weather;
    document.getElementById('weather_switch').checked = use_weather;
    if(selected_points.length > 0){
        if(use_weather){
            $("#weather-change-dialog")
                .text("Are you sure you want to change weather usage? This could reset your selected points!")
                .dialog("open");
        }else{
            weatherBasedChange();
        }
    }else{
        weatherBasedChange();
    }
}


/**
 * Function that checks if the weather has been already retrieved. If not, it proceeds to make an AJAX call to
 * OpenWeatherMap and stores the retrieved weather. Then proceeds to call the appropriate function to retrieve indoor or
 * outdoor points based on whether the user is searching for points near him or at a selected address.
 */
function weatherBasedChange(){
    if(use_weather){
        if(retrieved_weather === ''){
            //Currently, since it's localised for Firenze, we only get the weather there
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/weather",
                data:{
                    q: 'Firenze,it',
                    APPID: openweathermap_key
                },
                success: function(response){
                    retrieved_weather = parseInt((' ' + response.weather[0].id).slice(1));
                    localStorage.setItem('weather', retrieved_weather);

                    setWeatherIcon();

                    //TODO
                    if(checkWeather(retrieved_weather)){
                        $.ajax({
                            type: 'POST',
                            url: "https://percorsimeteo.altervista.org/php/route_info.php",
                            data: {
                                places: selected_points,
                                fields: 'status'
                            },
                            success: function(response){
                                console.log(response);
                                var status = response.split(',');
                                var new_points = [];
                                for(index = 0; index < status.length; index++){
                                    if(status[index] === 'indoor') {
                                        new_points.push(selected_points[index]);
                                    }
                                }
                                if(new_points.length > 0){
                                    selected_points = new_points;
                                    using_old_settings = true;
                                }else{
                                    selected_points = [];
                                }

                                handleChange();
                            }
                        });
                        //selected_points = [];
                        //handleChange();
                    }
                }
            });
        }else{
            setWeatherIcon();

            if(checkWeather(retrieved_weather)){
                $.ajax({
                    type: 'POST',
                    url: "https://percorsimeteo.altervista.org/php/route_info.php",
                    data: {
                        places: selected_points,
                        fields: 'status'
                    },
                    success: function(response){
                        console.log(response);
                        var status = response.split(',');
                        var new_points = [];
                        for(index = 0; index < status.length; index++){
                            if(status[index] === 'indoor') {
                                new_points.push(selected_points[index]);
                            }
                        }
                        if(new_points.length > 0){
                            selected_points = new_points;
                            using_old_settings = true;
                        }else{
                            selected_points = [];
                        }

                        handleChange();
                    }
                });
            }
        }
    }else{
        document.getElementById('weather_icon').setAttribute('class', '');
        if(checkWeather(retrieved_weather)){
            using_old_settings = true;
            handleChange();
        }
    }
}


/**
 * Function used to set the weather icon when the user toggles the weather on
 */
function setWeatherIcon(){
    var date = new Date();
    if(date.getHours() >= 7 && date.getHours() <= 18){
        document.getElementById('weather_icon').setAttribute('class', day_weather_dictionary[retrieved_weather]);
    }else{
        document.getElementById('weather_icon').setAttribute('class', night_weather_dictionary[retrieved_weather]);
    }
}


/**
 * Function used to sort the list by distance. If the checkbox isn't already set, it proceeds to call
 * handleChange()
 */
function sortByDistance(){
    if(!use_distance){
        use_distance = true;
        if(selected_points.length > 0){
            using_old_settings = true;
        }
        handleChange();
    }
}


/**
 * Function used to sort the list by relevance. If the checkbox isn't already set, it proceeds to call
 * handleChange()
 */
function sortByRelevance(){
    if(use_distance){
        use_distance = false;
        if(selected_points.length > 0){
            using_old_settings = true;
        }
        handleChange();
    }
}


/**
 * Function that handles the change of points sorting and calls the appropriate function based on whether the user is
 * searching for points nearby him or at a selected address.
 */
function handleChange(){
    if(get_nearby_points){
        activateGPS();
    }else{
        searchPlaces(false, '');
    }
}


/**
 * Function that calls the geolocation function.
 */
function activateGPS(){
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(positionSuccess, positionFailure, position_options);
    }else{
        $("#generic-dialog")
            .dialog('option', 'title', 'GPS error')
            .text("Could not find your position, is your GPS activated?")
            .dialog("open");
    }
}


/**
 * Function called when getCurrentPosition finds the user position
 * @param position is the position retrieved by the GPS
 */
function positionSuccess(position){
    localStorage.setItem('this_position', '' + position.coords.latitude + ',' + position.coords.longitude);
    loadPoints(position.coords.latitude, position.coords.longitude);
}


/**
 * Function called when getCurrentPosition can't get a hold of the user position. It then proceeds to show a warning
 * dialog to the user.
 */
function positionFailure(){
    $("#generic-dialog")
        .dialog('option', 'title', 'GPS error')
        .text("Could not find your position, is your GPS activated?")
        .dialog("open");
}


/**
 * Function that handles the creation of the list of retrieved points, eventually filtering the outdoor points if the
 * weather is bad.
 * @param latitude is the latitude where to search for points
 * @param longitude is the longitude where to search for points
 */
function loadPoints(latitude, longitude){
    var coords = [[latitude, longitude]];
    if(use_weather){
        if(checkWeather(retrieved_weather)){
            async.forEach(coords, retrieveIndoorPlaces, function(response){
                getPointsIdList();
                if(using_old_settings){
                    getOldPoints();
                }
            });
        }else{
            async.forEach(coords, retrieveAllPlaces, function(response){
                getPointsIdList();
                if(using_old_settings){
                    getOldPoints();
                }
            });
        }
    }else{
        async.forEach(coords, retrieveAllPlaces, function(response){
            getPointsIdList();
            if(using_old_settings){
                getOldPoints();
            }
        });
    }
}


/**
 * Function used to retrieve all places, indoor or outdoor, by making an AJAX call to the database
 * @param item contains latitude and longitude for the database search
 * @param done is a parameter needed by async.js to signal the end of the asynchronous call
 */
function retrieveAllPlaces(item, done){
    if(use_distance){
        orderby = 'distance';
    }else{
        orderby = 'relevance';
    }

    $.ajax({
        type: 'GET',
        url: "https://percorsimeteo.altervista.org/php/retrieve_points.php",
        data: {
            lat: (' ' + item[0]).slice(1),
            lon: (' ' + item[1]).slice(1),
            radius: slider.value,
            weather: 0,
            orderby: orderby
        },
        success: function(response){
            document.getElementById('poi_div').innerHTML = response;
            done();
        }
    });
}


/**
 * Function used to retrieve only indoor places by making an AJAX call to the database
 * @param item contains latitude and longitude for the database search
 * @param done is a parameter needed by async.js to signal the end of the asynchronous call
 */
function retrieveIndoorPlaces(item, done){
    if(use_distance){
        orderby = 'distance';
    }else{
        orderby = 'relevance';
    }

    $.ajax({
        type: 'GET',
        url: "https://percorsimeteo.altervista.org/php/retrieve_points.php",
        data: {
            lat: (' ' + item[0]).slice(1),
            lon: (' ' + item[1]).slice(1),
            radius: slider.value,
            weather: 1,
            orderby: orderby
        },
        success: function(response){
            document.getElementById('poi_div').innerHTML = response;
            done();
        }
    });
}


/**
 * Function that opens the info page for the selected point
 * @param place_id is the id of the place to search infos
 */
function getPlaceInfo(place_id){
    saveSettings();
    window.location = "https://percorsimeteo.altervista.org/place_info.php?place_id=" + place_id + "&uid=" +
        localStorage.getItem('user_id');
}


/**
 * Function that handles the search for points nearby a selected address.
 * @param new_address is a boolean. It's true when the search is initiated by the user inputting a new address, false if
 * the search is made because of a setting change (radius, relevance/distance...)
 */
function searchCheck(new_address){
    if(get_nearby_points){
        if(selected_points.length > 0){
            $("#position-change-dialog")
                .text("Are you sure you want to search points somewhere else? This will reset your selected points!")
                .dialog("open");
            return;
        }else{
            get_nearby_points = false;
        }
    }
    var user_input = document.getElementById('position_input').value;
    if(user_input === ''){
        return;
    }

    if(last_address.toLowerCase() === user_input.toLowerCase() && slider_prevalue === slider.value){
        return;
    }

    if(last_address.toLowerCase() !== user_input.toLowerCase()){
        if(selected_points.length > 0 && !using_old_settings){
            $("#address-change-dialog")
                .text("Are you sure you want to input another address? This will reset your selected points!")
                .dialog("open");
            return;
        }
        slider_prevalue = slider.value;
        last_address = (' ' + user_input).slice(1);

        if(!using_old_settings){
            selected_points = [];
        }

        searchPlaces(new_address, user_input.toLowerCase());
    }else{

        if(!using_old_settings){
            selected_points = [];
        }

        searchPlaces(new_address, user_input.toLowerCase());
    }
}


/**
 * Function that performs the actual places search and eventually caches the geolocation results
 * @param new_address is a boolean. It's true when the search is initiated by the user inputting a new address, false if
 * the search is made because of a setting change (radius, relevance/distance...)
 * @param user_input contains the user query
 */
function searchPlaces(new_address, user_input){
    if(new_address){
        retrieved_coordinates = [];

        var search_string = user_input + ', Italia';

        $.ajax({
            type: "POST",
            url: "https://percorsimeteo.altervista.org/php/search_address.php",
            data: {
                query: user_input,
                action: 'read',
                latitude: '',
                longitude: ''
            },
            success: function(response){
                if(response == 'not_found'){
                    L.mapquest.geocoding().geocode(search_string, manageCoordinates);

                    function manageCoordinates(error, response){
                        var location = response.results[0].locations[0];
                        var coordinates = location.displayLatLng;
                        $.ajax({
                            type: "POST",
                            url: "https://percorsimeteo.altervista.org/php/search_address.php",
                            data: {
                                query: user_input,
                                action: 'write',
                                latitude: coordinates.lat,
                                longitude: coordinates.lng
                            },
                            success: function(response){
                            }
                        });
                        retrieved_coordinates.push(coordinates.lat);
                        retrieved_coordinates.push(coordinates.lng);
                        loadPoints(coordinates.lat, coordinates.lng);
                        return false;
                    }
                }else{
                    var coordinates = response.split(',');
                    retrieved_coordinates.push(coordinates[0]);
                    retrieved_coordinates.push(coordinates[1]);
                    loadPoints(coordinates[0], coordinates[1]);
                }
            }
        });
    }else{
        loadPoints(retrieved_coordinates[0], retrieved_coordinates[1]);
    }
}


/**
 * Function that redirects the user to the display route page
 */
function displayRoute(){
    if(use_position){
        if(selected_points.length < 1){
            $("#generic-dialog")
                .dialog('option', 'title', 'Route selection')
                .text("Please select at least one point of interest to visit!")
                .dialog("open");
        }else{
            selected_points.unshift('this_position');
            localStorage.removeItem('displayRoutePoints');
            localStorage.setItem('displayRoutePoints', selected_points);
            redirectDisplayRoute();
            selected_points.shift();
        }
    }else{
        if(selected_points.length < 2){
            $("#generic-dialog")
                .dialog('option', 'title', 'Route selection')
                .text("Please select at least two points of interest to visit!")
                .dialog("open")
        }else{
            localStorage.removeItem('displayRoutePoints');
            localStorage.setItem('displayRoutePoints', selected_points);
            redirectDisplayRoute();
        }
    }
}


/**
 * Function used to add the points to the selected list when coming back from another page
 */
function getOldPoints(){
    for(index = 0; index < selected_points.length; index++){
        addPoint(selected_points[index]);
    }
    if(using_old_settings){
        using_old_settings = false;
    }
}


//Array prototype modification made so we can easily move a point from one position to another
Array.prototype.move = function(old_index, new_index){
    if(new_index >= this.length){
        var k = new_index - this.length;
        while((k--) + 1){
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};