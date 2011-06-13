// omnibox input started
chrome.omnibox.onInputStarted.addListener(function() {	
	chrome.omnibox.setDefaultSuggestion({description: "Search Ozone for %s"});
	
	$.getScript("web/js/sources.js");
	$.getScript("web/js/parse.js");
	$.getScript("web/js/suggest.js");
	$.getScript("web/js/callbacks.js");
	$.getScript("js/omnibox.js");	
});

// omnibox input changed
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {	
	Suggest.addToOmnibox = suggest;
	Suggest.queryChanged(text);
});

// omnibox item selected
chrome.omnibox.onInputEntered.addListener(function(text) {
	var indexURL;
	if (text.indexOf("http://") != -1)
		indexURL = text;
	else
	 	indexURL = chrome.extension.getURL("web/index.html") + "#" + text.replace(/ /g, "+");
    
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.update(tab.id, {"url": indexURL});
	});
});

// browser action clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    var indexURL = chrome.extension.getURL("web/index.html");
    
	chrome.tabs.create({"url": indexURL}, function(tab) {
		// opened
	});
});

// background page request
chrome.extension.onRequest.addListener(function(request, sender, callback) {
	if (request.action.indexOf("COOKIES") == 0) {
		chrome.cookies.getAll({}, callback);
	} else if (request.action.indexOf("BOOKMARKS") == 0) {
		var query = request.action.substring(10);
		chrome.bookmarks.search(query, callback);
	} else if (request.action.indexOf("HISTORY") == 0) {
		var query = request.action.substring(8);
		chrome.history.search({"text": query, "maxResults": 8}, callback);
	} else if (request.action.indexOf("TABS") == 0) {
		chrome.tabs.getAllInWindow(null, function(tabs) {
		    for (var i = 0; i < tabs.length; i++) {
		        localStorage["tabId"] = tabs[i].id;
		        chrome.tabs.executeScript(tabs[i].id, { file: "tab.js" }, callback);
		    }
		});
	} else if (request.action.indexOf("STORE") == 0) {
	    var query = request.action.substring(6);
	    var json = $.parseJSON(query);
	    for (var key in json) {
            if (json.hasOwnProperty(key)) {
                localStorage[key] = json[key];
            }
        }
    } else if (request.action.indexOf("RETRIEVE") == 0) {
        var query = request.action.substring(9);
        var json = {};
        json[query] = localStorage[query];
        
        callback(json);
	} else if (request.action.indexOf("BADGE") == 0) {
		var query = request.action.substring(6);
		chrome.browserAction.setBadgeText({text: query});
	} else {
		var tokens = request.action.split(" ");
		var postData = null;
		
		if (tokens[0].toUpperCase() == "POST") {
			postData = tokens[1].substring(tokens[1].indexOf("?")+1);
			tokens[1] = tokens[1].substring(0, tokens[1].indexOf("?"));
		}
																		
		$.ajax({
			type: tokens[0],
		  	url: tokens[1],
		  	cache: true,
			data: postData,
			dataType: "text",
		  	success: callback,
			failure: function(XMLHttpRequest, textStatus, errorThrown) {
				alert(textStatus);
			}
		});				
	}
});

