<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);

$connection = mysqli_connect('https://localhost', 'percorsimeteo', '', 'my_percorsimeteo');
if($connection->connect_error){
    die("Failed to connect with MySQL: " . $connection->connect_error);
}

$user_id = $_POST['user_id'];
$place_id = $_POST['place_id'];
$vote = $_POST['vote'];

$query = "SELECT * FROM app_votes WHERE facebook_id = '" . $user_id . "' and place_id = '" . $place_id . "'";
$checkResult = mysqli_query($connection, $query);

if($checkResult->num_rows > 0){
    $query = "UPDATE app_votes SET vote = '" . (int)$vote . "' WHERE facebook_id = '" . $user_id . "' and place_id = '" . $place_id . "'";
    mysqli_query($connection, $query);
}else{
    $query = "INSERT INTO app_votes SET facebook_id = '" . $user_id . "', place_id = '" . $place_id . "', vote = '" . (int)$vote . "'";
    mysqli_query($connection, $query);
}
mysqli_close($connection);
?>