L.mapquest.key = 'YOUR-MAPQUEST-KEY';
var bing_maps_key = 'YOUR-BING-MAPS-KEY';
var openweathermap_key = 'YOUR-OPENWEATHERMAP-KEY';

var initial_places = localStorage.getItem('displayRoutePoints').split(',');
var selected_places = initial_places.slice();
var selected_places_temp = [];
var user_position = false;
var use_weather;
var retrieved_weather = '';
var places_coordinates = {};
var coordinates_list = [];
var places_names = {};
var map;
var route_changed = false;
var map_initialized = false;
var places_addresses = {};
var addresses_list = [];


$(document).ready(function(){
    //We create the dialog warning the user that one or more places can't be resolved in a route.
    $("#inaccurate-gps-dialog").dialog({
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

                    addresses_list = new Array(selected_places.length);
                    selected_places_temp = selected_places.slice();

                    if(user_position){
                        selected_places_temp.unshift('this_position');
                    }

                    /* This cycle will retrieve asynchronously the reverse geocoded address for each selected place.
                    Then, only when all places are retrieved, it will calculate a new route and display it. */
                    async.forEach(selected_places_temp, getAddress, function(response){
                        displayNewRoute(true);
                    });
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

    //We create the dialog indicating wether the route has been saved or an error occurred.
    $("#save-route-dialog").dialog({
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

    //We create the dialog warning the user that his/her position won't be saved along the route.
    $("#route-warning-dialog").dialog({
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

                    $("#route-input-dialog").dialog("open");
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

    //We create a dialog asking for the user a name for the route being saved.
    $("#route-input-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "Submit",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");

                    var route_name = document.getElementById('route_name').value;
                    if(route_name === null){
                        $("#save-route-dialog")
                            .text("Please input a route name!")
                            .dialog("open");
                        return;
                    }else{
                        if(route_name.length > 128){  //Can be increased only with its corresponding database entry.
                            $("#save-route-dialog")
                                .text("Your route name has exceeded maximum length (128 chars)," +
                                    "please insert a shorter one.")
                                .dialog("open");
                            return;
                        }
                    }

                    //AJAX call to save the route in the database.
                    $.ajax({
                        type: "POST",
                        url: "https://percorsimeteo.altervista.org/php/update_route.php",
                        data: {
                            uid: localStorage.getItem('user_id'),
                            action: 'save',
                            places: selected_places,
                            route_name: route_name
                        },
                        success: function(response){
                            if(response === 'insert_ok'){
                                $("#save-route-dialog")
                                    .text("Route successfully saved!")
                                    .dialog("open");
                                return;
                            }
                            if(response === 'duplicate_entry'){
                                $("#save-route-dialog")
                                    .text('You already named a route "' + route_name + '", please use another name.')
                                    .dialog("open");
                            }
                        }
                    });
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

    //We prevent the default checkboxex behaviour
    $('input[type="checkbox"]').click(function(event){
        event.preventDefault();
    });

    //If the weather was activated in the previous page, it's retrieved here and the weather icon is displayed.
    use_weather = (getUrlParameter('weather') === 'true');
    if(use_weather === true){
        retrieved_weather = localStorage.getItem('weather');
        updateWeatherIcon(retrieved_weather);

        var weather_switch = document.getElementById('weather_switch');
        weather_switch.setAttribute('checked', 'true');
        weather_switch.setAttribute('disabled', 'true');
        document.getElementById('weather_span').style.backgroundColor = 'lightgrey';
    }else{
        if(localStorage.getItem('weather') !== null){
            retrieved_weather = parseInt(localStorage.getItem('weather'));
        }
    }

    createRoute();
});


/**
 * This function is used to create the route to be displayed to the user. Has no input arguments or return arguments.
 */
function createRoute(){
    //Here we remove the first element if it's "this_position" so the function can retrieve places names and coordinates
    if(selected_places[0] === 'this_position'){
        user_position = true;
        selected_places.shift();
    }

    //AJAX call made to retrieve places names from the database
    $.ajax({
        type: "POST",
        url: "https://percorsimeteo.altervista.org/php/route_info.php",
        data: {
            places: selected_places,
            fields: 'name'
        },
        success: function(response) {
            var places = response.split("|");

            if(user_position){
                places.unshift('Your initial position');
            }

            var place_name;
            var place_icon;
            for(var index = 0; index < places.length; index++) {
                place_name = places[index].split("___")[0];
                place_status = parseInt(places[index].split("___")[1]);

                if(place_status > 0){
                    place_icon = " - <i class='fa fa-university'></i>";
                }else{
                    if(place_status < 0){
                        place_icon = " - <i class='fa fa-tree'></i>";
                    }else{
                        place_icon = " - <i class='fa fa-question'></i>";
                    }
                }

                //We proceed to create the list of selected points to display below the map.
                var li = document.createElement('li');
                li.className = 'single_poi';
                if(index === 0){
                    if(user_position){
                        li.innerHTML = '<i class="glyphicon glyphicon-user tag"></i><span class="poi_name">' +
                            place_name + ' <img src="https://assets.mapquestapi.com/icon/v2/marker-start-sm----.png">' +
                            '</span>';
                    }else{
                        places_names[selected_places[index]] = place_name;
                        li.innerHTML = '<i class="glyphicon glyphicon-minus-sign minus_tag tag" id="' +
                            selected_places[index] + '"  onclick="removePlace(' + selected_places[index] +
                            ')"></i><span class="poi_name">' + place_name + place_icon +
                            ' <img src="https://assets.mapquestapi.com/icon/v2/marker-start-sm----.png"></span>' +
                            '<i class="glyphicon glyphicon-info-sign map_tag info_tag" onclick="getPlaceInfo(' +
                            selected_places[index] + ')"></i>' + '<i class="fa fa-comment-o map_tag" ' +
                            'onclick="openPopup(' + selected_places[index] + ')"></i>';
                    }
                }else{
                    var actual_index;
                    if(user_position){
                        actual_index = index - 1;
                    }else{
                        actual_index = index;
                    }
                    places_names[selected_places[actual_index]] = place_name;
                    if(index === places.length - 1){
                        li.innerHTML = '<i class="glyphicon glyphicon-minus-sign minus_tag tag" id="' +
                            selected_places[actual_index] + '" onclick="removePlace(' + selected_places[actual_index] +
                            ')"></i><span class="poi_name">' + place_name + place_icon +
                            ' <img src="https://assets.mapquestapi.com/icon/v2/marker-end-sm----.png"></span>' +
                            '<i class="glyphicon glyphicon-info-sign map_tag info_tag" onclick="getPlaceInfo(' +
                            selected_places[actual_index] + ')"></i>' + '<i class="fa fa-comment-o map_tag" ' +
                            'onclick="openPopup(' + selected_places[actual_index] + ')"></i>';
                    }else{
                        li.innerHTML = '<i class="glyphicon glyphicon-minus-sign minus_tag tag" id="' +
                            selected_places[actual_index] + '" onclick="removePlace(' + selected_places[actual_index] +
                            ')"></i><span class="poi_name">' + place_name + place_icon +
                            ' <img src="https://assets.mapquestapi.com/icon/v2/marker-sm-' + (index+1) +
                            '---.png"></span>' + '<i class="glyphicon glyphicon-info-sign map_tag info_tag" ' +
                            'onclick="getPlaceInfo(' + selected_places[actual_index] + ')"></i>' +
                            '<i class="fa fa-comment-o map_tag" onclick="openPopup(' + selected_places[actual_index] +
                            ')"></i>';
                    }
                }
                var ul = document.getElementById('pois_ul').appendChild(li);
            }
        }
    });
    displayMap(selected_places, user_position, false);
}


/**
 * This function invokes MapQuest APIs to calculate the route and to display the map to the user.
 * @param route_places is the list of ID of places the user selected
 * @param user_position is a boolean value indicating wether the user is starting from his/her position or not
 * @param useAddress is a boolean value indicating wether we have to reverse geocode the addresses or not
 */
function displayMap(route_places, user_position, useAddress){
    if(route_places.length === 0 && user_position === false) {
        document.getElementById('map').className = '';
        document.getElementById('map').innerHTML = '<p id="empty_result">No route to display</p>';
    }else{
        if(useAddress){
            var map_center = [];

            //Here we make a request to geocode the address the user is starting from.
            L.mapquest.geocoding().geocode(addresses_list[0], function(error, result){
                map_center.push((' ' + result['results'][0]['locations'][0]['latLng']['lat'].toString()).slice(1));
                map_center.push((' ' + result['results'][0]['locations'][0]['latLng']['lng'].toString()).slice(1));
                map = L.mapquest.map('map', {
                    center: map_center,
                    layers: L.mapquest.tileLayer('map'),
                    zoom: 15
                });
                map_initialized = true;

                var directions = L.mapquest.directions();

                if(addresses_list.length === 2){
                    directions.route({
                        start: addresses_list[0],
                        end: addresses_list[1],
                        options: {
                            routeType: 'pedestrian',
                            doReverseGeocode: false
                        }
                    }, directionsCallback);
                }else{
                    directions.route({
                        start: addresses_list[0],
                        end: addresses_list[addresses_list.length - 1],
                        waypoints: addresses_list.slice(1, addresses_list.length - 1),
                        options: {
                            routeType: 'pedestrian',
                            doReverseGeocode: false
                        }
                    }, directionsCallback);
                }
            });
            return;
        }

        if(route_places.length === 0){
            document.getElementById('map').className = '';
            document.getElementById('map').innerHTML = '<p id="empty_result">No route to display</p>';
            return;
        }

        //AJAX call made to retrieve all selected places coordinates
        $.ajax({
            type: "POST",
            url: "https://percorsimeteo.altervista.org/php/route_info.php",
            data: {
                places: route_places,
                fields: 'coords'
            },
            success: function(response){
                coordinates_list = (' ' + response).slice(1).split("|");

                if(user_position){
                    coordinates_list.unshift(localStorage.getItem('this_position'));
                }

                createPlacesDictionary(coordinates_list);

                var directions = L.mapquest.directions();

                if(coordinates_list.length === 2){
                    directions.route({
                        start: coordinates_list[0],
                        end: coordinates_list[1],
                        options: {
                            routeType: 'pedestrian',
                            doReverseGeocode: false
                        }
                    }, directionsCallback);
                }else{
                    directions.route({
                        start: coordinates_list[0],
                        end: coordinates_list[coordinates_list.length - 1],
                        waypoints: coordinates_list.slice(1, coordinates_list.length - 1),
                        options: {
                            routeType: 'pedestrian',
                            doReverseGeocode: false
                        }
                    }, directionsCallback);
                }
            }
        });
    }
}


/**
 * This function handles success or failure of the route creation.
 * @param error contains the error returned by MapQuest API
 * @param response contains the response returned by MapqQuest API
 * @returns map an instance of a MapQuest API map
 */
function directionsCallback(error, response){
    /* If the error is the following, a place can't be geocoded using the provided address by MapQuest. So,
    we need to use Bing Maps reverse geocode to get an alternative address MapQuest will use.
    */
    if(error === 'No conditions ahead returned. ConditionsAhead is only supported for driving routes.'){
        getReversedAddresses();
    }

    if(response){
        document.getElementById('empty_result').style.display = 'none';

        if(map_initialized){
            map.off();
            map.remove();
        }

        var coordinates = [];
        coordinates.push(coordinates_list[0].split(',')[0]);
        coordinates.push(coordinates_list[0].split(',')[1]);
        map_center = coordinates;

        map = L.mapquest.map('map', {
            center: coordinates,
            layers: L.mapquest.tileLayer('map'),
            zoom: 15
        });
        map_initialized = true;

        //We make markers and route ribbon undraggable to avoid MapQuest handling the tentative of dragging.
        var directionsLayer = L.mapquest.directionsLayer({
            startMarker: {
                draggable: false
            },
            endMarker: {
                draggable: false
            },
            waypointMarker: {
                draggable: false
            },
            viaMarker: {
                draggable: false
            },
            routeRibbon: {
                draggable: false
            },
            directionsResponse: response
        }).addTo(map);

        return map;
    }
}


/**
 * This function creates a dictionary containing places IDs and their corresponding coordinates.
 * @param coordinates_list a list of coordinates
 */
function createPlacesDictionary(coordinates_list){
    if(user_position){
        temp_coords_list = coordinates_list.slice(1, coordinates_list.length);
    }else{
        temp_coords_list = coordinates_list;
    }

    for(var index = 0; index < selected_places.length; index++){
        places_coordinates[selected_places[index]] = temp_coords_list[index];
    }
}


/**
 * This function removes a point from the user defined route when the user wants to remove it.
 * @param place_id is the ID of the point to be removed
 */
function removePlace(place_id){
    if(!route_changed){
        route_changed = true;
        document.getElementById('refresh_div').style.display = 'flex';
    }

    selected_places.splice(selected_places.indexOf(place_id.toString()), 1);
    document.getElementById(place_id).classList.remove('glyphicon-minus-sign');
    document.getElementById(place_id).classList.remove('minus_tag');
    document.getElementById(place_id).classList.add('glyphicon-plus-sign');
    document.getElementById(place_id).classList.add('plus_tag');
    document.getElementById(place_id).setAttribute('onclick', 'addPlace(' + place_id + ')');
}


/**
 * This function adds back a point to the user defined route when the user wants to add a previously removed point back.
 * @param place_id is the ID of the point to be added
 */
function addPlace(place_id){
    var place_added = false;

    if(!route_changed){
        route_changed = true;
        document.getElementById('refresh_div').style.display = 'flex';
    }

    if(selected_places.length === 0){
        selected_places.push(place_id.toString());
    }else{
        var nextPoints = initial_places.slice(initial_places.indexOf(place_id.toString()));
        for(var index = 0; index < selected_places.length; index++) {
            if (nextPoints.indexOf(selected_places[index].toString()) >= 0) {
                selected_places.splice(index, 0, place_id.toString());
                place_added = true;
                break;
            } else {
                if (index === selected_places.length - 1) {
                    selected_places.push(place_id.toString());
                    place_added = true;
                    break;
                }
            }
        }
        if(!place_added){
            selected_places.unshift(place_id.toString());
        }
    }

    document.getElementById(place_id).classList.remove('glyphicon-plus-sign');
    document.getElementById(place_id).classList.remove('plus_tag');
    document.getElementById(place_id).classList.add('glyphicon-minus-sign');
    document.getElementById(place_id).classList.add('minus_tag');
    document.getElementById(place_id).setAttribute('onclick', 'removePlace(' + place_id + ')');
}


/**
 * This function opens the info page for a selected point.
 * @param place_id is the ID of the point of which the user wants to get informations
 */
function getPlaceInfo(place_id){
    window.location = "https://percorsimeteo.altervista.org/place_info.php?place_id=" + place_id + "&uid=" +
        localStorage.getItem('user_id');
}


/**
 * This function opens a popup on the map at the coordinates of a given point.
 * @param place_id is the ID of the point of which the user wants to open the popup
 */
function openPopup(place_id){
    var coordinates = {};
    coordinates['lat'] = places_coordinates[place_id].split(',')[0];
    coordinates['lng'] = places_coordinates[place_id].split(',')[1];

    $.ajax({
        type: "POST",
        url: "https://percorsimeteo.altervista.org/php/route_info.php",
        data: {
            places: place_id,
            fields: 'image'
        },
        success: function(response){
			if(response === 'no_image'){
				var customPopup = L.popup({ closeButton: true })
                .setLatLng(coordinates)
                .setContent('<strong>' + places_names[place_id] + '</strong>')
                .openOn(map);
				return;
			}
            var customPopup = L.popup({ closeButton: true })
                .setLatLng(coordinates)
                .setContent('<strong>' + places_names[place_id] + '</strong> \n <img class="popup-image" src="' +
                    response + '">')
                .openOn(map);
        }
    });
}


/**
 * This function warns the user of an inaccurate geocoding of the selected points.
 */
function getReversedAddresses(){
    $('#inaccurate-gps-dialog')
        .text("A place you've selected has not provided a precise street address. Places location accuracy will be" +
            "decreased.")
        .dialog('open');
}


/**
 * This function makes a call to Bing Maps reverse geocoding API and stores the results.
 * @param item is a parameter needed by async.js and contains the id of the place to retrieve coordinates
 * @param done is a parameter needed by async.js to signal the end of the asynchronous call
 */
function getAddress(item, done){
    if(item === 'this_position'){
        if(!places_addresses[item]){
            $.ajax({
                url: "https://dev.virtualearth.net/REST/v1/Locations/" + localStorage.getItem('this_position') +
                '?includeEntityTypes=address&key=' + bing_maps_key,
                dataType: 'jsonp',
                jsonp: 'jsonp',
                success: function (response){
                    var retrieved_address = response['resourceSets'][0]['resources'][0]['address']['addressLine'];
                    places_addresses['this_position'] = retrieved_address;
                    addresses_list[0] = (' ' + retrieved_address).slice(1) + ', Firenze, Italy';
                    done();
                },
                error: function (error){
                    console.log(error);
                }
            });
        }else{
            addresses_list[0] = (' ' + places_addresses['this_position']).slice(1)  + ', Firenze, Italy';
            done();
        }
    }else{
        if(!places_addresses[item]){
            $.ajax({
                url: "https://dev.virtualearth.net/REST/v1/Locations/" + places_coordinates[item] +
                '?includeEntityTypes=address&key=' + bing_maps_key,
                dataType: 'jsonp',
                jsonp: 'jsonp',
                success: function (response){
                    var retrieved_address = response['resourceSets'][0]['resources'][0]['address']['addressLine'];
                    places_addresses[item] = retrieved_address;
                    addresses_list[selected_places_temp.indexOf(item)] = (' ' + retrieved_address).slice(1)  +
                        ', Firenze, Italy';
                    done();
                },
                error: function (error){
                    done();
                }
            });
        }else{
            addresses_list[selected_places_temp.indexOf(item)] = (' ' + places_addresses[item]).slice(1)  +
                ', Firenze, Italy';
            done();
        }
    }
}


/**
 * Utility function used to call displayMap() and display a new map
 * @param useAddress is a boolean value indicating wether to use the reverse geocoding or not
 */
function displayNewRoute(useAddress){
    route_changed = false;
    document.getElementById('refresh_div').style.display = 'none';
    displayMap(selected_places, user_position, useAddress);
}


/**
 * Function used to open the dialog which permits to save the route into the database
 */
function saveRoute(){
    if(user_position){
        $("#route-warning-dialog")
            .text("Beware: your current position won't be saved, only the route between selected points of interest " +
                "will be saved.")
            .dialog("open");
    }else{
        $("#route-input-dialog").dialog("open");
    }
}


/**
 * Function used to toggle the weather on/off
 */
function toggleWeather(){
    if(getUrlParameter('weather') !== 'true'){
        use_weather = !use_weather;
        document.getElementById('weather_switch').checked = use_weather;
        weatherBasedChange();
    }
}


/**
 * Function used to handle a weather usage change, invoking OpenWeatherMap API if necessary.
 */
function weatherBasedChange(){
    if(use_weather){
        if(retrieved_weather === '') {
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/weather",
                data: {
                    q: 'Firenze,it',
                    APPID: openweathermap_key
                },
                success: function (response) {
                    retrieved_weather = parseInt((' ' + response.weather[0].id).slice(1));
                    localStorage.setItem('weather', retrieved_weather);
                    updateRoute();
                }
            });
        }else{
            updateRoute();
        }
    }else{
        document.getElementById('weather_container').style.display = 'none';
        document.getElementById('pois_ul').innerHTML = '';
        selected_places = initial_places.slice();
        createRoute();
    }
}


/**
 * Function used if the outside weather is bad to calculate a route without outdoor categorized places
 */
function updateRoute(){
    updateWeatherIcon(retrieved_weather);

    if(checkWeather(retrieved_weather)){
        var places;
        if(user_position){
            places = initial_places.slice(1, initial_places.length);
        }else{
            places = initial_places.slice();
        }

        $.ajax({
            type: "POST",
            url: "https://percorsimeteo.altervista.org/php/route_info.php",
            data: {
                places: places,
                fields: 'status'
            },
            success: function(response){
                response = response.split(",");
                selected_places.length = 0;
                for(var index = 0; index < places.length; index++){
                    if(response[index] === 'indoor'){
                        selected_places.push(places[index]);
                    }
                }
                document.getElementById('pois_ul').innerHTML = '';
                createRoute();
            }
        });
    }
}


/**
 * Function used to set new icon for the weather in the page
 * @param id is an integer used to identify the outside weather
 */
function updateWeatherIcon(id){
    var date = new Date();
    if(date.getHours() >= 7 && date.getHours() <= 18){
        document.getElementById('weather_icon').setAttribute('class', day_weather_dictionary[retrieved_weather]);
    }else{
        document.getElementById('weather_icon').setAttribute('class', night_weather_dictionary[retrieved_weather]);
    }
    document.getElementById('weather_container').style.display = 'flex';
}

/**
 * Function used to redirect the user to the login page
 */
function redirectLogin(){
    window.location = "https://percorsimeteo.altervista.org/index.html";
}

//Utility used to get the GET parameters from the URL
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};