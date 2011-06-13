$(document).ready(function() {
	$('body').bind('xhrCallback', function(e) {
		var data = $("#bridge").text();	

		if (data.indexOf("<title>Evernote") != -1)
			evernote(data);
		else if (data.indexOf("&&&END&&&") != -1)
			gmail(data);
		else if (data.indexOf("&&&START&&&") != -1)
			googledocs(data);
		else if (data.indexOf("for (;;);") != -1)
			facebook(data);
		else if (data.indexOf('"icon":') != -1)
			dropbox(data)
		else if (data.indexOf('<shortcuts>') != -1)
			apple(data);
		else if (data.indexOf('W2.') != -1)
			quora(data);
		else if (data.indexOf('window.baidu.sug') != -1)
			baidu(data);
		else if (data.indexOf('"dateAdded":') != -1)
			bookmarks(data);
		else if (data.indexOf('"lastVisitTime":') != -1)
			history(data);
		else if (data.indexOf('"tabId":') != -1)
			tabs(data);
		else if (data.indexOf('"game":') != -1)
			preload["Fanvibe"].cache = data;	
		else if (data.indexOf('"trends":') != -1)
			preload["Twitter"].cache = data;
		else if (data.indexOf('"resultList":') != -1)
			preload["LinkedIn"].cache = data;
		else if (data.indexOf('"tag":') != -1)
			preload["Delicious"].cache = data;
	});

	$('body').bind('cookieCallback', function(e) {
		var data = $("#bridge").text();
		data = $.parseJSON(data);

		for (var i = 0; i < data.length; i++) {			
			if (data[i].domain == ".facebook.com" && data[i].name == "c_user") {
				Suggest._facebookUID = data[i].value;
				locked["Facebook"].signin = null;
				locked["Facebook"].url = locked["Facebook"].url.replace("{token}", Suggest._facebookUID);
			} else if (data[i].domain == ".mail.google.com" && (data[i].name == "GX" || data[i].name == "GXSP")) {
				locked["Gmail"].signin = null;
			} else if (data[i].domain == "www.linkedin.com" && data[i].name == "JSESSIONID") {
				try {
					preload["LinkedIn"].signin = null;
				} catch (e) {}
			} else if (data[i].domain == 'www.evernote.com') {
				locked["Evernote"].signin = null;
			}
		}
	});

	$('body').bind('retrieveCallback', function(e) {		
		var data = $("#bridge").text();
		var json = $.parseJSON(data);

		for (var key in json) {
			if (json.hasOwnProperty(key)) {
				if (key == "dropbox_token") {
					locked["Dropbox"].signin = null;
					locked["Dropbox"].url = locked["Dropbox"].url.replace("{token}", json[key]);
	            } else if (key == "googledocs_token") {
					locked["Google Docs"].signin = null;
					locked["Google Docs"].url = locked["Google Docs"].url.replace("{token}", json[key]);
				} else if (key == "ozone_enabled_sources") {
					var ozone_enabled_sources = json[key].split(",");
				
					if (ozone_enabled_sources.length > 0) {
						var allSources = {};
						allSources = $.extend(allSources, public);
						allSources = $.extend(allSources, locked);
						allSources = $.extend(allSources, preload);
				
						for (source in allSources) {
							var s;
					
							if (public[source])
								s = public[source];
							else if (locked[source])
								s = locked[source];
							else if (preload[source])
								s = preload[source];
					
							s.enabled = false;
						}
				
				        for (var i = 0; i < ozone_enabled_sources.length; i++)
							allSources[ozone_enabled_sources[i]]["enabled"] = true;
					}
				} else if (key == "google_enabled") {
					if (json[key] == "true")
						Suggest._googleEnabled = true;
				} else if (key == "google_enabled_sources") {
					var google_enabled_sources = json[key].split(",");

					if (google_enabled_sources.length > 0) {				
						for (source in locked) {
							locked[source]["enabled"] = false;
						}

				        for (var i = 0; i < google_enabled_sources.length; i++)
							locked[google_enabled_sources[i]]["enabled"] = true;
					}
				} else if (key == "google_number") {
					Suggest.NUM_GOOGLE_RESULTS = parseInt(json[key]);
				}
	        }
		}
	});
});