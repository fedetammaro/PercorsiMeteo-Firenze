<?php
header("Access-Control-Allow-Origin: *");

// Create connection
$connection =  mysqli_connect('localhost', 'percorsimeteo', '', 'my_percorsimeteo');
// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$id = $_GET['uid'];

$query = "SELECT * FROM app_users WHERE facebook_id = '".$id."'";

$result = mysqli_query($connection, $query);;
$response = mysqli_fetch_array($result);
mysqli_close($connection);

echo "
<div id='wrapper'>
    <div class='overlay'></div>
    <!-- Start Sidebar -->
    <nav class='navbar navbar-inverse navbar-fixed-top' id='sidebar-wrapper' role='navigation'>
        <ul class='nav sidebar-nav'>
            <div id='sidebar_header'>
                <li class='sidebar-brand no_hover'><h5>PercorsiMeteo Firenze</h5></li>
                <li class='no_hover'><img height='30' width='30' src='".$response['profile_picture']."'/>Logged in as ".$response['first_name']."</li>
            </div>
            <div id='scrollable_div'>
                <li><a href='#' onclick='displayUserRoutes();'><i class='fa fa-map'></i> See Your Routes</a></li>
                <li><a href='#' onclick='displayYourVotes();'><i class='fa fa-window-maximize'></i> See Your Contributions</a></li>
                <li><a href='#' onclick='logout();'><i class='fa fa-fw fa-facebook'></i> Facebook Logout</a></li>
                <div id='bottom_li'>
                    <li class='no_hover'><hr width=90% /></li>
                    <li><a href='#' onclick='displayHiw();'><i class='fa fa-cogs'></i> How it works</a></li>
                    <li><a href='#' onclick='showAbout();'><i class='fa fa-fw fa-info'></i> About</a></li>
                </div>
            </div>
        </ul>
    </nav>
    <!-- End Sidebar -->
    <header>
    <!-- Start Page Content Wrapper-->
    <div id='page-content-wrapper'>
        <div id='button_container'>
            <button type='button' class='hamburger is-closed animated fadeInLeft'
                    data-toggle='offcanvas'>
                <span class='hamb-top'></span>
                <span class='hamb-middle'></span>
                <span class='hamb-bottom'></span>
            </button>
        </div>
        <a onclick='goHome();'><h4>PercorsiMeteo Firenze</h4></a>
    </div>
    <!-- End Page Content Wrapper -->
    </header>
</div>
"
?>