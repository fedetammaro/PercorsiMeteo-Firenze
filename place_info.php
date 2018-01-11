<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0"/>

    <title>Percorsi Meteo - Place info</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.8.0/css/flag-icon.min.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css">

    <link rel="stylesheet" href="css/place_info.css">
    <link rel="stylesheet" href="css/dialog.css">

    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
    <script src='https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'></script>

    <script type="text/javascript" src="js/place_info.js"></script>
    <script type="text/javascript" src="js/check_login.js"></script>
   
</head>
<body id="body">

<?php
    include 'php/retrieve_infos.php';
    $place_id = $_GET['place_id'];
    $user_id = $_GET['uid'];
    $myConnection = connectToDatabase();
?>

<div id="page_container">
    <div class="container" id="info_container">
        <div id="info_header">
            <span><b><?php getPlaceTitle($myConnection, $place_id); ?></b></span>
        </div>
        <div id="image_div">
            <img src="<?php getPlaceImage($myConnection, $place_id); ?>"/>
        </div>

        <div id="info_div">
            <?php getPlaceExtract($myConnection, $place_id); ?>
            <p id="read_more"><?php getPlaceArticles($myConnection, $place_id); ?></p>
        </div>

        <div id="bottom_buttons">
            <div class="buttons_div">
                <?php
                    $old_vote = getPlaceStatus($myConnection, $user_id, $place_id);
                    $indoorVotes = getPlaceIndoorVotes($myConnection, $place_id);
                    $outdoorVotes = getPlaceOutdoorVotes($myConnection, $place_id);
                    if($old_vote == 1) {
                        echo "<div id='indoor_button' class='btn btn-primary btn-lg' style='background-color: green; border-color: green;' onclick='indoorVote(); indoor();'>Indoor <span class='badge vote_badge'>$indoorVotes</span></div>";
                        echo "<div id='outdoor_button' class='btn btn-primary btn-lg' onclick='outdoorVote(); outdoor();'>Outdoor <span class='badge vote_badge'>$outdoorVotes</span></div>";
                    }elseif($old_vote == -1){
                        echo "<div id='indoor_button' class='btn btn-primary btn-lg' onclick='indoorVote(); indoor();'>Indoor <span class='badge vote_badge'>$indoorVotes</span></div>";
                        echo "<div id='outdoor_button' class='btn btn-primary btn-lg'  style='background-color: green; border-color: green;' onclick='outdoorVote(); outdoor();'>Outdoor <span class='badge vote_badge'>$outdoorVotes</span></div>";
                    }else {
                        echo "<div id='indoor_button' class='btn btn-primary btn-lg' onclick='indoorVote(); indoor();'>Indoor <span class='badge vote_badge'>$indoorVotes</span></div>";
                        echo "<div id='outdoor_button' class='btn btn-primary btn-lg'  onclick='outdoorVote(); outdoor();'>Outdoor <span class='badge vote_badge'>$outdoorVotes</span></div>";
                    }
                    mysqli_close($myConnection);
                ?>
                <script>
                    var old_vote = <?php echo $old_vote ?>;
                </script>
            </div>

            <span id="warning"><b>Beware:</b> Your vote will affect other users too.</span>

            <div class="buttons_div">
                <div class="btn btn-primary btn-lg save_button" onclick="sendVote();">Save</div>
                <div class="btn btn-primary btn-lg save_button" onclick="history.back();">Close</div>
            </div>
        </div>
    </div>
</div>

<div id="login-dialog" title="Login to the app"></div>

<div id="vote-dialog" title="Contribute saved"></div>

</body>
</html>
