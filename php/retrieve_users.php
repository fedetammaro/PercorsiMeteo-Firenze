<?php
header("Access-Control-Allow-Origin: *");

// Create connection
$connection =  mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');
// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$id = mysqli_real_escape_string($connection, $_POST['id']);

$query = "SELECT * FROM app_users WHERE facebook_id = '".$id."'";

$result = mysqli_query($connection, $query);
$response = array();

if ($result->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $response['facebook_id'] = $row["facebook_id"];
        $response['first_name'] = $row["first_name"];
        $response['profile_picture'] = $row["profile_picture"];
    }
    echo json_encode($response);
} else {
    echo "not_found";
}
mysqli_close($connection);
?>