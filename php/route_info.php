<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');

$connection = mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');

$places = $_POST['places'];
$fields = $_POST['fields'];

if($connection->connect_error){
    die("Failed to connect with MySQL: " . $connection->connect_error);
}

$returnPlaces = array();

if($fields == 'coords'){
    foreach($places as $place){
        $query = "SELECT latitude, longitude FROM app_places WHERE place_id = '" . $place . "'";
        $result = mysqli_query($connection, $query);
        $row = mysqli_fetch_assoc($result);
        array_push($returnPlaces, $row['latitude'] . "," . $row['longitude']);
    }
}elseif($fields == 'name'){
    foreach($places as $place){
        $query = "SELECT name, vote_count FROM app_places WHERE place_id = '" . $place . "'";
        $result = mysqli_query($connection, $query);
        $row = mysqli_fetch_assoc($result);
        array_push($returnPlaces, stripcslashes(utf8_encode($row['name'])) . "___" . $row['vote_count']);
    }
}elseif($fields == 'image'){
    $query = "SELECT wikipedia_image FROM app_places WHERE place_id = '" . $places . "'";
    $result = mysqli_query($connection, $query);
    $image = mysqli_fetch_assoc($result);
    if(!empty($image['wikipedia_image'])){
        echo $image['wikipedia_image'];
    }else{
        echo "no_image";
    }
    mysqli_close($connection);
    return;
}elseif($fields == 'status'){
    foreach($places as $place){
        $query = "SELECT vote_count FROM app_places WHERE place_id = '" . $place . "'";
        $result = mysqli_query($connection, $query);
        $row = mysqli_fetch_assoc($result);
        if($row['vote_count'] >= 0){
            array_push($returnPlaces, 'indoor');
        }else{
            array_push($returnPlaces, 'outdoor');
        }
    }
    echo implode(",", $returnPlaces);
    mysqli_close($connection);
    return;
}
echo implode("|", $returnPlaces);
mysqli_close($connection);
return;
?>