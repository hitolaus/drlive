/**
 * Player.
 *
 * @author Jakob Hilarius, http://syscall.dk
 */
function Player(watcher) {
    
    this.activeItem = {
        'type': 'channel',
        'channel': 'dr1'
    };
    this.state = {
        'currentChannelIdx': 0
    };
}

/**
 * Plays a video item or channel.
 * Video:
 * <code>
 *  {
 *    videoId: 1234
 *  }
 * </code>
 * Channel:
 * <code>
 *  {
 *    channel: "dr1",
 *    idx: 0
 *  }
 * </code>
 */
Player.prototype.play = function(item) {
    if (item.videoId !== undefined) {
        var scope = this;
        $.get('api/video.php?id=' + item.videoId, function (data) {
            var s = data.url.indexOf("mp4:");
            
            var streamer = data.url.substring(0, s - 1);
            var file = data.url.substring(s);

            var currentVodStartTime = new Date();
            var currentVodEndTime = new Date(currentVodStartTime);
                
            var durationComponents = data.duration.split(':');
            currentVodEndTime.setHours(currentVodStartTime.getHours() + parseInt(durationComponents[0], 10));
            currentVodEndTime.setMinutes(currentVodStartTime.getMinutes() + parseInt(durationComponents[1], 10));
            currentVodEndTime.setSeconds(currentVodStartTime.getSeconds() + parseInt(durationComponents[2], 10)); 

            // We are no longer viewing any channel
            scope.state.currentChannelIdx = -1;

            scope.activeItem = {
                'type': 'video',
                'file': file,
                'streamer': streamer,
                'title': data.title,
                'description': data.description,
                'startTime': currentVodStartTime,
                'endTime': currentVodEndTime,
                'icon': ''
            };


            jwplayer().load({ file: scope.activeItem.file, streamer: scope.activeItem.streamer, provider:"rtmp" });
        }).error(function () { console.log('ERROR'); });

	}
	else if (item.channel !== undefined) {

        var channel = item.channel;

        this.activeItem.channel = channel;
        this.activeItem.type = 'channel';

        this.state.currentChannelIdx = item.idx;

        jwplayer().load("playlists/" + channel + ".xml");
	}
};

Player.prototype.next = function() {
	jwplayer().playlistNext();
};

Player.prototype.previous = function() {
	jwplayer().playlistPrev();
};

Player.prototype.getItem = function(callback) {
    if (this.activeItem.type === 'channel') {
        var scope = this;

        // Shows on a channel change over time so we need to reload info
        // on request.
        var ts = new Date().getTime();
        $.getJSON('http://www.dr.dk/nu/api/nownext?ts=' + ts + "&callback=?", function (data) {
            var channelId = scope.activeItem.channel;
            var idx = scope.state.currentChannelIdx;

            var channel = data.channels[idx];
            
            var title = "Ingen udsendelse pt"; 
            var description = "";
            var start = "";
            var end = "";
            
            if (channel != null) {
                if (channel.current != null) {
                    if (channel.current.programTitle != null) {
                        title = channel.current.programTitle;
                    }

                    if (channel.current.description != null) {
                        description = channel.current.description;
                    }

                    start = Date.parseXmlDate(channel.current.start);
                    end   = Date.parseXmlDate(channel.current.end);
                }
                else if (channel.next != null) {
                    // current program is sometime undefined in a transitioning state
                    // so we use the next program in that case
                    if (channel.next.programTitle != null) {
                        title = channel.next.programTitle;
                    }

                    if (channel.next.description != null) {
                        description = channel.next.description;
                    }

                    start = Date.parseXmlDate(channel.next.start);
                    end   = Date.parseXmlDate(channel.next.end);
                }
            }
            
            scope.activeItem = {
                'type': 'channel',
                'title': title,
                'description': description,
                'startTime': start,
                'endTime': end,
                'icon': 'images/' + channelId + '.gif'
            };


            callback(scope.activeItem);
        }).error(function () { console.log('ERROR'); });
    }
    else {
        // Meta data was loaded on the play request so we return the data immediately.
        callback(this.activeItem);
    }
};

Player.prototype.getState = function(callback) {
    callback(this.state);
};
