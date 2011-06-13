setTimeout(function() {	
	// Send to bridge (to be stored)
	document.body.innerHTML += '<div id="bridge" style="display:none"></div>';
	var q = { "tabContent": document.body.innerHTML };
	
	document.getElementById("bridge").innerHTML = JSON.stringify(q);
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('store', true, true);
	$('body')[0].dispatchEvent(customEvent);
}, 250);
