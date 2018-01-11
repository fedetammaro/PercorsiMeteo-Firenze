<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0"/>

    <title>Percorsi Meteo - How it works</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Chettan">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css">

    <link rel="stylesheet" href="css/how_it_works.css">
    <link rel="stylesheet" href="css/navbar.css">
    <link rel="stylesheet" href="css/about.css">
    <link rel="stylesheet" href="css/dialog.css">

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

    <script type="text/javascript" src="js/check_login.js"></script>
    <script type="text/javascript" src="js/navbar.js"></script>
</head>

<body id='body'>
<header>
    <?php
    include 'php/navbar.php'
    ?>
</header>
<div id='hiw'>
    <div id='hiw_title'>
        <div id='back_btn_div'>
            <div class="btn primary-btn back_btn" onclick="history.back();">< Back</div>
        </div>
        <h2><b>How It Works <i class='fa fa-cogs'></i></b></h2>
    </div>

    <div id='hiw_body'>
        <p>With this app you can search for points of interest and filter them if it's raining outside and you don't want to visit outdoor places.</p>
        <p>You can search for points of interest in two different ways: <br>
        <ul>
            <li>By typing an address in the search input to retrieve points of interest near that address</li>
            <li>By enabling geolocation services on your phone to retrieve points of interest nearby</li>
        </ul>
        </p>
        <p><b>Start from current position</b> allows you to use your current position as starting point.
            <b>Use weather filter</b> will toggle the weather filter on/off: once activated, if the weather is bad, you'll only see indoor places and those which aren't categorized yet.
            If a place isn't categorized yet, you'll see a question mark right next to the place name, like this <i class='fa fa-question'></i>.</p>
        <p>You can see infos about a place by pressing <i class='glyphicon glyphicon-info-sign info'></i>: if available, you'll see a photo, description, links to the italian and english Wikipedia articles of the selected point of interest.
            In the info page you can also vote to categorize a place as indoor or outdoor, so the point of interest will appear (or won't!) in case of bad weather. Every contribute will affect other user too, so please be careful what you vote for and remember to save your contribute before exiting the page!
            Once you've selected some places to visit you can rearrange their order or remove them, then the app will calculate a route between them.</p>
        <p>In the <b>Display route</b> page you'll see a map with your desired route and a list (along with their order) of all selected points of interest. You won't be able to change order from there, but you can remove or re-add a point from the ones you've selected before.
            Pressing <i class='glyphicon glyphicon-info-sign info'></i> will open the info page previously described, while <i class='fa fa-comment-o comment'></i> will open a popup on the map showing where that place is, along with its name and picture (if available). You can decide to use weather filter also in this page by pressing the toggle. 
            This will remove the outdoor places from the selected POIs list. If some places aren't categorized yet, this icon <i class='fa fa-question question'></i> will be shown next to them</p>
        <p>Last but not least, in the navbar you can find a page to see all your contributes and your saved routes.</p>
    </div>
</div>

<?php
include 'php/about.php'
?>

<div id="login-dialog" title="Login to the app"></div>

</body>
</html>