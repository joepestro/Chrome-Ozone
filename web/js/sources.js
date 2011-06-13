/* Autocomplete sources */

var public = {
	"Google": {"root": "http://www.google.com", "url": "http://www.google.com/complete/search?jsonp=google&q=", "go": "http://www.google.com/search?q=", "enabled": true}, 
	"Amazon": {"root": "http://www.amazon.com", "url": "http://completion.amazon.com/search/complete?method=completion&search-alias=aps&mkt=1&x=amazon&sc=1&q=", "go": "http://www.amazon.com/s?tag=joepestro-20&field-keywords=", "enabled": true},
	"Netflix": {"root": "http://www.netflix.com", "url": "http://autocomplete.netflix.com/JSON/AutoCompleteSearch?n=10&callback=netflix&prefix=", "go": "http://www.netflix.com/Search?v1=", "enabled": true},
	"Wikipedia": {"root": "http://www.wikipedia.org", "url": "http://en.wikipedia.org/w/api.php?action=opensearch&namespace=0&suggest&callback=wikipedia&search=", "go": "http://en.wikipedia.org/wiki/Special:Search?search=", "enabled": true},
	"YouTube": {"root": "http://www.youtube.com", "url": "http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&jsonp=youtube&cp=1&q=", "go": "http://www.youtube.com/results?search_query=", "enabled": true},
	// "Scribe": {"root": "http://scribe.googlelabs.com", "url": "http://scribe.googlelabs.com/suggest?hl=en&callback=scribe&q="},
}

var locked = {
	"Bookmarks": {"root": "images/bookmarks.png", "url": "", "enabled": true},
	"History": {"root": "images/history.png", "url": "", "enabled": true},
	"Gmail": {"root": "http://mail.google.com", "url": "https://mail.google.com/mail/c/data/contactstore?hl=en&max=5&out=js&type=4&tok=", "signin": "http://mail.google.com", "google": true, "enabled": true},
	"Facebook": {"root": "http://www.facebook.com", "url": "http://www.facebook.com/ajax/typeahead/search.php?__a=1&viewer={token}&value=", "go": "http://www.facebook.com/search/?q=", "signin": "http://www.facebook.com", "google": true, "enabled": true},
	"Google Docs": {"root": "http://docs.google.com", "url": "https://docs.google.com/vr?start=0&numResults=10&sort=3&desc=true&qNameOnly=true&view=2&hidden=2&data=2&token={token}&version=4&tzfp=&tzo=420&subapp=4&app=2&authuser=0&clientUser=&hl=en&q=", "post": true, "signin": "https://docs.google.com", "google": true, "enabled": true},
	"Dropbox": {"root": "http://www.dropbox.com", "url": "https://www.dropbox.com/search?t={token}&search_string=", "post": true, "signin": "https://www.dropbox.com", "google": true, "enabled": true},
	// "Buy.com": {"root": "http://www.buy.com", "url": "http://www.buy.com/SR/autocomplete.aspx?q="},
	"Apple": {"root": "http://www.apple.com", "url": "http://www.apple.com/global/nav/scripts/shortcuts.php?section=global&geo=us&q=", "enabled": true},
	"Quora": {"root": "http://www.quora.com", "url": "http://www.quora.com/ajax/context_navigator_results?data={}&___W2_parentId=&___W2_windowId=&q=", "enabled": true},
	"Evernote": {"root": "http://www.evernote.com", "url": "https://www.evernote.com/mobile/Home.action?page=&paginatedQuery.queryDefinition=SEARCH:", "go": "https://www.evernote.com/mobile/ViewNote.action?paginatedQuery.noteOffset=0&paginatedQuery.queryDefinition=SEARCH:", "signin": "https://www.evernote.com/Login.action", "google": true},
	"Baidu": {"root": "http://www.baidu.com", "url": "http://suggestion.baidu.com/su?wd=", "go": "http://www.baidu.com/s?wd="}
}

var preload = {
	"Fanvibe": {"root": "http://fanvibe.com", "url": "http://fanvibe.com/games.json", "cache": null},
	"Twitter": {"root": "http://twitter.com", "url": "http://api.twitter.com/1/trends/daily.json", "go": "http://search.twitter.com/search?q=", "cache": null, "enabled": true},
	"LinkedIn": {"root": "http://www.linkedin.com", "url": "http://www.linkedin.com/typeahead/mynetwork", "cache": null, "signin": "https://www.linkedin.com/secure/login", "enabled": true},
	"Delicious": {"root": "http://www.delicious.com", "url": "http://feeds.delicious.com/v2/json/alltags", "go": "http://www.delicious.com/tag/", "cache": null},
}