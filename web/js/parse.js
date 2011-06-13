/* Callback handlers for autocomplete services */

// Google
function google(results) {	
	var suggestions = [];
	for (var i = 0; i < results[1].length; i++)
		suggestions.push([results[1][i][0], "google.com"]);
	
	Suggest.addResults("Google", suggestions);
};

// YouTube
function youtube(results) {
	var suggestions = [];
	for (var i = 0; i < results[1].length; i++)
		suggestions.push([results[1][i][0], "youtube.com"]);
	
	Suggest.addResults("YouTube", suggestions);
}

// Netflix
function netflix(results) {	
	var suggestions = [];
	for (var i = 0; i < results.movies.length; i++)
		suggestions.push([results.movies[i].title, "netflix.com"]);
	
	Suggest.addResults("Netflix", suggestions);
}

// Wikipedia
function wikipedia(results) {
	var suggestions = [];
	for (var i = 0; i < results[1].length; i++)
		suggestions.push([results[1][i], "wikipedia.com"]);
		
	Suggest.addResults("Wikipedia", suggestions);
}

// Amazon
var completion; // doesn't support jsonp fully, so this is needed
function amazon() {
	var results = completion;
	
	var suggestions = [];
	for (var i = 0; i < results[1].length; i++)
		suggestions.push([results[1][i], "amazon.com"]);
		
	Suggest.addResults("Amazon", suggestions);
}

// Buy.com
function buycom(results) {
	alert(results);
}

// Facebook
function facebook(results) {	
	if (locked["Facebook"].signin || !results) {
		Suggest.addResults("Facebook", []);	
		return;
	} else {
		$("#facebook li").remove();
	}
	
	var start = results.indexOf("{");
	results = results.substring(start);
	var json = $.parseJSON(results);
				
	var suggestions = [];
	for (var i = 0; i < json.payload.entries.length; i++) {
		var link;
		if (json.payload.entries[i].path.indexOf("http://") != -1) 
			link = json.payload.entries[i].path;
		else
			link = "http://www.facebook.com" + json.payload.entries[i].path;
			
		suggestions.push([json.payload.entries[i].text, json.payload.entries[i].category, link]);
	}
			
	Suggest.addResults("Facebook", suggestions);	
}

// Gmail
function gmail(results) {
	if (locked["Gmail"].signin) {
		Suggest.addResults("Gmail", []);	
		return;
	}
		
	var start = results.indexOf("&&&START&&&") + 11;
	var end = results.lastIndexOf("&&&END&&&");
	results = results.substring(start, end);	
	
	var json = $.parseJSON(results);
	var contacts = eval(json.Body.AutoComplete);
		
	var suggestions = [];
	for (var i = 0; i < contacts.length; i++)
		suggestions.push([contacts[i][2], contacts[i][3][0], "http://mail.google.com/mail/?view=cm&fs=1&ui=1&to=" + contacts[i][3][0]]);
		
	Suggest.addResults("Gmail", suggestions);
}

// Chrome bookmarks
function bookmarks(results) {	
	if (!results) {
		Suggest.addResults("Bookmarks", []);	
		return;
	} else {
		$("#bookmarks li").remove();
	}
	
	results = eval(results);

	var suggestions = [];
	for (var i = 0; i < results.length; i++) {
		if (results[i].title.length > 0)
			suggestions.push([results[i].title, "Open Page", results[i].url]);
		else
			suggestions.push([results[i].url.substring(0, 25), "Open Page", results[i].url]);
	}
	
	Suggest.addResults("Bookmarks", suggestions);
}

// Chrome history
function history(results) {	
	if (!results) {
		Suggest.addResults("History", []);
		return;
	} else {
		$("#history li").remove();
	}
	
	results = eval(results);
	
	var suggestions = [];
	for (var i = 0; i < results.length; i++) {		
		if (results[i].title.length > 0)
			suggestions.push([results[i].title, "Open Page", results[i].url]);
		else
			suggestions.push([results[i].url.substring(0, 25), "Open Page", results[i].url]);
	}
		
	Suggest.addResults("History", suggestions);
}

// Chrome tabs
function tabs(results) {
	// alert(results);
}

// Google Docs
function googledocs(results) {	
	if (locked["Google Docs"].signin || !results) {
		Suggest.addResults("Google Docs", []);	
		return;
	} else {
		$("#googledocs li").remove();
	}
	
	var start = results.indexOf("&&&START&&&") + 11;
	results = results.substring(start);
	var json = $.parseJSON(results);
						
	var suggestions = [];
	for (var i = 0; i < json.response.docs.length; i++) {
		var url;
		if (json.response.docs[i].actions && json.response.docs[i].actions[0].url)
			url = json.response.docs[i].actions[0].url;
		else
		 	url = "http://docs.google.com/document/edit?id=" + json.response.docs[i].id;
		
		suggestions.push([json.response.docs[i].name, "Open Document", url]);
	}
		
	Suggest.addResults("Google Docs", suggestions);
}

// Dropbox
function dropbox(results) {
	if (locked["Dropbox"].signin || !results) {
		Suggest.addResults("Dropbox", []);	
		return;
	} else {
		$("#dropbox li").remove();
	}
	
	var json = $.parseJSON(results);
						
	var suggestions = [];
	for (var i = 0; i < json.length; i++) {
		var prompt = json[i].is_dir == true ? "Open Folder" : "Open File";
		suggestions.push([json[i].filename, prompt, json[i].href, "images/icons/" + json[i].icon + ".png"]);
	}
		
	Suggest.addResults("Dropbox", suggestions);	
}

// Apple
function apple(results) {	
	var suggestions = [];
		
	$(results).find("match").each(function() {
		var match = $(this);
		var url;
				
		if (match.attr("url").indexOf("itunes.apple.com") != -1)
			url = "http://click.linksynergy.com/fs-bin/stat?id=/NJhqG*2hp0&offerid=146261&type=3&subid=0&tmpid=1826&RD_PARM1=" + escape(escape(unescape(match.attr("url"))));
		else
			url = match.attr("url");
			
		suggestions.push([unescape(match.attr("title")), match.attr("category"), url]);
	});
		
	Suggest.addResults("Apple", suggestions);
}

// Quora
function quora(results) {	
	var json = $.parseJSON(results);
	var js = json.js;
	var start = js.lastIndexOf('"results":');
	var end = js.lastIndexOf("}");
	
	js = js.substring(start, end);
	js = "{" + js + "}";	
	json = $.parseJSON(js);
				
	var suggestions = [];
	for (var i = 0; i < json.results.length; i++) {
		if (json.results[i].text !== undefined)
			suggestions.push([json.results[i].text, json.results[i].type, "http://www.quora.com" + json.results[i].url]);
	}
		
	Suggest.addResults("Quora", suggestions);
}

// Evernote
function evernote(results) {	
	if (locked["Evernote"].signin || !results) {
		Suggest.addResults("Evernote", []);	
		return;
	} else {
		$("#evernote li").remove();
	}
	
	var suggestions = [];
	
	$(results).find("#note_box").find("p").each(function() {
		var match = $(this).find("a:first");
		var timestamp = $(this).find("i:first");
		
		if (match.attr("href"))			
			suggestions.push([match.text(), timestamp.text(), "https://www.evernote.com" + match.attr("href")]);
	});	
		
	Suggest.addResults("Evernote", suggestions);
}

// Baidu
function baidu(results) {	
	var start = results.indexOf("{");
	var end = results.lastIndexOf("}") + 1;
	results = results.substring(start, end);
	var json = eval("(" + results + ")");
				
	var suggestions = [];
	for (var i = 0; i < json.s.length; i++)
		suggestions.push([json.s[i], "baidu.com"]);
		
	Suggest.addResults("Baidu", suggestions);
}

// Fanvibe
function fanvibe() {
	if (!preload["Fanvibe"].cache) {
		Suggest.addResults("Fanvibe", []);
		return;
	}
	
	var json = $.parseJSON(preload["Fanvibe"].cache);
	
	var results = [];
	var suggestions = [];
	var query = $("#q").val();
	for (var i = 0; i < json.length; i++) {	
		var name = json[i].game.name;	
		if (name.toLowerCase().indexOf(query.toLowerCase()) != -1 && results.indexOf(name) == -1) {
			results.push(name);
			suggestions.push([name, json[i].game.status, "http://www.fanvibe.com/games/" + json[i].game.id]);
		}
	}
		
	Suggest.addResults("Fanvibe", suggestions);
}

// Twitter
function twitter() {
	if (!preload["Twitter"].cache) {
		Suggest.addResults("Twitter", []);
		return;
	}
	
	var json = $.parseJSON(preload["Twitter"].cache);
	
	var results = [];
	var query = $("#q").val();
	for (date in json.trends) {
		for (var i = 0; i < json.trends[date].length; i++) {
			var name = json.trends[date][i].name.replace("#", "");
			if (name.toLowerCase().indexOf(query.toLowerCase()) != -1 && results.indexOf(name) == -1)
				results.push(name);
		}
	}
	
	var suggestions = [];
	for (var i = 0; i < results.length; i++) {
		suggestions.push([results[i], "twitter.com"]);
	}
		
	Suggest.addResults("Twitter", suggestions);
}

// LinkedIn
function linkedin() {
	if (!preload["LinkedIn"].cache || preload["LinkedIn"].signin) {
		Suggest.addResults("LinkedIn", []);
		return;
	}
	
	var json = $.parseJSON(preload["LinkedIn"].cache);
	
	var results = [];	
	var suggestions = [];
	var query = $("#q").val();
	for (var i = 0; i < json.resultList.length; i++) {
		var name = json.resultList[i].displayName;
		var sub = json.resultList[i].subLine;
		var url = json.resultList[i].url;
		
		if (name.toLowerCase().indexOf(query.toLowerCase()) != -1 && results.indexOf(name) == -1) {
			results.push(name);
			suggestions.push([name, sub, "http://www.linkedin.com/" + url]);
		}
	}
		
	Suggest.addResults("LinkedIn", suggestions);
}

// Delicious
function delicious() {
	if (!preload["Delicious"].cache) {
		Suggest.addResults("Delicious", []);
		return;
	}
	
	var json = $.parseJSON(preload["Delicious"].cache);
	
	var results = [];
	var suggestions = [];
	var query = $("#q").val();
	for (var i = 0; i < json.length; i++) {
		var name = json[i].tag;
		if (name.toLowerCase().indexOf(query.toLowerCase()) != -1 && results.indexOf(name) == -1) {
			results.push(name);
			suggestions.push([name, "delicious.com"]);
		}
	}
	
	Suggest.addResults("Delicious", suggestions);
}
