<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);

$connection = mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');
if($connection->connect_error){
    die("Failed to connect with MySQL: " . $connection->connect_error);
}

$uid = $_POST['uid'];
$action = $_POST['action'];
$places = $_POST['places'];
if(!empty($places)){
    $places = implode(",", $places);
}
$name = mysqli_escape_string($connection, $_POST['route_name']);

if($action === 'save'){
    $query = "SELECT * FROM app_routes WHERE facebook_id = '" . $uid . "' AND route_name = '" . $name . "'";
    $checkResult = mysqli_query($connection, $query);

    if($checkResult->num_rows > 0){
        echo "duplicate_entry";
    }else{
        $query = "INSERT INTO app_routes SET facebook_id = '" . $uid . "', route_name = '" . $name . "', route_places = '" . $places . "'";
        mysqli_query($connection, $query);
        echo "insert_ok";
    }
}elseif($action === 'delete'){
    $query = "DELETE FROM app_routes WHERE facebook_id = '" . $uid . "' AND route_name = '" . $name . "'";
    mysqli_query($connection, $query);
}
mysqli_close($connection);
?>