/**
 * The VOD video list and menu.
 *
 * @author Jakob Hilarius, http://syscall.dk
 */
function VOD(player, favorites) {
	var currentPaginationIdx = 0,
		currentSelectedVideoIdx = 0,
		menuActive = false,
		scope = this;

	function load(path) {
		var api = "";

		if (path === undefined) {
			var selectedVideo = $('#vod-menu').find('.selected');
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
			$('#vod-grid').remove();
			$('#vod-container').append(buildVideoGrid(data));

			activateGrid();
		});
	}

	function buildVideoGrid(data) {
		var grid = $('<div id="vod-grid" />'),
			len  = (data === null) ? 0 : data.length;

		if (len === 0) {
			grid.append('<div class="error">Ingen videoer fundet</div>');
		}
			
		for (var i = 0; i < len; i++) {
			var r = data[i];

			var video = $('<div class="video" />');
			if (i === 0) {
				video.addClass("selected");
			}

			var title = r.title;
			var slug = null;

			var thumb = null;

			if (r.id === undefined) {
				thumb = $('<img src="images/default_video.png" data-src="api/imageproxy.php/programseries/'+r.slug+'/images/200x150.jpg" alt="" />');

				slug = r.slug;
			}
			else {
				thumb = $('<img src="images/default_video.png" data-src="api/imageproxy.php/videos/'+r.id+'/images/200x150.jpg" alt="" />');

				slug = r.programSerieSlug;
			}
			/*
			var favMark = $('<div class="favorite"><img src="images/buttons/graphic-check-54px.png" alt="" /></div>');
			
			if (!favorites.isFavorite(title, slug)) {
				favMark.hide();
			}
			video.append(favMark);
			*/
			video.append(thumb);
			video.append('<h1>'+r.title+'</h1>');
			if (r.id !== undefined) {
				video.append('<div style="display:none;" class="video_id">'+r.id+'</div>');
			}
			video.append('<div style="display:none;" class="video_slug">'+slug+'</div>');

			if (i > 12) {
				video.hide();
			}
			else {
				// Load visible thumbs
				new Image().load(thumb);
			}
			
			grid.append(video);
		}

		return grid;
	}

	this.build = function (data) {

		$('#videos').remove();

		var videos = $('<div id="videos" />');

		videos.append('<div class="spacer left-hfill"/>');

		var menu = $('<div id="vod-menu" />');
		menu.append('<h1>DR NU MENU</h1>');
		
		var menu_elements = $('<ul />');
		menu_elements.append('<li>Nyeste<span class="cmd hidden">newest</span></li>');
		menu_elements.append('<li>Mest Populære<span class="cmd hidden">mostviewed</span></li>');
		menu_elements.append('<li>Favoritter<span class="cmd hidden">favorites</span></li>');
		menu_elements.append('<li>Alle Programmer<span class="cmd hidden">programs</span></li>');
		
		menu.append(menu_elements);

		videos.append(menu);

		var container = $('<div id="vod-container" />');

		container.append('<h1>AFSNIT</h1>');

		container.append(buildVideoGrid(data));
		videos.append(container);

		$('body').append(videos);
		
		setTimeout(function() {
			$('#videos').css('top', '0');
		}, 0);
	};

	function activateMenu() {
		// Reset grid indices
		currentPaginationIdx = 0;
		currentSelectedVideoIdx = 0;

		menuActive = true;

		if ($('#vod-menu .selected').length === 0) {
			$('#vod-menu li').eq(0).addClass('selected');
		}

		$('#vod-menu .selected').removeClass('inactive');
		$('#vod-grid .selected').addClass('inactive');
	}

	function activateGrid() {
		menuActive = false;

		$('#vod-menu .selected').addClass('inactive');
		$('#vod-grid .selected').removeClass('inactive');
	}

	// ************************************************
	// Menu movement
	// ************************************************

	function moveVideoSelection(direction) {
        var videos = $('#vod-grid').children();
        for (var i = 0; i < videos.length; i++) {
            var video = $(videos[i]);
            
            if (video.hasClass('selected')) {
                if (i === 0 && direction < 0) {
                    return;
                }
                if (i+direction >= videos.length) {
                    return;
                }
                if (i+direction < 0) {
					return;
                }

				var delta = i + direction;

                // Check if we move out of the view block in the bottom
                if (delta >= currentPaginationIdx + 11 && direction > 0) {
					for (var j = currentPaginationIdx, k = -(i % 4); j < currentPaginationIdx+direction; j++, k++) {
						$(videos[j]).hide();
						$(videos[delta+k]).show();

						new Image().load($(videos[delta+k]));
					}
					currentPaginationIdx += direction;
                }

                // Check if we move out of the view block in the top
                if (delta < currentPaginationIdx && direction < 0) {
					for (var m = currentPaginationIdx, n = -(i % 4); m < currentPaginationIdx+(-direction); m++, n++) {
						$(videos[delta+n]).show();
						$(videos[m+11]).hide();
					}

                    currentPaginationIdx += direction;
                }

                // Set the new selected element
                video.removeClass('selected');
                $(videos[delta]).addClass('selected');
                // Selected index in the visible 4x3 view
                currentSelectedVideoIdx = delta - currentPaginationIdx; 
                break;
            }
        }
    }

    function moveVideoMenuSelection(direction) {
        var videos = $('#vod-menu ul').children();
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

    function search(term) {
        var encodedSearchTerm = encodeURIComponent(term).replace(/\+/g, '%20');
        $.getJSON('http://www.dr.dk/nu/api/search/' + encodedSearchTerm + "?callback=?", function(data) {
            scope.build(data);
        });
    }

	// ************************************************
	// Visibility
	// ************************************************

	this.hide = function () {
		// Move offscreen
		$('#videos').css('top', '720px');	
		
		// Remove only after the CSS3 transision is complete
		setTimeout(function() {
			$('#videos').hide();
        }, 1000);

        currentPaginationIdx = 0;
	};

/*
	this.show = function () {
		$('#videos').css('top', '0');	
	};
*/

	this.show = function () {
		player.getItem(function(item) {
			var title = new Title(item.title).getName();
			search(title);
		});
	};

	// ************************************************
	// Navigation
	// ************************************************

	this.up = function () {
		if (menuActive) {
			moveVideoMenuSelection(-1);
		}
		else {
			moveVideoSelection(-4);
		}
	};

	this.down = function () {
		if (menuActive) {
			moveVideoMenuSelection(1);
		}
		else {
			moveVideoSelection(4);
		}
	};

	this.left = function () {

		if (menuActive) {
			return;
		}

		if (currentSelectedVideoIdx % 4 === 0) {
			activateMenu();
		}
		else {
			moveVideoSelection(-1);	
		}
	};

	this.right = function () {
		if (menuActive) {
			activateGrid();
		}
		else {
			if (currentSelectedVideoIdx % 4 === 3) {
				return;
			}
			moveVideoSelection(1);
		}
	};

	this.enter = function () {
		if (menuActive) {
			load();
		}
		else {
			var selectedVideo = $('#videos').find('.selected');
			var videoIdElement = selectedVideo.children('.video_id');
			if (videoIdElement.length === 0) {
				var videoSlugElement = selectedVideo.children('.video_slug');
				var videoSlug = videoSlugElement.html();

				load("programs.php/"+videoSlug+"/videos");
				return;
			}

			var videoId = videoIdElement.html();

			player.play({videoId: videoId });
			this.hide();
		}
	};
}
