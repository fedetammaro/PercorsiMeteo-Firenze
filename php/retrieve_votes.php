<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);

function connectToDatabase(){
    $connection =  mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    return $connection;
}

function createVotesTable($connection, $user_id){
    $query = "SELECT au.profile_picture, au.first_name, au.last_name, ap.name, av.vote FROM app_votes AS av, app_places AS ap, app_users AS au WHERE av.facebook_id = au.facebook_id AND av.place_id = ap.place_id AND av.facebook_id = '" . $user_id . "'";

    $queryResult = mysqli_query($connection, $query);
    $returnRows = array();
    while ($cycle = mysqli_fetch_array($queryResult)) {
        if ($cycle['vote'] == 1) {
            $voteText = "Indoor<br><i class='fa fa-university'></i>";
        } else {
            $voteText = "Outdoor<br><i class='fa fa-tree'></i>";
        }
        $returnRows[] = array("profile_picture" => $cycle['profile_picture'], "first_name" => $cycle['first_name'], "last_name" => $cycle['last_name'], "place_name" => $cycle['name'], "vote" => $voteText);
    }

    echo "<table><tr><th>User</th><th>Place name</th><th>Vote</th></tr>";
    foreach ($returnRows as $entry) {
        echo "<tr><td><img src=" . $entry['profile_picture'] . "><br>" . $entry['first_name'] . " " . $entry['last_name'] . "</td><td>" . $entry['place_name'] . "</td><td>" . $entry['vote'] . "</td></tr>";
    }
    echo "</table>";
}

?>