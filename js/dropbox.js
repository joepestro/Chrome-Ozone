setTimeout(function() {
	// Parse token from <head>
	var scripts = $("head script");
	$.each(scripts, function() {
		var s = $(this).text().replace(/\n|;|var /g, "");
		if (s.indexOf("TOKEN:") != -1)
			eval(s);
	});
		
	// Send to bridge (to be stored)
	$('body').prepend('<div id="bridge" style="display:none"></div>');
	var q = { "dropbox_token": Constants["TOKEN"] };
	$("#bridge").text(JSON.stringify(q));
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('store', true, true);
	$('body')[0].dispatchEvent(customEvent);
}, 250);
