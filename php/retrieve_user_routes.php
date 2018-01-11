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

function mysqli_result($res, $row, $field=0) {
    $res->data_seek($row);
    $datarow = $res->fetch_array();
    return $datarow[$field];
}

function createRoutesTable($connection, $user){
    $query = "SELECT au.facebook_id, au.profile_picture, au.first_name, au.last_name, ar.route_name, ar.route_places FROM app_routes AS ar, app_users AS au WHERE ar.facebook_id = au.facebook_id AND ar.facebook_id = '" . $user ."'";

    $queryResult = mysqli_query($connection, $query);
    $returnRows = array();
    while($cycle = mysqli_fetch_array($queryResult)){
        $returnRows[] = array("facebook_id" => $cycle['facebook_id'], "profile_picture" => $cycle['profile_picture'], "first_name" => $cycle['first_name'], "last_name" => $cycle['last_name'], "route_name" => $cycle['route_name'], "route_places" => $cycle['route_places']);
    }

    echo "<table><tr><th>User</th><th>Route</th><th>Link to route</th></tr>";
    foreach($returnRows as $entry){
        $places_array = explode(",", $entry['route_places']);
        $indoor_count = 0;
        $outdoor_count = 0;
        foreach($places_array as $place){
            $query = "SELECT vote_count FROM app_places WHERE place_id = '" . $place . "'";
            $queryResult = mysqli_query($connection, $query);
            $vote = mysqli_result($queryResult, 0);
            if($vote < 0){
                $outdoor_count += 1;
            }elseif($vote > 0){
                $indoor_count += 1;
            }
        }
        if($indoor_count === 0 && $outdoor_count > 0){
            $route_type = "<i class='fa fa-tree'></i>";
        }elseif($outdoor_count === 0 && $indoor_count > 0){
            $route_type = "<i class='fa fa-university'></i>";
        }else{
            $route_type = "<i class='fa fa-tree'></i> / <i class='fa fa-university'></i>";
        }
        $quoted_route_name = "'" . $entry['route_name'] . "'";
        echo "<tr><td><img src=" . $entry['profile_picture'] . "><br>" . $entry['first_name'] . " " . $entry['last_name'] . "</td>
            <td>" . $entry['route_name'] . "<br>" . $route_type . "</td><td>" .
            '<div id="link_button" class="btn btn-primary" onclick="goToRoute([' . $entry['route_places'] .']);">Show</div>
            <div id="delete_button" class="btn btn-primary" onclick="deleteUserRoute(' . $quoted_route_name . ');">
            Delete</div>' . "</td></tr>";

    }
    echo "</table>";
}

?>