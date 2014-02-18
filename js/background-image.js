jQuery(document).ready(function($){
	
(function() {

var win = $(window);

win.resize(function() {
    
    var win_w = win.width(),
        win_h = win.height(),
        $bg    = $("#background-image");

    // Load narrowest background image based on 
    // viewport width, but never load anything narrower 
    // that what's already loaded if anything.
    var available = [
      480, 1024, 1680
    ];

    var current = $bg.attr('src').match(/([0-9]+)/) ? RegExp.$1 : null;
    
    if (!current || ((current < win_w) && (current < available[available.length - 1]))) {
      
      var chosen = available[available.length - 1];
      
      for (var i=0; i<available.length; i++) {
        if (available[i] >= win_w) {
          chosen = available[i];
          break;
        }
      }
      
      // Set the new image
      $bg.attr('src', templateURL + '/images/' + chosen + '.png');
      
      // for testing...
      // console.log('Chosen background: ' + chosen);
      //alert (chosen);
    }

    // Determine whether width or height should be 100%
    if ((win_w / win_h) < ($bg.width() / $bg.height())) {
      $bg.css({height: '100%', width: 'auto'});
    } else {
      $bg.css({width: '100%', height: 'auto'});
    }
    
  }).resize();
  
})(jQuery);

});