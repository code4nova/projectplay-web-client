var $ = jQuery;
var app;
$(document).ready(function() {
    app = playApp();
    app.initialize();
    $(window).resize(app.rightSizeListView);
});

var year = new Date().getFullYear();
$("#copyright span").text(year);
