var fbAppId = 'YOUR-FB-APP-KEY';

//FB SDK initialization taken from FB documentation
window.fbAsyncInit = function() {
    FB.init({
        appId      : fbAppId,
        cookie     : true,
        xfbml      : true,
        version    : 'v2.10'
    });

    FB.AppEvents.logPageView();

    FB.getLoginStatus(function(response){
        if(response.status === 'connected'){
            localStorage.setItem('user_id', response.authResponse.userID);
            setUserDetails();
        }
    });
};

// Load the SDK asynchronously. Taken from FB SDK documentation
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/**
 * Function called when the user clicks on the login button
 */
function login(){
    FB.getLoginStatus(function(response){
        FB.login(function(response){
            if(response.authResponse){
                localStorage.setItem('user_id', response.authResponse.userID);
                setUserDetails();
            }
        }, {scope: 'public_profile, email'});
    });
}


/**
 * Function called by the login function to save or update the user details onto the database
 */
function setUserDetails(){
    FB.api('/' + localStorage.getItem('user_id'), {fields: 'first_name, last_name, email'}, function (response) {
        var profile_pic = 'https://graph.facebook.com/' + localStorage.getItem('user_id') + '/picture?type=square';
        if (response && !response.error) {
            localStorage.setItem('first_name', response.first_name);
            $.ajax({
                type: "POST",
                url: "https://percorsimeteo.altervista.org/php/insert_users.php?p=add",
                data: {
                    id: localStorage.getItem('user_id'),
                    name: response.first_name,
                    surname: response.last_name,
                    email: response.email,
                    profile_picture: profile_pic
                },
                success: function (data) {
                    redirectMain();
                }
            });
        }
    });
}


/**
 * Function used to retrieve the user details from the database
 * @param user_id is the unique application user id to retrieve infos
 */
function getUserDetails(user_id){
    $.ajax({
       type: "POST",
       url: "https://percorsimeteo.altervista.org/php/retrieve_users.php",
       data: {id:user_id},
       success: function(response) {
           var first_name = response.first_name;
           var last_name = response.last_name;
           var email = response.email;
           var profile_picture = response.profile_picture;
       }
    });
}


/**
 * Function used to redirect the user to the main application page after the login
 */
function redirectMain(){
    window.location = "https://percorsimeteo.altervista.org/select_route.php?uid=" + localStorage.getItem('user_id');
}