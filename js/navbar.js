var isClosed = false;
var fbAppId = 'YOUR-FB-APP-KEY';

/*Initializes the FB SDK so that users can logout from the application using the FB logout. Also initializes navbar
and its functions.
 */
$(document).ready(function () {
    window.fbAsyncInit = function() {
        FB.init({
            appId: fbAppId,
            cookie: true,
            xfbml: true,
            version: 'v2.10'
        });

        FB.AppEvents.logPageView();
    };

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    var trigger = $('.hamburger'),
        overlay = $('.overlay');

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });
});


/**
 * Function used to logout the user via the FB SDK
 */
function logout(){
    FB.getLoginStatus(function(response) {
        if (response && response.status === 'connected') {
            FB.logout(function(){
                window.location = "http://percorsimeteo.altervista.org";
            });
        }
    });
}


/**
 * Function used to redirect the user to the contributions page
 */
function displayYourVotes() {
    window.location = "https://percorsimeteo.altervista.org/display_votes.php?uid=" + localStorage.getItem('user_id');
}


/**
 * Function used to redirect the user to the How it works page
 */
function displayHiw() {
    window.location = "https://percorsimeteo.altervista.org/how_it_works.php?uid=" + localStorage.getItem('user_id');
}


/**
 * Function used to redirect the user to the saved route page
 */
function displayUserRoutes(){
    window.location = "https://percorsimeteo.altervista.org/display_user_routes.php?&uid=" + localStorage.getItem('user_id');
}


/**
 * Function used to redirect the user to the main page
 */
function goHome(){
    window.location = "https://percorsimeteo.altervista.org/select_route.php?&uid=" + localStorage.getItem('user_id');
}


/**
 * Function used to display the about section in the page
 */
function showAbout() {
	document.getElementsByTagName("body")[0].style = "overflow: hidden;"
    var trigger = $('.hamburger');
    var overlay = $('.overlay');
    var sidebar = $('#wrapper');
    var old_is_closed = document.getElementsByClassName('is-closed');
    overlay.hide();
    trigger.addClass('is-closed');
    trigger.removeClass('is-open');
    sidebar.toggleClass('toggled');
    $('#overlay, #overlay-back').fadeIn(500);
    document.getElementById('overlay').style.display = "flex";
    old_is_closed[1].id = "about_cross";
    old_is_closed[1].className = "hamburger is-open animated fadeInLeft about_cross";
    document.getElementById('about_cross').onclick = function() {
    	document.getElementsByTagName("body")[0].style = "overflow: scroll;"
    	var overlay_back = $('#overlay-back');
    	var about = $('.about_div');
		overlay_back.hide();
		about.hide();
        overlay.show();
        trigger.addClass('is-open');
        trigger.removeClass('is-closed');
        isClosed = true;
	}
}