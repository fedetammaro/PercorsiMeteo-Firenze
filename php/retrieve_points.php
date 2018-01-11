<?php
header("Access-Control-Allow-Origin: *");
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');

$connection = mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');

$lat = floatval($_GET['lat']);
$lon = floatval($_GET['lon']);
$radius = floatval($_GET['radius']);
$useWeather = $_GET['weather'];
$useDistance = $_GET['orderby'];

if($connection->connect_error){
    die("Failed to connect with MySQL: " . $connection->connect_error);
}

if($useWeather == 0){
    $placesQuery = "SELECT * FROM app_places ORDER BY importance DESC";
}else{
    $placesQuery = "SELECT * FROM app_places WHERE (vote_count >= 0) ORDER BY importance DESC";
}

$checkResult = mysqli_query($connection, $placesQuery);
$returnPlaces = array();
while($cycle=mysqli_fetch_array($checkResult)){
    $distance = distance($lat, $lon, $cycle['latitude'], $cycle['longitude']);
    $distance = round($distance, 2, PHP_ROUND_HALF_UP);
    $vote_count = $cycle['vote_count'];
    if($distance <= $radius){
        if($vote_count < 0){
            $returnPlaces[] = array("place_id" => $cycle['place_id'], "name" => $cycle['name'], "distance" => $distance, "count" => $vote_count, "icon" => "fa fa-tree");
        }elseif($vote_count == 0){
            $returnPlaces[] = array("place_id" => $cycle['place_id'], "name" => $cycle['name'], "distance" => $distance, "count" => $vote_count, "icon" => "fa fa-question");
        }else{
            $returnPlaces[] = array("place_id" => $cycle['place_id'], "name" => $cycle['name'], "distance" => $distance, "count" => $vote_count, "icon" => "fa fa-university");
        }
    }
}

if(empty($returnPlaces)){
    echo "<div id='points_alert'><p>No points of interest nearby.</p></div>";
    return;
}

if($useDistance == 'distance'){
    usort($returnPlaces, 'compare_distance');
}

echo "<ul id='selected_pois'></ul>";
echo "<ul id='all_pois'>";
foreach($returnPlaces as $place){
    echo "<li class='single_poi' id='" . $place['place_id'] . "'><i class='glyphicon glyphicon-plus-sign plus_tag tag' onclick='addPoint(this.parentNode.id)'></i><span class='poi_name'>" . stripcslashes(utf8_encode($place['name'])) . " (" . $place['distance'] . " km) - <i class='" . $place['icon'] . "'></i></span><a class='glyphicon glyphicon-info-sign info_tag' onclick='getPlaceInfo(this.parentNode.id)'></a></li>";
}
echo "</ul>";
mysqli_close($connection);

function distance($start_lat, $start_lon, $point_lat, $point_lon) {

    $theta = $start_lon - $point_lon;
    $dist = sin(deg2rad($start_lat)) * sin(deg2rad($point_lat)) +  cos(deg2rad($start_lat)) * cos(deg2rad($point_lat)) * cos(deg2rad($theta));
    $dist = acos($dist);
    $dist = rad2deg($dist);
    return (float)($dist * 60 * 1.1515 * 1.609344);

}

function compare_distance($a, $b){
    return $a['distance'] > $b['distance'];
}
?>