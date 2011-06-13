/*
 * Copyright (c) 2010 Joe Pestro
 */

String.prototype.emphasize = function(q) {
	var words = q.split(" ");
	var emphasized = this;
	for (var i = 0; i < words.length; i++) {
		var exp = new RegExp(words[i], "ig");
		emphasized = emphasized.replace(exp, "<em>$&</em>");
	}
	return emphasized;
}

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if(typeof (startpos) == "undefined") {
        startpos = this.length;
    } else if(startpos < 0) {
        startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
}

Suggest.addResults = function(name, results) {
	var source = locked[name];			

	$.each(results, function(index) {
		if (index >= Suggest.NUM_GOOGLE_RESULTS)
			return false;

		var link, img, homepage;
		if (this[2])
			link = this[2];
		else
			link = source["go"] + this[0].replace(/ /g, "+");

		homepage = source["root"];

		// <img src="' + img + '" width="16px" height="16px" title="' + name + '" style="position:relative;top:2px;"/>
		$("li.ozonebox span.a").prepend('<div><a href="' + link + '">' + this[0].emphasize(Suggest._query) + '</a> - <span class="gl"><a href="' + homepage + '">' + name + '</a> <span class="hpn">-</span> ' + this[1] + ' </span><br>' + link.emphasize(Suggest._query) + '<br></div>');
	});	
}

Suggest.loadPreferences = function() {
	$('body').prepend('<div id="bridge" style="display:none"></div>');

	// Get if enabled
	$("#bridge").text("google_enabled");
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('retrieve', true, true);
	$('body')[0].dispatchEvent(customEvent);

	// Get desired number of results
	$("#bridge").text("google_number");
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('retrieve', true, true);
	$('body')[0].dispatchEvent(customEvent);

	// Get enabled sources
	$("#bridge").text("google_enabled_sources");
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('retrieve', true, true);
	$('body')[0].dispatchEvent(customEvent);
}

Suggest.queryChanged = function(q) {
	if (!Suggest._googleEnabled)
		return;

	Suggest._query = q.replace(/\+/g, " ");
	$('.ozonebox').remove();
	$('#res ol:first').append('<li class="g ozonebox knavi"><h3 class="r"><a href="' + chrome.extension.getURL("web/index.html") + '#' + q + '">Ozone for <em>' + Suggest._query + '</em></a></h3> - <a href="' + chrome.extension.getURL("options.html") + '" class="flt">Settings</a><div style="height:5px"></div><span class="a"></span></li>');

	for (source in locked) {
		if ((source == "Dropbox" && q.length < 3) || !locked[source]["google"] || !locked[source]["enabled"])
			continue;

		if (locked[source]["post"] == true) 
			$("#bridge").text("POST " + locked[source]["url"] + q);	
		else 
			$("#bridge").text("GET " + locked[source]["url"] + q);	

		var customEvent = document.createEvent('Event');
		customEvent.initEvent('xhr', true, true);
		$('body')[0].dispatchEvent(customEvent);
	}
}

var l = null;
setInterval(function() {
	if (l != document.location.href) {		
		var start = document.location.href.regexLastIndexOf(/(\?|&)q=/) + 3;
		
		var q = document.location.href.substring(start);
		if (q.indexOf("&") != -1)
			q = q.substring(0, q.indexOf("&"));
		else if ((q.indexOf("#") != -1))
			q = q.substring(0, q.indexOf("#"));
			
		Suggest.queryChanged(q);
	}
	
	l = document.location.href;
}, 500);

setTimeout(Suggest.loadPreferences, 200);
setTimeout(Suggest.checkCookies, 250);
setTimeout(Suggest.checkTokens, 250);