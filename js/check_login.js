$(document).ready(function(){
    //We create the login warning dialog for later usage.
    $("#login-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "OK",
                click: function() { //If the user clicks ok, he will be redirected to the login page.
                    redirectLogin();
                },
                class: "btn primary-btn confirm"
            }
        ],
        autoOpen: false,
        closeOnEscape: false,
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            $('.ui-widget-overlay').addClass('custom-overlay');
            $('#wrapper').hide();
        }
    });

    /*We check if the user has correctly logged in both checking the localStorage user_id value and if that ID is
      valid or not, double checking in the database. */
    if(localStorage.getItem('user_id') === null){
        $("#login-dialog")
            .text("Please login before using this app!")
            .dialog("open");
    }else{
        $.ajax({
            type: "POST",
            url: "https://percorsimeteo.altervista.org/php/retrieve_users.php",
            data: {id: localStorage.getItem('user_id')},
            success: function(response){
                if(response == "not_found"){
                    $("#login-dialog")
                        .text("Please login before using this app!")
                        .dialog("open");
                    localStorage.removeItem('user_id');
                    redirectLogin();
                }
            }
        });
    }
});