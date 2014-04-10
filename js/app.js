var playApp = function() 
{  
	var inst = {};
	var config = {
		title: "Alexandria Plays",
		startLatLon: [38.818860, -77.091497],
		startZoom: 13,
	    logo: "./img/aplays.png",
	    playUrl: "http://api.alexandriaplays.org/"
	};

	inst.lastCircle = null;
	inst.addressCenterPoint = null;
	inst.markers = [];
	inst.lastSearchResults = [];
	inst.mapToolTip = null;
	inst.filters = {};

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

        $(app_listview).click(clickPgList);

        initSidebar();
        inst.svc = playSvc(config.playUrl);

		inst.mapToolTip = new google.maps.InfoWindow();

        inst.filters = {
              drinkingw: 0,
            restrooms: 0,
            seating: 0,
            shade: 0,
            age: '',
            address: '',
            range: ''
        };
	};

	var clickPgList = function(e) {
		var target = e.target;

		var limit = 5;
		targetid = $(target).closest('.listViewRow').attr("id");

		renderDetailModal(targetid);
	};

	var initSidebar = function() {
		$("#showAllBtn").click(
            function() {
                showAllPlaygrounds();
            }
        );

		$("#searchBtn").click(
			function() {
				if ($(inputAddress).val()) {
					searchByAddress();
				}
				else {
					showAllPlaygrounds();
				}
			}
		);



		$("#results_panel").hide();

		$("#returnBtn").click(
			function() {
				clearAll();
				$("#results_panel").hide();
				//$("#app_listview").hide();
				$("#filter_panel").show();
			}
		);

		//$("#app_pager").hide();*/
        //$("#app_listview").hide();
        $('#returnBtn').hide();
	};

	var clearAll = function() {
		clearCircle();
		clearMarkers();
		clearListView();
		inst.lastSearchResults = [];	
	};

	var showAllPlaygrounds = function() {
		clearAll();
		inst.svc.getAllPlaygrounds(function(data) { renderPlaygrounds(data); zoomToMarkerBounds();});
	};

	var searchByAddress = function() {
		clearAll();
        getFilters();
		var address = $('#inputAddress').val();
		inst.svc.geoCodeAddress(address, function(data) { renderAddressSearch(data); });
	};

    var getFilters = function() {

        var filtRestroomVal = $("input:radio[name='filtRestroom']:checked").val();

        var filtDrinkingWVal = $("input:radio[name='filtDrinkingW']:checked").val();

        var filtSeatingVal = $("input:radio[name='filtSeating']:checked").val();

        var filtShadeVal = $("input:radio[name='filtShade']:checked").val();

        var filtAgeVal = $("input:radio[name='filtAge']:checked").val();

        inst.filters.restrooms = (filtRestroomVal == "yes") ? 2 : 0;
        inst.filters.drinkingw = (filtRestroomVal == "yes") ? 2: 0;
        inst.filters.seating = (filtSeatingVal == "yes") ? 2 : 0;
        inst.filters.shade = (filtShadeVal == "yes") ? 2 : 0;
        inst.filters.age = (function() {
            if (filtAgeVal == "twotofive") {
                return "2-5"
            }
            else if (filtAgeVal == "fiveto12") {
                return "5-12"
            }
            else {
                return ""
            }
        })();
    };

	var searchByAddressWithPlacesApi = function() {
		clearAll();
		var address = $('#inputAddress').val();
		var dist = parseInt($('#inputDistance').val(), 10);
		inst.svc.PlacesApiSearch(address, dist, function(data) { renderAddressApiSearch(data); });
		inst.svc.geoCodeAddress(address, function(data) { renderSearchCircle(data); });
	};

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
	};

	var renderSearchCircle = function(results) {
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
	};

	var renderAddressApiSearch = function(results) {
		renderMarkers(results);
		renderListView(results);
		inst.lastSearchResults = results;
	    //inst.svc.getAllPlaygrounds(renderPlaygrounds);
	};

	var clearMarkers = function() {
	  for (var i = 0; i < inst.markers.length; i++ ) {
	    inst.markers[i].setMap(null);
	  }
      if (inst.lastSearchLayer) {
          inst.lastSearchLayer.clearLayers();
      }
      inst.markers = [];
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
		//$('#listTbl').html("");
		//$('#app_pager').hide();
        $('#returnBtn').hide();
	};

	var renderPlaygrounds = function(playData) {
		if (playData) {
			var filteredList = [];
			for (var i = 0; i < playData.length; i++) {
				var playObj = playData[i];
				//console.log(playObj);

				var f = {
					location: false,
					restrooms: false,
					drinkingw: false,
					seating: false,
					shade: false,
					agelevel: false
				};

				var pt = new google.maps.LatLng(playObj.lat, playObj.long);
				if (inst.lastCircle) {
					if (inst.lastCircle.contains(pt)) {
						filteredList.push(playObj);
						f.location = true;
					}
				}
				else {
					filteredList.push(playObj);
					f.location = true;
				}

                if (inst.filters.restrooms) {
					if (playObj.restrooms >= inst.filters.restrooms) {
						f.restrooms = true;
					}
				}
				else {
					f.restrooms = true;
				}

				if (inst.filters.drinkingw) {
					if (playObj.drinkingw >= inst.filters.drinkingw) {
						f.drinkingw = true;
					}
				}
				else {
					f.drinkingw = true;
				}

				if (inst.filters.seating) {
					if (playObj.seating >= inst.filters.seating) {
						f.seating = true;
					}
				}
				else {
					f.seating = true;
				}

				if (inst.filters.shade) {
					if (playObj.shade >= inst.filters.shade) {
						f.shade = true;
					}
				}
				else {
					f.shade = true;
				}

				if (inst.filters.age) {
					if (playObj.agelevel.search(inst.filters.age) > -1) {
						f.agelevel = true;
					}
				}
				else {
					f.agelevel = true;
				}

				if (f.location && f.restrooms && f.drinkingw && f.seating && f.shade && f.agelevel) {
					filteredList.push(playObj);
				}
			}

			inst.lastSearchResults = filteredList;
			renderMarkers(filteredList);
			renderListView(filteredList);
		}
	};

	inst.clickPgMarker = function(id) {
		renderDetailModal(id);
	};

	var renderDetailModal = function(id) {
		for (var i = 0; i < inst.lastSearchResults.length; i++) {
			var result = inst.lastSearchResults[i];

			if (id == result.id) {

				//title
				$('#detail_title').empty();
				$('#detail_title').append(result.name);

				//age level
				$('#detail_agelevel_text').empty();
				$('#detail_agelevel_text').append(result.agelevel);

				//restrooms
				$('#detail_restrooms').empty();
				if (result.restrooms == 1) {
					$('#detail_restrooms').append('None.');
				} 
				else if (result.restrooms == 2) {
					$('#detail_restrooms').append('Inadequate.');
				}
				else if (result.restrooms == 3) {
					$('#detail_restrooms').append('Plenty.');
				}

				//drinking fountain
				$('#detail_drinkingfountain').empty();
				if (result.drinkingw == 1) {
					$('#detail_drinkingfountain').append('None.');
				}
				else if (result.drinkingw == 2) {
					$('#detail_drinkingfountain').append('Limited.');
				}
				else if (result.drinkingw == 3) {
					$('#detail_drinkingfountain').append('As much as you want.');
				}

				//seating
				$('#detail_seating').empty();
				if (result.seating == 1) {
					$('#detail_seating').append('Little to no seating.');
				}
				else if (result.seating == 2) {
					$('#detail_seating').append('Inadequate.');
				}
				else if (result.seating == 3) {
					$('#detail_seating').append('Adequate.');
				}

				//comments
				$('#detail_comments_text').empty();
				$('#detail_comments_text').append(result.generalcomments);

			}
		}

		$('#app_detail_modal').modal({overlayClose: true, closeClass: "close" });

	};

	var zoomToMarkerBounds = function() {
		var bounds = new google.maps.LatLngBounds();
		var extent = [];
		for (var i = 0; i < inst.markers.length; i++ ) {
	    	bounds.extend(inst.markers[i].position);
	    }
	    
	    inst.map.fitBounds(bounds);
	};

	var renderMarkers = function(list) {
        for (var i = 0; i < list.length; i++) {
			var playObj = list[i];

			var image = new google.maps.MarkerImage('./img/playspace_icon.png',
						new google.maps.Size(32, 37), //icon size
					    new google.maps.Point(0,0), //origin
					    new google.maps.Point(16, 37) //offset
					);
			var pt = new google.maps.LatLng(playObj.lat, playObj.long);
			
			var addMarker = function() {
				var marker = new google.maps.Marker({
		            id: playObj.id,
		            position: pt,
		            map: inst.map,
		            name: playObj.name,
		            icon: image
		        });
		        //marker.set("id", playObj.id);
		        inst.markers.push(marker);
		        
		        google.maps.event.addListener(marker, 'click', 
		        		function (e) {
		        			inst.clickPgMarker(marker.id);
		        		}
		        );

		        google.maps.event.addListener(marker, "mouseover", function(event) {
                	//this.setIcon('./img/playspace_icon.png');
                	$('#' + this.id).css('background-color', '#aedd52');

                	inst.mapToolTip.setContent('<p><strong>' + this.name + '</strong></p>');
                	inst.mapToolTip.open(inst.map, this);
                });

                google.maps.event.addListener(marker, "mouseout", function(event) {
                	//this.setIcon('./img/playspace_icon.png');
                	$('#' + this.id).css('background-color', '');
                	inst.mapToolTip.close();
                });
			}

			addMarker();
		}
	};

	var renderListView = function(list) {
		if (list.length > 0) 
		{
			$("#filter_panel").hide();
			$("#results_panel").show();
			$("#app_listview").show();
            $("#returnBtn").show();
			//$("#app_pager").show();
			for (var i = 0; i < list.length; i++) {
				var listItem = list[i];
				var builder = [];
				builder.push("<div ");
				builder.push(" id='");
				builder.push(listItem.id);
				builder.push("' ");
                var classes = (i % 2 != 0) ? "listViewRow" : "listViewRow oddRow"
                builder.push(" class='" + classes + "'>");
                builder.push("		<strong>" + listItem.name + "</strong>");
				builder.push("		<i class='icon-info-sign right'></i>");
				builder.push("</div>");
                $("#app_listview").append(builder.join(""));
			}

			inst.rightSizeListView();
			$('.listViewRow').hover(
				function() {
					$(this).css('background-color', '#aedd52');
					for (var i = 0; i < inst.markers.length; i++) {
						var m = inst.markers[i];
						if (m.id == this.id) {
							//m.setIcon('./img/playground_marker_green.png');
							inst.mapToolTip.setContent('<p><strong>' + m.name + '</strong></p>');
                			inst.mapToolTip.open(inst.map, m);
						}
					}
				},
				function() {
					$(this).css('background-color', '');
					for (var i = 0; i < inst.markers.length; i++) {
						var m = inst.markers[i];
						if (m.id == this.id) {
							//m.setIcon('./img/playground_marker.png');
							inst.mapToolTip.close();
						}
					}
				}
			);
		} 
	};

	inst.rightSizeListView = function() {
		//var h = $(window).height();
		//$("#app_listview").css("height",  h - 130 + "px");
	};

	return inst;
};






