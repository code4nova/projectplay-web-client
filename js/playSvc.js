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

	return inst;
}