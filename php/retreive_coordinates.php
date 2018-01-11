<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');

$connection = mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');

$points = $_GET['points'];

if($connection->connect_error){
    die("Failed to connect with MySQL: " . $connection->connect_error);
}

$returnPoints = array();
foreach($points as $point) {
    $query = "SELECT latitude, longitude FROM app_places WHERE place_id = '" . $point . "'";
    $result = mysqli_query($connection, $query);
    $row = mysqli_fetch_assoc($result);
    array_push($returnPoints, $row['latitude'] . "," . $row['longitude']);
}
echo implode("|", $returnPoints);
mysqli_close($connection);
?>