/*
 * Copyright (c) 2010 Joe Pestro
 */

$(document).ready(function() {	
	$("#sources_count").text(parseInt($("#sources_count").text()) + parseInt($("#locked_count").text()) + " sources");
	$("#unlock").replaceWith('<a href="' + chrome.extension.getURL("options.html") + '">Customize them</a>');

	$(".promo").remove();
	$("span.wall").remove();
	$(".disabled").removeClass('disabled');
	document.styleSheets[0].addRule(".promo", "display:none;");
	document.styleSheets[0].addRule("span.wall", "display:none;");
	document.styleSheets[0].addRule(".disabled", "opacity:1;");
});