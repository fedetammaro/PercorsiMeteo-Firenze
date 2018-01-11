var slider = document.getElementById("my_range");
var output = document.getElementById("slide_value");
output.innerHTML = slider.value; // Display the default slider value
var slider_prevalue;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function(){
    output.innerHTML = this.value;
};

$("#my_range").on('mousedown touchstart', function(event) {
    slider_prevalue = slider.value;
});

$("#my_range").on('mouseup touchend', function(event) {
    if(slider_prevalue !== slider.value){
        if(selected_points.length > 0){
            using_old_settings = true;
        }

        if(get_nearby_points){
            activateGPS();
        }else{
            searchCheck(false);
        }

        $("#generic-dialog")
            .dialog('option', 'title', 'Radius changed')
            .text("Search radius has been changed!")
            .dialog("open");
    }
});
