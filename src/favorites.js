function Favorites() {
}

Favorites.prototype.toggleFavorite = function () {
	var selectedVideo = $('#videos').find('.selected');
	var videoSlugElement = selectedVideo.children('.video_slug');
	
    if (videoSlugElement.length === 0) {
        return;
    }
    
    var title = selectedVideo.children('.title').html();
    var videoSlug = videoSlugElement.html();
    
    
    if (this.isFavorite(title,videoSlug)) {
        this.removeFavorite(title, videoSlug);
        selectedVideo.find('.favorite').hide();
    }
    else {
        this.addFavorite(title, videoSlug);
        selectedVideo.find('.favorite').show();
    }
};

Favorites.prototype.isFavorite = function (title,slug) {
	return $.inArray(title+':::'+slug, this.getFavorites()) > -1;
};

Favorites.prototype.getFavorites = function () {
	var favorites = $.cookie("boxee_dr_live_tv_favorites");
	if (favorites !== null) {
		return favorites.split(",");
	}
	return [];
};

Favorites.prototype.addFavorite = function (title, slug) {
	var favorites = this.getFavorites();
	
	favorites.push(title+':::'+slug);
	
	$.cookie("boxee_dr_live_tv_favorites", favorites, { expires: 1500 });

};

Favorites.prototype.removeFavorite = function (title, slug) {
	var favorites = this.getFavorites();
	
	var idx = favorites.indexOf(title+':::'+slug);
	if (idx < 0) {
		return;
	}
	
	favorites.splice(idx, 1);
	
	$.cookie("boxee_dr_live_tv_favorites", favorites, { expires: 1500 });
};
