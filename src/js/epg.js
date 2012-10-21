/**
 * EPG service.
 *
 * @author Jakob Hilarius, http://syscall.dk
 */
function Epg() {
    // Register last epg load time to minimize EPG calls
    this.EPG_UPDATE_INTERVAL_IN_MILLIS = 30000; 
    
    this.lastEpgUpdate = 0;
    
    this.channels = new Channels();
}

/**
 * Loads the EPG into the element specified by elementId.
 *
 * @param elementId The id of the element where to load the EPG.
 * @param currentChannelIdx The current selected channel.
 */
Epg.prototype.loadGuide = function(elementId, currentChannelIdx) {
	var now = new Date().getTime();

	if (now - this.EPG_UPDATE_INTERVAL_IN_MILLIS < this.lastEpgUpdate) {
		return;
	}

	// Register scope for the callback function
    var scope = this;
    
	$.getJSON('http://www.dr.dk/nu/api/nownext?ts='+now+'&callback=?', function(data) {
		$(elementId).empty();
		
		var start = new Date();
		var end   = new Date(start.getTime() + 3600000);

		$(elementId).append('<div id="title">'+start.getFormattedHour()+' - ' + end.getFormattedHour() + '</div>');

		var channels = data.channels;
		for (var i = 0; i < channels.length; i++) {
			var channel = channels[i];

			var channelTitle = '<img src="images/'+scope.channels.getCleanName(i)+'.png" alt="'+channel.channel+'" />';

			var title =  "Ingen udsendelse pt"; 
			if (channel.current != null && channel.current.programTitle != null) {
				title = channel.current.programTitle;
			}
			var nextTitle = "";
			if (channel.next != null && channel.next.programTitle != null) {
				var timeToNextProgramStart = (channel.next.startTS - channel.next.currentServerTimeTS)/1000/60; 
				nextTitle = '<span class="next_title">' + channel.next.programTitle + '</span> starter om ' + Math.round(timeToNextProgramStart) + ' min.';
			}
			var active = (i === currentChannelIdx) ? "active" : "";

			$(elementId).append('<div id="'+i+'" class="item '+active+'"><div class="channel">'+channelTitle+'</div><div class="description"><div class="now">'+title+'</div><div class="next">'+nextTitle+'</div></div><div class="watchers">0</div></div>');
		}

		scope.lastEpgUpdate = new Date().getTime();
	}).error(function() {
		$(elementId).empty();
		$(elementId).append('<div id="error">Problem med TV guiden!</div>');
	});
};

Epg.prototype.loadChannelInfo = function (elementId, activeIdx) {
	var channelId = this.channels.getCleanName(activeIdx);

	var ts = new Date().getTime();
    $.getJSON('http://www.dr.dk/nu/api/nownext?ts=' + ts + "&callback=?", function (data) {
        var idx = activeIdx;

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

		var timeFrame = start.getFormattedTime()+' - '+ end.getFormattedTime();

		var iconDiv  = '<div class="channel"><img src="images/'+channelId+'.gif" alt="'+title+'" /></div>';
		var timeDiv  = '<div class="time">' + timeFrame + '</div>';
		var titleDiv = '<div class="title">'+title+'</div>';
		var descDiv  = '<div class="summary">'+description+'</div>';
		var iconsDiv = '<div class="icons"></div>';
        
		$(elementId).empty();
		$(elementId).append(iconDiv+timeDiv+titleDiv+descDiv+iconsDiv);

    }).error(function () { console.log('ERROR'); });
};

Epg.prototype.getActiveShow = function(currentChannelIdx, callback) {
	var now = new Date().getTime();
    
    $.getJSON('http://www.dr.dk/nu/api/nownext?ts='+now+'&callback=?', function(data) {
        var channel =  data.channels[currentChannelIdx];

		var rawTitle = "Ingen udsendelse";
        if (channel != null) {
			if (channel.current != null) {
				rawTitle = channel.current.programTitle;
			}
			else if (channel.next != null) {
				rawTitle = channel.next.programTitle;
			}
			
		}
		var title = new Title(rawTitle).getName();

        callback(title);
    });
};