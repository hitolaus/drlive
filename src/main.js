// Setup globals for all AJAX requests
$.ajaxSetup({ timeout: 5000 });
    
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

    // Index for navigating videos
    var currentVideoBeginIdx = 0;

    var lastSearchTerm = "";

    var WATCHING_INTERVAL_IN_MILLIS = 30000;

	var watcher = new Watcher();
	var epg = new Epg(watcher);
    var player = new Player();

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

	function searchFreetext() {
		var selectedElement = $('#search .search_elem.selected');
	
		var term = selectedElement.val();
		if (selectedElement.is("div")) {
			term = selectedElement.html();
		}
	
		if ($.trim(term) === "") {
			return;
		}
		
		var prevSearches = $.cookie("boxee_dr_live_tv_prev_search");
		if (prevSearches === null || prevSearches === "") {
			prevSearches = [];
		}
		else {
			prevSearches = prevSearches.split(",");
		}
		var newLength = prevSearches.unshift(term);
		while (newLength > 4) {
			prevSearches.pop();
			newLength = prevSearches.length;
		}
		
		$.cookie("boxee_dr_live_tv_prev_search", prevSearches, { expires: 365 });

        hideSearch();
		search(term);
	}

    function search(term) {
        //$.get('api/search.php?term=' + encodeURIComponent(term), function(data) {
        var encodedSearchTerm = encodeURIComponent(term).replace(/\+/g, '%20');
        $.getJSON('http://www.dr.dk/nu/api/search/' + encodedSearchTerm + "?callback=?", function(data) {
            lastSearchTerm = term;
            
            buildVideos(data);
        });
    }

    function loadActiveVideos(path) {
        var api = "";

        if (path === undefined) {
			var selectedVideo = $('#videos_menu').find('.selected');
			var cmdElement = selectedVideo.children('.cmd');
			if (cmdElement === null || cmdElement.length === 0) {
				return;
			}
		
			var cmd = cmdElement.html();
			
			api = 'api/'+cmd+'.php?ts='+new Date().getTime();
		}
		else {
			api = 'api/' + path + '?ts='+new Date().getTime();
		}
    
        $.get(api, function(data) {            
            buildVideos(data);
        });
    }

	function buildVideos(data) {
        currentVideoBeginIdx = 0;

        $('#video_menu_inactive').remove();
		$('#videos').remove();
        $('#videos_spacer').remove();

        var videos = $('<div id="videos" />');

        if (data.length === 0) {
            videos.append('<div class="error">Ingen videoer fundet</div>');
        }
			
        for (var i = 0; i < data.length; i++) {
            var r = data[i];
            
            var video = $('<div class="video" />');
            if (i === 0) {
                video.addClass("selected");
            }
            
            var title = r.title;
            var slug = null;
            
            var thumb = null;
            
            if (r.id === undefined) {
                thumb = $('<div class="thumb"><img src="images/default_video.png" data-src="api/imageproxy.php/programseries/'+r.slug+'/images/200x150.jpg" alt="" /></div>');

                slug = r.slug;
            }
            else {
                thumb = $('<div class="thumb"><img src="images/default_video.png" data-src="api/imageproxy.php/videos/'+r.id+'/images/200x150.jpg" alt="" /></div>');

                slug = r.programSerieSlug;
			}
			var favMark = $('<div class="favorite"><img src="images/buttons/graphic-check-54px.png" alt="" /></div>');
			
			if (!isFavorite(title, slug)) {
				favMark.hide();
			}
			video.append(favMark);
			video.append(thumb);
			video.append('<div class="title">'+r.title+'</div>');
			if (r.id !== undefined) {
				video.append('<div style="display:none;" class="video_id">'+r.id+'</div>');
			}
			video.append('<div style="display:none;" class="video_slug">'+slug+'</div>');
            //video.append('<div style="display:none;" class="description">' + r.description + '</div>');

			if (i > 4) {
                video.hide();
            }
            else {
                // Load visible thumbs
                new Image().load(thumb);
            }

            videos.append(video);
        }

		$('body').append('<div id="video_menu_inactive">Press Up for Menu</div>');
        $('body').append(videos);
        $('body').append('<div id="videos_spacer" />');
        
        showVideos();
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

    function showVideos() {
        $('#video_menu_inactive').show();
    }
    function hideVideos() {
        hideVideosMenu(true);
        $('#video_menu_inactive').hide();
        $('#videos_spacer').hide();
        $('#videos').hide();
        currentVideoBeginIdx = 0;
    }

	function showVideosMenu() {
        $('#video_menu_inactive').hide();
        // Remove the selected element in the video selection menu, since we are selection content in another menu
		$('#videos').find('.video').removeClass('selected');
	
		if ($('#videos_menu').length === 0) {
			var menu = $('<div id="videos_menu"></div>');
			
			//menu.append('<div class="menu selected"><img src="images/buttons/icon_whatsnew.png" alt="Nyeste" /><span>Nyeste</span><div style="display:none;" class="cmd">newest</div></div>');
			menu.append('<div class="menu selected"><span class="icon new"></span><span class="title">Nyeste</span><div style="display:none;" class="cmd">newest</div></div>');
			menu.append('<div class="menu"><span class="icon popular"></span><span class="title">Mest Populære</span><div style="display:none;" class="cmd">mostviewed</div></div>');
			menu.append('<div class="menu"><span class="icon favorite"></span><span class="title">Favoritter</span><div style="display:none;" class="cmd">favorites</div></div>');
			menu.append('<div class="menu"><span class="icon all"></span><span class="title">Alle Programmer</span><div style="display:none;" class="cmd">programs</div></div>');
		
			$('body').append(menu);
		}
		else {
			$('#videos_menu').show();
		}
	}
	function hideVideosMenu(reset) {
		reset = typeof reset !== 'undefined' ? reset : false;

		if (reset) {
			$('#videos_menu').remove();
		}
		else {
			// When we only hide the element the selected menu is remembered
			$('#videos_menu').hide();
		}
		
		$('#video_menu_inactive').show();
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
    function playVideo() {
        var selectedVideo = $('#videos').find('.selected');
        var videoIdElement = selectedVideo.children('.video_id');
        if (videoIdElement.length === 0) {
            var videoSlugElement = selectedVideo.children('.video_slug');
            var videoSlug = videoSlugElement.html();

            loadActiveVideos("programs.php/"+videoSlug+"/videos");
            return false;
        }
        
        var videoId = videoIdElement.html();
        
        player.play({videoId: videoId });
        return true;
    }
    
	function toggleFavorite() {
		var selectedVideo = $('#videos').find('.selected');
		var videoSlugElement = selectedVideo.children('.video_slug');
		
        if (videoSlugElement.length === 0) {
            return;
        }
        
        var title = selectedVideo.children('.title').html();
        var videoSlug = videoSlugElement.html();
        
        
        if (isFavorite(title,videoSlug)) {
            removeFavorite(title, videoSlug);
            selectedVideo.find('.favorite').hide();
        }
        else {
            addFavorite(title, videoSlug);
            selectedVideo.find('.favorite').show();
        }
	}
	function isFavorite(title,slug) {
		return $.inArray(title+':::'+slug, getFavorites()) > -1;
	}
	function getFavorites() {
		var favorites = $.cookie("boxee_dr_live_tv_favorites");
		if (favorites !== null) {
			return favorites.split(",");
		}
		return [];
	}
	function addFavorite(title, slug) {
		var favorites = getFavorites();
		
		favorites.push(title+':::'+slug);
		
		$.cookie("boxee_dr_live_tv_favorites", favorites, { expires: 1500 });

	}
	function removeFavorite(title, slug) {
		var favorites = getFavorites();
		
		var idx = favorites.indexOf(title+':::'+slug);
		if (idx < 0) {
			return;
		}
		
		favorites.splice(idx, 1);
		
		$.cookie("boxee_dr_live_tv_favorites", favorites, { expires: 1500 });
	}

    function moveSelection(direction) {
        var active_elem = document.getElementsByClassName("active")[0];
        var active_id = -1;
        if (active_elem !== null) {
            active_id = active_elem.id;
        }
        if ((active_id === 0 && direction < 0) || (active_id === playlists.length-1 && direction > 0)) {return;}
		var next_id = parseInt(active_id, 10) + parseInt(direction, 10);

        setActiveMenuElement(next_id);
    }

    function moveVideoSelection(direction) {
        var videos = $('#videos').children();
        for (var i = 0; i < videos.length; i++) {
            var video = $(videos[i]);
            
            if (video.hasClass('selected')) {
                if (i === 0 && direction < 0) {
                    return;
                }
                if (i+direction >= videos.length) {
                    return;
                }

                // Check if we move out of the view block to the right
                if (i >= currentVideoBeginIdx + 4 && direction > 0) {
                    $(videos[currentVideoBeginIdx]).hide();
                    $(videos[i+1]).show();
                    new Image().load($(videos[i+1]));
                    currentVideoBeginIdx++;
                }
                // Check if we move out of the view block to the left
                if (i <= currentVideoBeginIdx && direction < 0) {
                    $(videos[i-1]).show();
                    $(videos[currentVideoBeginIdx+4]).hide();
                    currentVideoBeginIdx--;
                }

                // Set the new selected element
                video.removeClass('selected');
                $(videos[i+direction]).addClass('selected');
                break;
            }
        }
        // Select the first element if none are selected
        if ($('#videos').find('.selected').length === 0 && videos.length > 0) {
            $(videos[0]).addClass('selected');
        }
    }

	function moveVideoMenuSelection(direction) {
        var videos = $('#videos_menu').children();
        for (var i = 0; i < videos.length; i++) {
            var video = $(videos[i]);
            
            if (video.hasClass('selected')) {
                if (i === 0 && direction < 0) {
                    return;
                }
                if (i+direction >= videos.length) {
                    return;
                }

                // Set the new selected element
                video.removeClass('selected');
                $(videos[i+direction]).addClass('selected');
                break;
            }
        }
    }

	function moveSearchSelection(direction) {
        var videos = $('#search .search_elem');
        for (var i = 0; i < videos.length; i++) {
            var video = $(videos[i]);
            
            if (video.hasClass('selected')) {
                if (i === 0 && direction < 0) {
                    return;
                }
                if (i+direction >= videos.length) {
                    return;
                }

                // Check if we move out of the view block to the right
                if (i >= currentVideoBeginIdx + 4 && direction > 0) {
                    $(videos[currentVideoBeginIdx]).hide();
                    $(videos[i+1]).show();
                    currentVideoBeginIdx++;
                }
                // Check if we move out of the view block to the left
                if (i <= currentVideoBeginIdx && direction < 0) {
                    $(videos[i-1]).show();
                    $(videos[currentVideoBeginIdx+4]).hide();
                    currentVideoBeginIdx--;
                }

                // Set the new selected element
                video.removeClass('selected');
                $(videos[i+direction]).addClass('selected');
                break;
            }
        }
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
        else if ($('#videos_menu').is(":visible")) {
            loadActiveVideos();
            hideVideosMenu();
        }
        else if ($('#videos').is(":visible")) {
            var playing = playVideo();
            if (playing) {
                hideVideos();
            }
        }
        else if ($('#menu').is(":visible")) {
            changeChannel();

            hideGuide();
            hideClock();
        }
        else if ($('#search').is(":visible")) {
			searchFreetext();
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
            hideVideos();
        }
        else if ($('#search').is(":visible")) {
            hideSearch();
        }
        else {
            dialog.showQuitDialog();
        }
        
    }

    function onRight() {
        if ($('#description').is(':visible')) {
        }
        else if ($('#videos_menu').is(":visible")) {
            moveVideoMenuSelection(1);
        }
        else if ($('#videos').is(":visible")) {
            moveVideoSelection(1);
        }
        else if ($('#menu').is(":visible")) {
            showInfo();
            showClock();
        }
        else if ($('#search').is(":visible")) {}
        else {
            player.next();
        }
    }
   
    function onLeft() {
        if ($('#description').is(':visible')) {
            showGuide();
            showClock();
        }
        else if ($('#videos_menu').is(":visible")) {
            moveVideoMenuSelection(-1);
        }
        else if ($('#videos').is(":visible")) {
            moveVideoSelection(-1);
        }
        else if ($('#menu').is(":visible")) {

        }
        else if ($('#search').is(":visible")) {}
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
            showVideosMenu();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(-1);
        }
        else if ($('#search').is(":visible")) {
            moveSearchSelection(-1);
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
		else if ($('#videos_menu').is(":visible")) {
            hideVideosMenu();
        }
        else if ($('#videos').is(":visible")) {
            toggleFavorite();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(1);
        }
        else if ($('#search').is(":visible")) {
            moveSearchSelection(1);
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

    /* *********************************************
     * INIT
     * ********************************************* */
    showGuide();
    showClock();
    
    // TODO: Move to Player
    watchingPing(); // Start the watching timer right away
    var watchingTimer = setInterval(watchingPing, WATCHING_INTERVAL_IN_MILLIS);
});
