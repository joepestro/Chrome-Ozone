setTimeout(function() {
	// Parse token from <script>
	var s = $("script").text().replace(/\n/g, "");
	var start = s.indexOf("config = {");
	s = s.substring(start);
	var end = s.indexOf("};") + 1;
	s = s.substring(0, end);	
	eval(s);

	// Send to bridge (to be stored)
	$('body').prepend('<div id="bridge" style="display:none"></div>');
	var q = { "googledocs_token": config["token"] };
	$("#bridge").text(JSON.stringify(q));
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('store', true, true);
	$('body')[0].dispatchEvent(customEvent);
}, 250);

var DL_div = null;
var logoSection = null;
var searchForm = null;
var searchSection = null;
var searchTextBox = null;
var showSearchOptionsLink = null;
var searchOptionsSection = null;
var docsSearchButton = null;
var tsb = null;
var webSearchButton = null;
var spellCorrectionEl = null;
var actionStatusEl = null;
var loadingStatusEl = null;
var additionalStatusEl = null;
var additionalNewActions = null;
var surveyLink = null;
var DL_domainObj = null;
var logoutEl = null;
var dwEl = null;
var diEl = null;