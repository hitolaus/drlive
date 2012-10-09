// Setup globals for all AJAX requests
$.ajaxSetup({ timeout: 10000 });
    
var playlists = ["dr1","dr2","ramasjang","drk","drupdate","drhd"];
    
var dialog = {
  showQuitDialog: function() {
	boxeeAPI.promptDialog("Afslut?", "Er du sikker på, at du vil afslutte DR Live TV?", function(confirmed) {
		if (confirmed) {
			boxeeAPI.closeApp();
		}
	});
  }
};    

if (!window.console) {
    console = {};
}

$(function () {
    boxeeAPI.keyboardMode();

	// The channel we are currently viewing
    // TODO: Move to Player
    var currentChannelIdx = 0;
    // The channel selected in the EPG
    var activeIdx = currentChannelIdx;

    var lastSearchTerm = "";

    var WATCHING_INTERVAL_IN_MILLIS = 30000;

	var watcher = new Watcher();
	var epg = new Epg(watcher);
    var player = new Player();
    var favorites = new Favorites();
    var vod = new VOD(player, favorites);

    function setupPlayer() {
        boxee.onKeyboardKeyLeft  = function() {browser.keyPress(browser.KEY_LEFT);};
        boxee.onKeyboardKeyRight = function() {browser.keyPress(browser.KEY_RIGHT);};
        boxee.onKeyboardKeyUp    = function() {browser.keyPress(browser.KEY_UP);};
        boxee.onKeyboardKeyDown  = function() {browser.keyPress(browser.KEY_DOWN);};
        boxee.onKeyboardKeyEnter = function() {browser.keyPress(browser.KEY_RETURN);};
        boxee.onKeyboardKeyBack  = function() {browser.keyPress(browser.KEY_ESCAPE);};
    }

    // Register in Control Context (see http://developer.boxee.tv/Control_Script_Context)
    boxee.exec(setupPlayer);
    // Execute in Control Context (see http://developer.boxee.tv/Control_Script_Context)
    boxee.exec("setupPlayer()");

    function watchingPing() {
        watcher.watching(currentChannelIdx);
    }

    function searchForActiveShow() {
        if (currentChannelIdx < 0) {
            search(lastSearchTerm);
            return;
        }
        epg.getActiveShow(currentChannelIdx, search);
    }

    function search(term) {
        //$.get('api/search.php?term=' + encodeURIComponent(term), function(data) {
        var encodedSearchTerm = encodeURIComponent(term).replace(/\+/g, '%20');
        $.getJSON('http://www.dr.dk/nu/api/search/' + encodedSearchTerm + "?callback=?", function(data) {
            lastSearchTerm = term;
            
            //buildVideos(data);
            vod.build(data);
        });
    }

    function updateClock() {
        var now = new Date();

        $('#clock').remove();
        
        $('body').append('<div id="clock"></div>');
        
        $('#clock').append('<span class="icon clock"></span>');
        $('#clock').append(now.getFormattedTime());
    }

	function showSearch() {

		$('body').append('<div id="search"><input name="search_field" id="search_field" class="search_elem selected" /></div>');

		$('#search_field').focus();

		$('#search').append('<hr/>');
		
		var prevSearchQueries = $.cookie("boxee_dr_live_tv_prev_search");
		if (prevSearchQueries != null) {
			prevSearchQueries = prevSearchQueries.split(",");
			for(var i = 0; i < prevSearchQueries.length && i < 4; i++) {
				$('#search').append('<div class="search_elem prev_search">'+prevSearchQueries[i]+'</div>');
			}
		}
	}
	function hideSearch() {
		$('#search').remove();
	}

    function showGuide() {
        setActiveMenuElement(currentChannelIdx);

        hideInfo();

        epg.loadGuide('#menu', currentChannelIdx);

        $('#menu_spacer').show(); 
        $('#menu').show();
    }
    function hideGuide() {
        $('#menu_spacer').hide();
        $('#menu').hide();
    }

    function showInfo() {
        hideGuide();
        
        epg.loadChannelInfo('#description', activeIdx);
        
        $('#description').show();
    }
    function hideInfo() {
        $('#description').hide();
    }

    function showClock() {
        updateClock();

        $('#clock').show();
    }
    function hideClock() {
        $('#clock').hide();
    }

    function changeChannel() {
        // Only change channel if it has actually changed
        if (currentChannelIdx === activeIdx) {
            return;
        }

        if (watchingTimer != null) {
            clearInterval(watchingTimer);
        }


        var activeElement = $('.active')[0];
        var idx = activeElement.id;
        

        currentChannelIdx = idx;

        setInterval(watchingPing, WATCHING_INTERVAL_IN_MILLIS);
        
        var channel = playlists[idx];
        
        player.play({
            'channel': channel, 
            'idx': idx
        });
    }
    
	
    function moveSelection(direction) {
        var active_elem = document.getElementsByClassName("active")[0];
        var active_id = -1;
        if (active_elem !== null) {
            active_id = parseInt(active_elem.id, 10);
        }
        
        if ((active_id === 0 && direction < 0) || (active_id === playlists.length-1 && direction > 0)) {
            return;
        }
		var next_id = active_id + direction;

        setActiveMenuElement(next_id);
    }

    function setActiveMenuElement(idx) {
        var active = $('#menu').find('.active');
        active.removeClass('active');

        $('#'+idx).addClass('active');

        activeIdx = idx;

        watcher.loadWatcherCount('#menu', activeIdx);
    }

    function onEnter() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
        else if ($('#videos').is(":visible")) {
            vod.enter();
        }
        else if ($('#menu').is(":visible")) {
            changeChannel();

            hideGuide();
            hideClock();
        }
        else {
            showGuide();
            showClock();
        }
    }

    function onBack() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
        else if ($('#menu').is(":visible")) {
            hideGuide();
            hideClock();
        }
        else if ($('#videos').is(":visible")) {
            vod.hide();
        }
        else {
            dialog.showQuitDialog();
        }
        
    }

    function onRight() {
        if ($('#description').is(':visible')) {
        }
        else if ($('#videos').is(":visible")) {
            vod.right();
        }
        else if ($('#menu').is(":visible")) {
            showInfo();
            showClock();
        }
        else {
            player.next();
        }
    }
   
    function onLeft() {
        if ($('#description').is(':visible')) {
            showGuide();
            showClock();
        }
        else if ($('#videos').is(":visible")) {
            vod.left();
        }
        else if ($('#menu').is(":visible")) {

        }
        else {
            player.previous();
        }
    }

    function onUp() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
        else if ($('#videos').is(":visible")) {
            vod.up();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(-1);
        }
        else {
            setActiveMenuElement(currentChannelIdx);
            
            showInfo();
            showClock();
        }
    }

    function onDown() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
        else if ($('#videos').is(":visible")) {
            vod.down();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(1);
        }
        else {
            searchForActiveShow();
        }
    }

    // Browser control
    $(document).keydown(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);

        switch(code) {
        case 13:
            onEnter();
            break;
        case 27:
            onBack();
            break;
        case 37:
            onLeft();
            break;
        case 38:
            onUp();
            break;
        case 39:
            onRight();
            break;
        case 40:
            onDown();
            break;
        default:
            break;
        }
    });

    // *********************************************
    // INIT
    // *********************************************
    showGuide();
    showClock();
    
    // TODO: Move to Player
    watchingPing(); // Start the watching timer right away
    var watchingTimer = setInterval(watchingPing, WATCHING_INTERVAL_IN_MILLIS);
});
