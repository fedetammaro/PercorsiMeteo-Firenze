var vote = 'null';


$(document).ready(function(){
    //Dialog used to display a message when the user votes to categorize a place
    $("#vote-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "OK",
                click: function() {
                    $(this).dialog("close");
                },
                class: "btn primary-btn confirm"
            }
        ],
        autoOpen: false,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            $('.ui-widget-overlay').addClass('custom-overlay');
        }
    });
});


/**
 * Function triggered when a user clicks to vote a place as indoor
 */
function indoorVote(){
    vote = 1;
}


/**
 * Function triggered when a user clicks to vote a place as outdoor
 */
function outdoorVote(){
    vote = -1;
}


/**
 * Function used to make an AJAX call to store the vote made by the user in the database
 */
function sendVote(){
    if(vote !== 'null') {
        $.ajax({
            type: "POST",
            url: "https://percorsimeteo.altervista.org/php/send_vote.php",
            data: {
                user_id: localStorage.getItem('user_id'),
                place_id: getUrlParameter('place_id'),
                vote: vote
            },
            success: function(){
                if(vote != old_vote){
                    if(vote === 1){
                        document.getElementsByClassName('vote_badge')[0].innerHTML =
                            parseInt(document.getElementsByClassName('vote_badge')[0].innerHTML) + 1;
                        if(old_vote == -1){
                            document.getElementsByClassName('vote_badge')[1].innerHTML =
                                parseInt(document.getElementsByClassName('vote_badge')[1].innerHTML) - 1;
                        }
                        old_vote = 1;
                    }else{
                        document.getElementsByClassName('vote_badge')[1].innerHTML =
                            parseInt(document.getElementsByClassName('vote_badge')[1].innerHTML) + 1;
                        if(old_vote == 1){
                            document.getElementsByClassName('vote_badge')[0].innerHTML =
                               parseInt(document.getElementsByClassName('vote_badge')[0].innerHTML) - 1;
                        }
                        old_vote = -1;
                    }
                    $("#vote-dialog")
                        .text("Contribute successfully registered!")
                        .dialog("open");
                }
            }
        });
    }else{
        $("#vote-dialog")
            .text("You didn't vote!")
            .dialog("open");
    }
}


/**
 * Function that colors the indoor button as green
 */
function indoor() {
    document.getElementById("indoor_button").style.backgroundColor="green";
    document.getElementById("indoor_button").style.borderColor="green";
    document.getElementById("outdoor_button").style.backgroundColor="lightgrey";
    document.getElementById("outdoor_button").style.borderColor="lightgrey";
}


/**
 * Function that colors the outdoor button as green
 */
function outdoor() {
    document.getElementById("outdoor_button").style.backgroundColor="green";
    document.getElementById("outdoor_button").style.borderColor="green";
    document.getElementById("indoor_button").style.backgroundColor="lightgrey";
    document.getElementById("indoor_button").style.borderColor="lightgrey";
}


/**
 * Function that opens the Wikipedia page when the user clicks on the flag link
 * @param url is the url of the corresponding Wikipedia page
 */
function openArticle(url){
    window.location = url;
}


//Utility used to get some parameters from the GET request
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};