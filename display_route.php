<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <title>Percorsi Meteo - Display route</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css">
    <link rel="stylesheet" href="https://api.mqcdn.com/sdk/mapquest-js/v1.1.0/mapquest.css">

    <link rel="stylesheet" href="css/navbar.css">
    <link rel="stylesheet" href="css/display_route.css">
    <link rel="stylesheet" href="css/dialog.css">
    <link rel="stylesheet" href="css/about.css">
    <link rel="stylesheet" href="css/weather-icons-wind.min.css">
    <link rel="stylesheet" href="css/weather-icons.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Chettan" >

    <script type="text/javascript" src="https://api.mqcdn.com/sdk/mapquest-js/v1.1.0/mapquest.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

    <script type="text/javascript" src="js/check_login.js"></script>
    <script type="text/javascript" src="js/async.js"></script>
    <script type="text/javascript" src="js/display_route.js"></script>
    <script type="text/javascript" src="js/weather.js"></script>
    <script type="text/javascript" src="js/navbar.js"></script>

</head>

<header>
    <?php
    include 'php/navbar.php';
    ?>
</header>

<body id="body">
<div class="page_container">
    <div id="overlay-back"></div> 
    <div id="map_header">
        <div class="btn primary-btn top_btn" onclick="history.back();">< Back</div>
        <h2><b>Your route</b></h2>
        <div class="btn primary-btn top_btn" onclick="saveRoute();">Save Route</div>
    </div>
    <div id="weather_container">
        <span id="weather_span_text">Current weather: <i id="weather_icon"></i></span>
    </div>
    <div id="map_container">
        <div id="map"><p id="empty_result"></p></div>
    </div>
    <div id="refresh_div">
        <span>Recalculate route: </span>
        <div class="btn btn-primary" onclick="displayNewRoute(false);">Refresh <i class="fa fa-fw fa-refresh"></i></div>
    </div>
    <div class="overflow" id="selected_pois">
        <ul id="pois_ul">
        </ul>
    </div>
    <div class="toggle_div">
        <span class="toggle_span">Use weather filter</span>
        <label class="switch">
            <input id="weather_switch" type="checkbox">
            <span id="weather_span" class="slider round" onclick="toggleWeather();"></span>
        </label>
    </div>
    <?php 
        include 'php/about.php'
    ?>
</div>

<div id="login-dialog" title="Login to the app"></div>

<div id="inaccurate-gps-dialog" title="Accuracy warning"></div>

<div id="save-route-dialog" title="Save route"></div>

<div id="route-warning-dialog" title="Save warning"></div>

<div id="route-input-dialog" title="Save route">
    <div>
        <p>Insert route name:</p>
        <input id="route_name" type="text" name="route_name" placeholder="Enter route name...">
    </div>
</div>

</body>
</html>
