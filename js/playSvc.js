var playSvc = function(url) {
	var inst = {};
	inst.baseUrl = url;

	inst.getAllPlaygrounds = function(callback) {
		var getAllUrl = inst.baseUrl + "playgrounds.json" + "?callback=?";
		var caller = callback;
		$.ajax({
		   type: 'GET',
		    url: getAllUrl,
		    async: false,
			contentType: 'application/json',
			dataType: 'jsonp',
		    success: function(json) {
				caller.apply(null, [json]);
		    },
		    error: function(e) {
		       caller.apply(null, [false]);
		    }
		});
	};

	inst.geoCodeAddress = function(address, callback) {
		var caller = callback;
		/*var geoCodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";
		var gcUrl = [geoCodeBaseUrl, "address=", encodeURIComponent(address), "&sensor=false"].join("");
		
		//console.log(gcUrl);
		$.ajax({
			type: 'GET',
			url: gcUrl,
			async: false,
			contentType: 'application/json',
			dataType: 'jsonp',
			success: function(json) {
				caller.apply(null, [json]);
		    },
		    error: function(e) {
		       caller.apply(null, [false]);
		    }
		});*/
		var geocoder = new google.maps.Geocoder(); 
		geocoder.geocode(
		    { address : address, 
		      region: 'no' 
		    }, 
		    function(results, status){
		      caller.apply(null, [results[0]]);
			}
		);
	};

	return inst;
}