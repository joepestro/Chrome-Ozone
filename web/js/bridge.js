$(document).ready(function() {
	$('body').bind('xhr', function(e) {						
		chrome.extension.sendRequest({'action': $("#bridge").text()}, function(data) {		
			if (data instanceof Array || data.length === undefined)
				data = JSON.stringify(data);
				
			$("#bridge").text(data.toString());
		
			var customEvent = document.createEvent('Event');
			customEvent.initEvent('xhrCallback', true, true);
			$('body')[0].dispatchEvent(customEvent);		
		});
	});

	$('body').bind('bookmarks', function(e) {						
		chrome.extension.sendRequest({'action': 'BOOKMARKS ' + $("#bridge").text()}, function(data) {		
			if (data instanceof Array || data.length === undefined)
				data = JSON.stringify(data);
				
			$("#bridge").text(data.toString());
		
			var customEvent = document.createEvent('Event');
			customEvent.initEvent('xhrCallback', true, true);
			$('body')[0].dispatchEvent(customEvent);		
		});
	});

	$('body').bind('history', function(e) {			
		chrome.extension.sendRequest({'action': 'HISTORY ' + $("#bridge").text()}, function(data) {		
			if (data instanceof Array || data.length === undefined)
				data = JSON.stringify(data);
				
			$("#bridge").text(data.toString());
		
			var customEvent = document.createEvent('Event');
			customEvent.initEvent('xhrCallback', true, true);
			$('body')[0].dispatchEvent(customEvent);		
		});
	});

	$('body').bind('tabs', function(e) {						
		chrome.extension.sendRequest({'action': "TABS"}, function() {
			var tabId, tabContent;
		
			chrome.extension.sendRequest({'action': 'RETRIEVE tabId'}, function(data) {
				tabId = data;
			});
		
			chrome.extension.sendRequest({'action': 'RETRIEVE tabContent'}, function(data) {
				tabContent = data;
			});
		
			// alert(JSON.stringify({"tabId": tabId, "tabContent": tabContent}));
			$("#bridge").text(JSON.stringify({"tabId": tabId, "tabContent": tabContent}));
		
			var customEvent = document.createEvent('Event');
			customEvent.initEvent('xhrCallback', true, true);
			$('body')[0].dispatchEvent(customEvent);		
		});
	});

	$('body').bind('cookies', function(e) {						
		chrome.extension.sendRequest({'action': "COOKIES"}, function(data) {
			$("#bridge").text(JSON.stringify(data));
		
			var customEvent = document.createEvent('Event');
			customEvent.initEvent('cookieCallback', true, true);
			$('body')[0].dispatchEvent(customEvent);		
		});
	});

	$('body').bind('store', function(e) {
		chrome.extension.sendRequest({'action': 'STORE ' + $("#bridge").text()}, function(data) {		
			// callback
		});
	});

	$('body').bind('retrieve', function(e) {	
		chrome.extension.sendRequest({'action': 'RETRIEVE ' + $("#bridge").text()}, function(data) {		
			$("#bridge").text(JSON.stringify(data));
		
			var customEvent = document.createEvent('Event');
			customEvent.initEvent('retrieveCallback', true, true);
			$('body')[0].dispatchEvent(customEvent);
		});
	});
});