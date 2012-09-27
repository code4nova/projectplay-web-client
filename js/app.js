var playApp = function() 
{  
	var inst = {};
	var config = {
		title: "Alexandria Plays",
		startLatLon: [38.818860, -77.091497],
		startZoom: 13,
	    logo: "./img/aplays.png",
	    playUrl: "http://0.0.0.0:3000/"
	};

	inst.initialize = function() {
		var mapCenter = new google.maps.LatLng(config.startLatLon[0], config.startLatLon[1]);
		var zoomLvl = config.startZoom;

		var mapOptions = {
		  zoom: zoomLvl,
		  center: mapCenter,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		inst.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

		//init branding stuff from app.config
		if (config.logo) {
			$('#header_img').attr('src', config.logo);
		}
		
		if (config.title) {
			document.title = config.title;
		}

		initSidebar();
		inst.svc = playSvc(config.playUrl);
	};

	var initSidebar = function() {
		//TODO: lolololol spaces, need to find a non hack way to get the button to look right
		$("#app_panel").append("<a id='showAllBtn' class='app_panel_button' href='#'>Show all playgrounds...</a>").button().click(
			function() {
				showAllPlaygrounds();
			}
		);
	};

	var showAllPlaygrounds = function() {
		inst.svc.getAllPlaygrounds(renderPlaygrounds);
	};

	var renderPlaygrounds = function(playData) {
		if (playData) {
			for (var i = 0; i < playData.length; i++) {
				var playObj = playData[i];
				console.log(playObj);

				var pt = new google.maps.LatLng(playObj.lat, playObj.long);
				var marker = new google.maps.Marker({
		            position: pt,
		            map: inst.map,
		            title: playObj.name
		        });
			}
		}
	};

	return inst;
};


