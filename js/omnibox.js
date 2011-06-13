String.prototype.emphasize = function(q) {
	var words = q.split(" ");
	var emphasized = this;
	for (var i = 0; i < words.length; i++) {
		var exp = new RegExp(words[i], "ig");
		emphasized = emphasized.replace(exp, "<match>$&</match>");
	}
	return emphasized;
}

Suggest.addToQueue = function(c, d) {
	Suggest._omni.push({content: c, description: d});
		
	if (Suggest._omni.length >= 5) {
		Suggest.addToOmnibox(Suggest._omni);
		Suggest._omni = [];
	}
		
	console.log(Suggest._omni);
}

Suggest.addResults = function(name, results) {
	var allSources = {};
	allSources = $.extend(allSources, public);
	allSources = $.extend(allSources, locked);
	allSources = $.extend(allSources, preload);
	
	var source = allSources[name];			
	var sourceId = "#" + name.toLowerCase().replace(/ /g, "");	

	if (source["signin"]) {
		return false;
	} else if (results.length == 0) {
		return false;
	} else {
		$.each(results, function(index) {
			if (index >= 1)
				return false;
		
			var link, img;
			if (this[2])
				link = this[2];
			else
				link = source["go"] + this[0].replace(/ /g, "+");
			
			if (this[3])
				img = this[3]
			else
				img = Suggest.getIcon(source["root"]);
		
			// 'url' (for a literal URL), 
			// 'match' (for highlighting text that matched what the user's query)
			// 'dim' (for dim helper text). The styles can be nested, eg. dimmed match.
			
			var description = this[0].emphasize(Suggest._query) + " - <dim>" + this[1] + "</dim>";
			Suggest.addToQueue(link, description);
		});
	}
}

Suggest.loadPreferences = function() {
	$('body').prepend('<div id="bridge" style="display:none"></div>');

	// Get enabled sources
	$("#bridge").text("google_enabled_sources");
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('retrieve', true, true);
	$('body')[0].dispatchEvent(customEvent);
}

Suggest.queryChanged = function(q) {	
	if (q.length == 0) {
		return;
	} else {
		Suggest._query = q;
	}

	bookmarks();
	history();
	tabs();
	
	facebook(); // requires token
	googledocs(); // requires token
	dropbox(); // requires token
	evernote();

	// Search public sources
	for (source in public) {
		if (public[source]["url"].length == 0 || !public[source]["enabled"])
			continue;
	
		$.getScript(public[source]["url"] + q);
	}	

	// Search locked (extension only) sources
	for (source in locked) {	
		if (locked[source]["url"].length == 0 || !locked[source]["enabled"])
			continue;
		if (source == "Dropbox" && q.length < 3)
			continue;
			
		if (locked[source]["post"] == true) 
			$("#bridge").text("POST " + locked[source]["url"] + q);	
		else 
			$("#bridge").text("GET " + locked[source]["url"] + q);	
				
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('xhr', true, true);
		$('body')[0].dispatchEvent(customEvent);
	}

	// Search preloaded (extension only) sources
	for (source in preload) {
		if (preload[source]["url"].length == 0 || !preload[source]["enabled"])
			continue;
		
		eval(source.toLowerCase().replace(/ /g, "") + "()");
	}

	// Search bookmarks
	$("#bridge").text(q);
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('bookmarks', true, true);
	$('body')[0].dispatchEvent(customEvent);

	// Search browser history	
	$("#bridge").text(q);
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('history', true, true);
	$('body')[0].dispatchEvent(customEvent);

	// Search open tabs
	$("#bridge").text(q);
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('tabs', true, true);
	$('body')[0].dispatchEvent(customEvent);
}

setTimeout(Suggest.loadPreferences, 200);
setTimeout(Suggest.checkCookies, 250);
setTimeout(Suggest.checkTokens, 250);