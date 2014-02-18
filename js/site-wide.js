jQuery(document).ready(function($) {
	
    ///////////////////////////////////////////////////    
    //   full screen image background
    //////////////////////////////////////////////////
    
    //if (!(Modernizr.backgroundsize)) $.backstretch(templateURL + "/images/bg-fullscreen.png", {centeredY: false});
    
    
    ///////////////////////////////////////////////////    
    //   show header and footer when DOM is ready (avoid FOUC)
    //////////////////////////////////////////////////
    //$("div#header-wrap, div#content-wrap").show();
    
    ///////////////////////////////////////////////////    
    //   fade in content after images have loaded
    //////////////////////////////////////////////////
    $("div#content-main-fade-in").waitForImages({
        finished: function() {
            if (Modernizr.opacity) $(this).animate({opacity:1},600);
            else $(this).css({visibility:'visible'});
        },
        waitForAll: true
    });
    
    
    ///////////////////////////////////////////////////    
    //   fadein/out sub menu on hover
    //////////////////////////////////////////////////   
    $("#menu-top li").hover(
            function (e) {
            e.preventDefault();
            if (Modernizr.opacity) $(this).find('ul').fadeIn(400);
            else $(this).find('ul').show();
        },
        function (e) {
            e.preventDefault();
            if (Modernizr.opacity) $(this).find('ul').fadeOut(400);
            else $(this).find('ul').hide();
        }
    );
        
    
    ///////////////////////////////////////////////////    
    //   enable css3 transitions
    //////////////////////////////////////////////////
    /* class delay-transitions is set in functions.php */
    $("body").removeClass("delay-transitions");
        
});
