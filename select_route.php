<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0"/>

    <title>Percorsi Meteo - Select route</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Chettan">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <link rel="stylesheet prefetch" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css">

    <link rel="stylesheet" href="css/select_route.css">
    <link rel="stylesheet" href="css/navbar.css">
    <link rel="stylesheet" href="css/about.css">
    <link rel="stylesheet" href="css/dialog.css">
    <link rel="stylesheet" href="css/weather-icons-wind.min.css">
    <link rel="stylesheet" href="css/weather-icons.min.css">

    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://api.mqcdn.com/sdk/mapquest-js/v1.1.0/mapquest.js"></script>
    <script type="text/javascript" src="//cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

    <script type="text/javascript" src="js/navbar.js"></script>
    <script type="text/javascript" src="js/async.js"></script>
    <script type="text/javascript" src="js/select_route.js"></script>
    <script type="text/javascript" src="js/check_login.js"></script>
    <script type="text/javascript" src="js/weather.js"></script>
    
</head>

<body id='body'>
<header>
    <?php
    include 'php/navbar.php'
    ?>
</header>

<div id="page_container">
    <div id="overlay-back"></div>
    <h3>Choose points of interest to visit</h3>
    <div id="form_container">
        <form accept-charset="UTF-8">
            <input id="position_input" type="text" name="city" placeholder="  Enter a query using 'street, city'...">
            <input id="search_submit" type="button" value="Search" onclick="searchCheck(true);">
        </form>

        <div id="slidecontainer">
            <h3>Select search radius: <span id="slide_value"></span> km</h3>
            <input type="range" min="1" max="5" value="1" id="my_range">
            <script type="text/javascript" src="js/slider.js"></script>
        </div>

        <form id="radio_buttons_form">
            <h1>Sort by:  </h1>
            <div>
                <input id="distance_radio" type="radio" name="sort_by" value="Distance" onclick="sortByDistance();"> Distance
                <input id="relevance_radio" type="radio" name="sort_by" value="Relevance" onclick="sortByRelevance();"> Relevance
            </div>
        </form>

        <div id="option_container">
            <div class="elements_container">
                <div class="toggle_div">
                    <div class="element_span">Start from current position</div>
                    <div class="toggle_switch">
                        <label class="switch">
                            <input id="position_switch" type="checkbox">
                            <span class="slider round" onclick="togglePosition();"></span>
                        </label>
                    </div>
                </div>
                <div class="toggle_div">
                    <div class="element_span">Use weather filter</div>
                    <div class="toggle_switch">
                        <label class="switch">
                            <input id="weather_switch" type="checkbox">
                            <span class="slider round" onclick="toggleWeather();"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="elements_container">
                <div class="element_span">Get points nearby</div>
                <div class="btn search_nearby_btn" onclick="getPointsNearby();">
                    <i class="fa fa-search"></i>
                </div>
            </div>
        </div>

        <div id="poi_container">
            <section id="poi_header">
                <div id="weather_icon_div"><i id="weather_icon"></i></div>
                <div id="title"><h2><b>Points of Interest</b></h2></div>
                <div id="go_button_container">
                    <div class="btn btn-primary" id="go_button" onclick="displayRoute();"><b>Go!</b></div>
                </div>
            </section>
            <div id="poi_div"></div>
        </div>
    </div>

    <?php
    include 'php/about.php'
    ?>
</div>

<div id="login-dialog" title="Login to the app"></div>

<div id="generic-dialog"></div>

<div id="address-change-dialog" title="Address change"></div>

<div id="weather-change-dialog" title="Weather change"></div>

<div id="position-change-dialog" title="Position change"></div>

</body>
</html>
