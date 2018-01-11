<?php
header("Access-Control-Allow-Origin: *");
$page=isset($_GET['p'])?$_GET['p']:'';
error_reporting(E_ALL);

$connection = mysqli_connect('https://localhost', 'percorsimeteo', '', 'my_percorsimeteo');
if($connection->connect_error){
    die("Failed to connect with MySQL: " . $connection->connect_error);
}

if($page=='add'){
    $id = $_POST['id'];
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $email = $_POST['email'];
    $profile_picture = $_POST['profile_picture'];

    $query = "SELECT * FROM app_users WHERE facebook_id = '".$id."'";
    $checkResult = mysqli_query($connection, $query);

    if($checkResult->num_rows > 0){
        $query = "UPDATE app_users SET first_name = '".$name."', last_name = '".$surname."', email = '".$email."', profile_picture = '".$profile_picture."' WHERE facebook_id = '".$id."'";
        mysqli_query($connection, $query);
    }else{
        $query = "INSERT INTO app_users SET facebook_id = '".$id."', first_name = '".$name."', last_name = '".$surname."', email = '".$email."', profile_picture = '".$profile_picture."'";
        mysqli_query($connection, $query);
    }
}
mysqli_close($connection);
?>