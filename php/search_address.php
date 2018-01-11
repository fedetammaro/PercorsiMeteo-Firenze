<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');

$connection = mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');

$search_query = addslashes($_POST['query']);
$action = $_POST['action'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

if($connection->connect_error){
    die("Failed to connect with MySQL: " . $connection->connect_error);
}

if($action === 'read'){
    $query = "SELECT latitude, longitude FROM app_queries WHERE text = '" . $search_query . "'";
    $check_result = mysqli_query($connection, $query);
    if($check_result->num_rows > 0){
        $coordinates = mysqli_fetch_assoc($check_result);
        echo $coordinates['latitude'] . "," . $coordinates['longitude'];
    }else{
        echo "not_found";
    }
}elseif($action === 'write'){
    $query = "INSERT INTO app_queries SET text = '" . $search_query . "', latitude = '" . $latitude . "', longitude = '" . $longitude ."'";
    mysqli_query($connection, $query);
}
mysqli_close($connection);
?>