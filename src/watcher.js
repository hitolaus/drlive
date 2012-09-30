function Watcher() {
}

Watcher.prototype.loadWatcherCount = function(elementId, channelIdx) {
	$.get('api/watchers.php?channel='+channelIdx+'&ts='+new Date().getTime(), function(data) {
		$(elementId).find('#'+data.channel).find('.watchers').html(data.count);
	});
};

Watcher.prototype.watching = function(channelIdx) {
	$.get('api/watchers.php?channel='+channelIdx+'&update=t&ts='+new Date().getTime(), function(data) {
	});
};