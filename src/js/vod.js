function VOD(favorites) {
	this.currentVideoBeginIdx = 0;
	this.favorites = favorites;

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
                if (i >= this.currentVideoBeginIdx + 4 && direction > 0) {
                    $(videos[this.currentVideoBeginIdx]).hide();
                    $(videos[i+1]).show();
                    new Image().load($(videos[i+1]));
                    this.currentVideoBeginIdx++;
                }
                // Check if we move out of the view block to the left
                if (i <= this.currentVideoBeginIdx && direction < 0) {
                    $(videos[i-1]).show();
                    $(videos[this.currentVideoBeginIdx+4]).hide();
                    this.currentVideoBeginIdx--;
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

	this.load = function (path) {
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
			this.build(data);
		});
	};

	this.build = function (data) {
		this.currentVideoBeginIdx = 0;

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
			
			if (!this.favorites.isFavorite(title, slug)) {
				favMark.hide();
			}
			video.append(favMark);
			video.append(thumb);
			video.append('<div class="title">'+r.title+'</div>');
			if (r.id !== undefined) {
				video.append('<div style="display:none;" class="video_id">'+r.id+'</div>');
			}
			video.append('<div style="display:none;" class="video_slug">'+slug+'</div>');

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

		$('#video_menu_inactive').show();
		
		videos.css('top', '452px');
		//$('#video_menu_inactive').css('top', '428px');
	};

	this.up = function () {
		this.moveVideoSelection(-1);
	};

	this.down = function () {
		this.moveVideoSelection(1);
	};

	this.hide = function () {
		hideVideosMenu(true);
		$('#videos').css('top', '720px');

        $('#video_menu_inactive').hide();
        $('#videos_spacer').hide();
        $('#videos').hide();
        this.currentVideoBeginIdx = 0;
	};

	this.show = function () {
		$('#videos').css('top', '452px');
	};
}
