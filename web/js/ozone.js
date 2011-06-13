/* Event handlers */

$(document).ready(function() {	
	$(document).keydown(function(e) {	
		var selected = $(".highlighted");
									
		switch (e.which) {
			case 13: // return
				if (Suggest._selectedIndex != -1)
					Suggest.selectResult(Suggest._selectedGroup, Suggest._selectedIndex);
				break;
			case 9: // tab
				if (Suggest._selectedIndex != -1) {
					if (e.shiftKey) {					
						e.stopPropagation();
						e.preventDefault();
						if (Suggest._selectedGroup == 0)
							Suggest.highlightResult(Suggest._selectedGroup = 14, Suggest._selectedIndex);
						else
							Suggest.highlightResult(--Suggest._selectedGroup, Suggest._selectedIndex);
					} else {
						e.stopPropagation();
						e.preventDefault();
						if (Suggest._selectedGroup == 14)
							Suggest.highlightResult(Suggest._selectedGroup = 0, Suggest._selectedIndex);
						else
							Suggest.highlightResult(++Suggest._selectedGroup, Suggest._selectedIndex);
					}
				} else {
					Suggest._selectedGroup = 0;
					Suggest._selectedIndex = 0;
					$(".result").removeClass("highlighted");
					$(".results:eq(" + Suggest._selectedGroup.toString() + ") .result:eq(" + Suggest._selectedIndex.toString() + ")").addClass("highlighted");
				}
				break;
			case 39: // right
				if (Suggest._selectedIndex != -1) {
					e.stopPropagation();
					e.preventDefault();
					
					if (Suggest._selectedGroup % Suggest.NUM_PER_ROW-4 == 0)
						Suggest.highlightResult(Suggest._selectedGroup -= 4, Suggest._selectedIndex);
					else
						Suggest.highlightResult(++Suggest._selectedGroup, Suggest._selectedIndex);
				}
				break;
			case 27: // esc
				if (Suggest._selectedIndex == -1) {
					$("#q").val("");
					$("#q").focus();
					Suggest.hideHUD();
				} else {
					Suggest._selectedGroup = 0;
					Suggest._selectedIndex = -1;
					$(".result").removeClass("highlighted");
					$("#q").focus();
				}
				break;
			case 37: // left
				if (Suggest._selectedIndex != -1) {
					e.stopPropagation();
					e.preventDefault();
					if (Suggest._selectedGroup % Suggest.NUM_PER_ROW == 0)
						Suggest.highlightResult(Suggest._selectedGroup += 4, Suggest._selectedIndex);
					else	
						Suggest.highlightResult(--Suggest._selectedGroup, Suggest._selectedIndex);
				}
				break;
			case 38: // up
				e.stopPropagation();
				e.preventDefault();
				if (Suggest._selectedIndex == 0 && Suggest._selectedGroup < Suggest.NUM_PER_ROW) {
					Suggest._selectedIndex = -1;
					$(".result").removeClass("highlighted");
					$("#q").focus();
				} else if (Suggest._selectedIndex == -1) {
					Suggest.highlightResult(Suggest._selectedGroup += 10, Suggest._selectedIndex = Suggest.NUM_RESULTS-1);
				} else if (Suggest._selectedIndex == 0) {
					Suggest.highlightResult(Suggest._selectedGroup -= Suggest.NUM_PER_ROW, Suggest._selectedIndex = Suggest.NUM_RESULTS-1);
				} else {
					Suggest.highlightResult(Suggest._selectedGroup, --Suggest._selectedIndex);
				}
				break;
			case 40: // down
				e.stopPropagation();
				e.preventDefault();
				if (Suggest._selectedIndex == Suggest.NUM_RESULTS-1 && Suggest._selectedGroup >= 10) {
					Suggest._selectedGroup -= 10;
					Suggest._selectedIndex = -1;
					$(".result").removeClass("highlighted");
					$("#q").focus();
				} else if (Suggest._selectedIndex == Suggest.NUM_RESULTS-1) {
					Suggest.highlightResult(Suggest._selectedGroup += 5, Suggest._selectedIndex = 0);
				} else {
					Suggest.highlightResult(Suggest._selectedGroup, ++Suggest._selectedIndex);
				}
				break;
		}
	});
	
	// set up live events (always apply to these elements)
	$(".result").live('mousemove', function() {
		$(".result").removeClass("highlighted");
		$(this).addClass("highlighted");
		
		Suggest._selectedGroup = $(this).parent().parent().index() - 3;
		Suggest._selectedIndex = $(this).index();
	});
	
	$("#f").submit(function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		if ($("#q").val()) {
			$("#q").blur();	
			Suggest.showHUD();
		
			Suggest._selectedGroup = 0;
			Suggest._selectedIndex = 0;
			$(".result").removeClass("highlighted");
			$(".results:eq(" + Suggest._selectedGroup.toString() + ") .result:eq(" + Suggest._selectedIndex.toString() + ")").addClass("highlighted");
		}
	});
	
    $("#q").keyup(function() {	
		if ($(this).val() == "") {
			Suggest.hideHUD();
		} else {
			Suggest.showHUD();
		}
				
        if ($(this).val() != Suggest._query) {
            Suggest._query = $(this).val();
			Suggest.queryChanged(Suggest._query);
        }
    });
		
	// let everyone know how many sources are indexed	
	$("#sources_count").text((Object.size(public) + Object.size(locked) + Object.size(preload)) + " sources");
	
	// suggestions start out hidden
	$(".results").hide();
	$("#q").focus();	
	
	// timeouts on load
	setTimeout(Suggest.loadPreferences, 200);
	setTimeout(Suggest.init, 250);
	setTimeout(Suggest.preload, 250);
	setTimeout(Suggest.checkCookies, 250);
	setTimeout(Suggest.checkTokens, 250);
	setTimeout(Suggest.restoreQuery, 250);
});