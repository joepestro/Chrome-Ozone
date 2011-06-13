/* Suggest class does most of the heavy lifting */

window.Suggest = {
	// change UI layout
	NUM_RESULTS: 8,
	NUM_PER_ROW: 5,
	
	// google UI
	NUM_GOOGLE_RESULTS: 3,
	
	// local vars
	_googleEnabled: false,
	_query: null,
	_selectedGroup: 0,
	_selectedIndex: -1,
	_facebookUID: null,
	_omni: [],

	init: function() {
		// loop for each source
		for (source in public) {
			if (!public[source].enabled)
				continue;
			
			$("body").append('<div class="results"><div class="results-separator">Suggestions from ' + source + '</div><ul id="' + source.toLowerCase().replace(/ /g, "") + '"></ul></div');
			$("#sources").append('<img src="' + Suggest.getIcon(public[source]["root"]) + '" width="16px" height="16px" title="' + source + '" />')
		}
		$("#sources").append('<span class="wall">&nbsp;</span>');
		for (source in locked) {
			if (!locked[source].enabled)
				continue;
			
			$("body").append('<div class="results disabled"><div class="results-separator">Suggestions from ' + source + '</div><div class="promo"><a href="https://chrome.google.com/extensions/detail/peeefgkjcjfpjdmpklpfaompngmbknje">Unlock ' + source + '</a></div><ul id="' + source.toLowerCase().replace(/ /g, "") + '"></ul></div');
			$("#sources").append('<img class="disabled" src="' + Suggest.getIcon(locked[source]["root"]) + '" width="16px" height="16px" title="' + source + '" />')
		}
		for (source in preload) {
			if (!preload[source].enabled)
				continue;
			
			$("body").append('<div class="results disabled"><div class="results-separator">Suggestions from ' + source + '</div><div class="promo"><a href="https://chrome.google.com/extensions/detail/peeefgkjcjfpjdmpklpfaompngmbknje">Unlock ' + source + '</a></div><ul id="' + source.toLowerCase().replace(/ /g, "") + '"></ul></div');
			$("#sources").append('<img class="disabled" src="' + Suggest.getIcon(preload[source]["root"]) + '" width="16px" height="16px" title="' + source + '" />')
		}
	},

	getIcon: function(url) {
		if (url.indexOf("http://") != -1)
			return "chrome://favicon/" + url;
		else
			return url;
	},

	loadPreferences: function() {
		// Get enabled sources
		$("#bridge").text("ozone_enabled_sources");
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('retrieve', true, true);
		$('body')[0].dispatchEvent(customEvent);
	},

	queryChanged: function(q) {
		if (q.length == 0) {
			Suggest.hideHUD();
			return;
		}
	
		$("li").remove();
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
	
		// Show results
		Suggest.showHUD();
	},

	preload: function() {
		if (parseInt($("#sources_count").text()) < Object.size(public) + Object.size(preload))
			return;
	
		// Preload data from desired sources
		for (source in preload) {
			if (preload[source]["url"].length == 0)
				continue;
				
			if (preload[source]["post"] == true) 
				$("#bridge").text("POST " + preload[source]["url"]);	
			else 
				$("#bridge").text("GET " + preload[source]["url"]);	
					
			var customEvent = document.createEvent('Event');
			customEvent.initEvent('xhr', true, true);
			$('body')[0].dispatchEvent(customEvent);		
		}
	},

	checkCookies: function() {
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('cookies', true, true);
		$('body')[0].dispatchEvent(customEvent);
	},

	checkTokens: function() {
		// Dropbox
		$("#bridge").text("dropbox_token");
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('retrieve', true, true);
		$('body')[0].dispatchEvent(customEvent);
	
		// Google Docs
		$("#bridge").text("googledocs_token");
		var customEvent = document.createEvent('Event');
		customEvent.initEvent('retrieve', true, true);
		$('body')[0].dispatchEvent(customEvent);
	},

	restoreQuery: function() {
		var q = document.location.hash.substring(1);
		q = q.replace(/\+/g, " ");
	
		$("#q").val(q);
		$("#q").focus();
		Suggest.queryChanged(q);
	},

	addResults: function(name, results) {
		var allSources = {};
		allSources = $.extend(allSources, public);
		allSources = $.extend(allSources, locked);
		allSources = $.extend(allSources, preload);
		
		var source = allSources[name];			
		var sourceId = "#" + name.toLowerCase().replace(/ /g, "");	
	
		if (source["signin"]) {
			$(sourceId).append('<li class="empty"><a class="underline" href="' + source["signin"] + '">Sign in to ' + name + '</a></li>');
		} else if (results.length == 0) {
			$(sourceId).append('<li class="empty">No results from ' + name + '</li>');
		} else {
			$.each(results, function(index) {
				if (index >= Suggest.NUM_RESULTS)
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
			
				var result = '<a href="' + link + '"><img src="' + img + '" width="16px" height="16px" /> ' + this[0] + " <small>" + this[1] + "</small></a>";
				$(sourceId).append('<li class="result">' + result + "</li>");	
			});
		}
	},

	highlightResult: function(group, index) {
		$("#q").blur();
		$(".result").removeClass("highlighted");
		$(".results:eq(" + group.toString() + ") .result:eq(" + index.toString() + ")").addClass("highlighted");
		// $(this).addClass("highlighted");
	},

	selectResult: function(group, index) {
		document.location.hash = $("#q").val();
		document.location = $(".results:eq(" + group.toString() + ") .result:eq(" + index.toString() + ") a").attr("href");
	},

	showHUD: function() {
		$(".results").show();
		$("#welcome").hide();
		$("#prompt").show();
		$("center").css("margin-top", 20);
	},

	hideHUD: function() {
		$(".results").hide();
		$("#welcome").show();
		$("#prompt").hide();
		$("center").css("margin-top", 200);
	},

	updatePosition: function() {
		$("#bottom").css({ top: $("#q").position().top + $("#q").height() + 8, left: $("#q").position().left + 2, width: $("#q").width() + 4 });
	}
}

/* Helper for size */

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};