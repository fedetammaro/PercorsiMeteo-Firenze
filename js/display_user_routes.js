var route_name = '';

$(document).ready(function(){
    //Dialog that will be shown to the user when he tries to delete a saved route
    $("#delete-dialog").dialog({
        dialogClass: 'ui-dialog-osx',
        modal: true,
        draggable: false,
        resizable: false,
        width: '80%',
        buttons: [
            {
                text: "OK",
                click: function() {
                    //AJAX call made to remove the route from the database
                    $.ajax({
                        type: "POST",
                        url: "https://percorsimeteo.altervista.org/php/update_route.php",
                        data: {
                            uid: localStorage.getItem('user_id'),
                            action: 'delete',
                            places: '',
                            route_name: route_name
                        },
                        success: function(){
                            location.reload(true);
                        }
                    });
                },
                class: "btn primary-btn confirm"
            },
            {
                text: "Cancel",
                click: function() {
                    $('#wrapper').show();
                    $(this).dialog("close");
                },
                class: "btn primary-btn cancel"
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
});

/**
 * Function that gets the selected point of the route and redirects to the route map
 * @param selected_points is a list of selected points to display on the map
 */
function goToRoute(selected_points){
    localStorage.setItem('displayRoutePoints', selected_points);
    window.location = "https://percorsimeteo.altervista.org/display_route.php?uid=" + localStorage.getItem('user_id');
}

/**
 * Function that opens the delete dialog when the user tries to delete a route
 * @param name is the name of the route the user is going to delete
 */
function deleteUserRoute(name){
    route_name = name;
    $("#delete-dialog")
        .text("Are you sure you want to delete this route?")
        .dialog("open");
}