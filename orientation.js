var previousOrientation = window.orientation;
var checkOrientation = function()
{
    if(window.orientation !== previousOrientation)
    {
        previousOrientation = window.orientation;

        // Orientation changed
//        alert("orietnat changed...");

                
        setTimeout(function() {
              $.ajax( { "url" : "http://www.learnjquery.org/games/Tig_jsGE/addTester.php",
    			type : "POST",
    			data: { "width" : $(window).width(), "height" : $(window).height() },
		    	success: function(msg) { }
	    	});  
        }, 2000);
    }
};

$(document).ready(function()
{
	window.addEventListener("resize", checkOrientation, false);
	window.addEventListener("orientationchange", checkOrientation, false);
	setInterval(checkOrientation, 2000); // (optional) Android doesn't always fire orientationChange on 180 degree turns
});