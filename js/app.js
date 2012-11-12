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

	inst.lastCircle = null;
	inst.addressCenterPoint = null;
	inst.markers = [];

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
		
		$("#showAllBtn").click(
			function() {
				showAllPlaygrounds();
			}
		);

		$("#addressSearchBtn").click(
			function() {
				searchByAddress();
			}
		);

		$("#app_listview").hide();
		$("#app_pager").hide();
	};

	var showAllPlaygrounds = function() {
		clearCircle();
		clearMarkers();
		clearListView();
		inst.svc.getAllPlaygrounds(function(data) { renderPlaygrounds(data); zoomToMarkerBounds();});
	};

	var searchByAddress = function() {
		clearCircle();
		clearMarkers();
		clearListView();
		var address = $('#inputAddress').val();
		inst.svc.geoCodeAddress(address, function(data) { renderAddressSearch(data); });
	}

	var renderAddressSearch = function(results) {
		var pt = new google.maps.LatLng(results.geometry.location.lat(), results.geometry.location.lng());
		var name = results.formatted_address;
		inst.addressCenterPoint = new google.maps.Marker({
		            position: pt,
		            map: inst.map,
		            title: name,
		            //icon: image
		        });
		inst.map.setCenter(pt);

		var dist = parseInt($('#inputDistance').val(), 10);
		//console.log(dist);
		var circleOptions = {
	      strokeColor: "#ff0000",
	      strokeOpacity: 0.7,
	      strokeWeight: 1,
	      fillColor: "#00ff21",
	      fillOpacity: 0.1,
	      map: inst.map,
	      center: pt,
	      radius: dist * 1609.344
	    };

	    inst.lastCircle = new google.maps.Circle(circleOptions);
	    inst.svc.getAllPlaygrounds(renderPlaygrounds);
	}

	var clearMarkers = function() {
	  for (var i = 0; i < inst.markers.length; i++ ) {
	    inst.markers[i].setMap(null);
	  }
	};

	var clearCircle = function() {
		if (inst.lastCircle) {
		  	inst.lastCircle.setMap(null);
		  	inst.lastCircle = null;
		}
		if (inst.addressCenterPoint) {
			inst.addressCenterPoint.setMap(null);
			inst.addressCenterPoint = null;
		}
	};

	var clearListView = function() {
		$('#listTbl').html("");
		$('#app_pager').hide();
	}

	var renderPlaygrounds = function(playData) {
		if (playData) {
			var filteredList = [];
			for (var i = 0; i < playData.length; i++) {
				var playObj = playData[i];
				//console.log(playObj);

				var image = new google.maps.MarkerImage('./img/playground_marker.png',
						new google.maps.Size(32, 37), //icon size
					    new google.maps.Point(0,0), //origin
					    new google.maps.Point(16, 37) //offset
					);
				var pt = new google.maps.LatLng(playObj.lat, playObj.long);
				
				var addMarker = function() {
					var marker = new google.maps.Marker({
			            position: pt,
			            map: inst.map,
			            title: playObj.name,
			            icon: image
			        });
			        inst.markers.push(marker);
			        filteredList.push(playObj);
				}

				if (inst.lastCircle) {
					if (inst.lastCircle.contains(pt)) {
						addMarker();
					}
				}
				else {
					addMarker();
				}
			}
			renderListView(filteredList);
		}
	};

	var zoomToMarkerBounds = function() {
		var bounds = new google.maps.LatLngBounds();
		var extent = [];
		for (var i = 0; i < inst.markers.length; i++ ) {
	    	//console.log(inst.markers[i]);
	    	//extent.push(inst.markers[i].position.Ya, inst.markers[i].position.Za);
	    	bounds.extend(inst.markers[i].position);
	    }
	    
	    inst.map.fitBounds(bounds);
	};

	var renderListView = function(list) {
		if (list.length > 0) 
		{
			$("#app_listview").show();
			$("#app_pager").show();
			for (var i = 0; i < list.length; i++) {
				var listItem = list[i];
				var builder = [];
				builder.push("<tr>");
				builder.push("	<td class='listViewRow'>");
				builder.push("		<strong>" + listItem.name + "</strong>");
				builder.push("		<i class='icon-info-sign right'></i>");
				builder.push("  </td>");
				builder.push("</tr>");
				$('#listTbl').append(builder.join(""));
			}

			inst.rightSizeListView();
		} 
	};

	inst.rightSizeListView = function() {
		var h = $(window).height();
		$("#app_listview").css("height",  h - 350 + "px");
	};

	return inst;
};






