<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0"/>

    <title>Percorsi Meteo - Your routes</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <link rel="stylesheet prefetch" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Chettan">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css">

    <link rel="stylesheet" href="css/retrieve_table.css">
    <link rel="stylesheet" href="css/navbar.css">
    <link rel="stylesheet" href="css/about.css">
    <link rel="stylesheet" href="css/dialog.css">

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

    <script type="text/javascript" src="js/navbar.js"></script>
    <script type="text/javascript" src="js/display_user_routes.js"></script>
    <script type="text/javascript" src="js/check_login.js"></script>
</head>

<header>
    <?php
    include 'php/navbar.php';
    $user_id = $_GET['uid'];
    ?>
</header>

<body id="body">

<div id="overlay-back"></div>
<div id="fixed_back">
    <div id="back">
        <div class="title">
            <div class="btn primary-btn back_btn" onclick="history.back()">< Back</div>
            <h3>Your saved routes:</h3>
        </div>
    </div>
    <div id="votes_table">
        <?php
        include "php/retrieve_user_routes.php";

        $myConnection = connectToDatabase();
        createRoutesTable($myConnection, $user_id);
        mysqli_close($myConnection);
        include 'php/about.php';
        ?>
    </div>
</div>

<div id="login-dialog" title="Login to the app"></div>

<div id="delete-dialog" title="Confirm action"></div>

</body>
</html>