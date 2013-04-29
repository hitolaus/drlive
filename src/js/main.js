// Setup globals for all AJAX requests
$.ajaxSetup({ timeout: 10000 });

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

    var channels = new Channels();

    // The channel selected in the EPG
    var activeIdx = 0;

	var clock = new Clock();
	var watcher = new Watcher(); // TODO: Move watcher refs to player
	var epg = new Epg();
    var player = new Player(watcher);
    var favorites = new Favorites();
    var vod = new VOD(player, favorites);

    function setupPlayer() {
        boxee.onKeyboardKeyLeft  = function() {browser.keyPress(browser.KEY_LEFT);};
        boxee.onKeyboardKeyRight = function() {browser.keyPress(browser.KEY_RIGHT);};
        boxee.onKeyboardKeyUp    = function() {browser.keyPress(browser.KEY_UP);};
        boxee.onKeyboardKeyDown  = function() {browser.keyPress(browser.KEY_DOWN);};
        boxee.onKeyboardKeyEnter = function() {browser.keyPress(browser.KEY_RETURN);};
        boxee.onKeyboardKeyBack  = function() {browser.keyPress(browser.KEY_ESCAPE);};
        boxee.onPlay = function() {browser.keyPress(browser.KEY_P);};
        boxee.onPause = function() {browser.keyPress(browser.KEY_P);};
        boxee.onUpdateState = function() { playerState.canPause = true; };
    }

    // Register in Control Context (see http://developer.boxee.tv/Control_Script_Context)
    boxee.exec(setupPlayer);
    // Execute in Control Context (see http://developer.boxee.tv/Control_Script_Context)
    boxee.exec("setupPlayer()");

    function showGuide() {
        player.getState(function (state) {

            hideInfo();

            epg.loadGuide('#menu', state.currentChannelIdx);
            // TODO: Do in callback from loadGuide
            watcher.loadWatcherCount('#menu', state.currentChannelIdx);

            $('#menu_spacer').show();
            $('#menu').show();
        });
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

    function changeChannel() {
        // Only change channel if it has actually changed
        player.getState(function(state) {
            if (state.currentChannelIdx === activeIdx) {
                return;
            }

            var activeElement = $('.active')[0];
            var idx = parseInt(activeElement.id, 10);

            var channel = channels.getCleanName(idx);

            player.play({
                'channel': channel,
                'idx': idx
            });
        });
    }


    function moveSelection(direction) {
        var active_elem = document.getElementsByClassName("active")[0];
        var active_id = -1;
        if (active_elem) {
            active_id = parseInt(active_elem.id, 10);
        }

        if ((active_id === 0 && direction < 0) || (active_id === channels.size()-1 && direction > 0)) {
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
            clock.hide();
        }
        else if ($('#videos').is(":visible")) {
            vod.enter();
        }
        else if ($('#menu').is(":visible")) {
            changeChannel();

            hideGuide();
            clock.hide();
        }
        else {
            showGuide();
            clock.show();
        }
    }

    function onPlay() {
        if ($('#videos').is(":visible")) {
            vod.play();
        }
    }

    function onBack() {
        if ($('#description').is(":visible")) {
            hideInfo();
            clock.hide();
        }
        else if ($('#menu').is(":visible")) {
            hideGuide();
            clock.hide();
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
            clock.show();
        }
        else {
            player.next();
        }
    }

    function onLeft() {
        if ($('#description').is(':visible')) {
            showGuide();
            clock.show();
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
            clock.hide();
        }
        else if ($('#videos').is(":visible")) {
            vod.up();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(-1);
        }
        else {
            player.getState(function (state) {
                setActiveMenuElement(state.currentChannelIdx);

                showInfo();
                clock.show();
            });
        }
    }

    function onDown() {
        if ($('#description').is(":visible")) {
            hideInfo();
            clock.hide();
        }
        else if ($('#videos').is(":visible")) {
            vod.down();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(1);
        }
        else {
            //searchForActiveShow();
            vod.show();
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
        case 80: // 'P'
            onPlay();
            break;
        default:
            break;
        }
    });

    // *********************************************
    // INIT
    // *********************************************
    showGuide();
    clock.show();
});
