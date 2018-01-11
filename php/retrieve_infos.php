<?php
header("Access-Control-Allow-Origin: *");

function connectToDatabase(){
    $connection =  mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    return $connection;
}

function getPlaceTitle($myConnection, $place_id){
    $query = "SELECT name, place_type FROM app_places WHERE place_id = '" . $place_id . "'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    echo utf8_encode($row['name']) . " - " . ucfirst($row['place_type']);
}

function getPlaceCoordinates($myConnection, $place_id){
    $query = "SELECT latitude, longitude FROM app_places WHERE place_id = '" . $place_id . "'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    echo $row['latitude'] . "," . $row['longitude'];
}

function getPlaceExtract($myConnection, $place_id){
    $query = "SELECT wikipedia_extract FROM app_places WHERE place_id = '" . $place_id . "'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    if(empty($row['wikipedia_extract'])){
        echo "<p id='no_description'>No description available on Wikipedia</p>";
    }else {
        echo "<p id='description'>" . stripcslashes(utf8_encode($row['wikipedia_extract'])) . "</p>";
    }
}

function getPlaceIndoorVotes($myConnection, $place_id){
    $query = "SELECT count(*) as counter FROM app_votes WHERE place_id = '" . $place_id . "' and vote = '1'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    return $row['counter'];
}

function getPlaceOutdoorVotes($myConnection, $place_id){
    $query = "SELECT count(*) as counter FROM app_votes WHERE place_id = '" . $place_id . "' and vote = '-1'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    return $row['counter'];
}

function getPlaceArticles($myConnection, $place_id){
    $ch = curl_init();
    $query = "SELECT wikipedia_page_IT, wikipedia_page_EN FROM app_places WHERE place_id = '" . $place_id . "'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    $display_string = "Read more on Wikipedia:";
    if(empty($row['wikipedia_page_IT']) and empty($row['wikipedia_page_EN'])){
        $display_string = "";
    }else{
        if (!empty($row['wikipedia_page_IT'])) {
            $url = "https://it.wikipedia.org/wiki/" . curl_escape($ch, $row['wikipedia_page_IT']);
            $url = "'" . $url . "'";
            $onclick = '"openArticle(' . $url . ')"';
            $display_string = $display_string . " <i class='flag-icon flag-icon-it' onclick=$onclick></i>";
        }
        if (!empty($row['wikipedia_page_EN'])) {
            $url = "https://en.wikipedia.org/wiki/" . curl_escape($ch, $row['wikipedia_page_EN']);
            $url = "'" . $url . "'";
            $onclick = '"openArticle(' . $url . ')"';
            $display_string = $display_string . " <i class='flag-icon flag-icon-gb' onclick=$onclick></i>";
        }
    }
    curl_close($ch);
    echo $display_string;
}

function getPlaceImage($myConnection, $place_id){
    $query = "SELECT wikipedia_image FROM app_places WHERE place_id = '" . $place_id . "'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    if(!empty($row['wikipedia_image'])){
        echo $row['wikipedia_image'];
    }
}

function getPlaceStatus($myConnection, $user_id, $place_id){
    $query = "SELECT vote FROM app_votes WHERE facebook_id = '" . $user_id . "'  and place_id = '" . $place_id . "'";
    $result = mysqli_query($myConnection, $query);
    $row = mysqli_fetch_assoc($result);
    if(!empty($row['vote'])){
        return $row['vote'];
    }else{
        return "'no_vote'";
    }
}
?>