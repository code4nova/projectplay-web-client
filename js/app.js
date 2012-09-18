var playApp = function() 
{  
	var inst = {};
	self.config = {
		title: "Alexandria Plays",
		startLatLon: [38.818860, -77.091497],
		startZoom: 14,
	    logo: "./img/aplays.png",
	    playUrl: "http://0.0.0.0:3000/"
	};

	inst.initialize = function() {
		var mapCenter = new google.maps.LatLng(self.config.startLatLon[0], self.config.startLatLon[1]);
		var zoomLvl = self.config.startZoom;

		var map;
		var mapOptions = {
		  zoom: zoomLvl,
		  center: mapCenter,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		//init branding stuff from app.config
		if (self.config.logo) {
			$('#header_img').attr('src', self.config.logo);
		}
		
		if (self.config.title) {
			document.title = self.config.title;
		}

		initSidebar();
	};

	var initSidebar = function() {
		//TODO: lolololol spaces, need to find a non hack way to get the button to look right
		$("#app_panel").append("<a id='showAllBtn' class='app_panel_button' href='#'>Show all playgrounds...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>").button().click(
			function() {
				showAllPlaygrounds();
			}
		);
	};

	var showAllPlaygrounds = function() {
		alert("boo");
	};

	return inst;
};


