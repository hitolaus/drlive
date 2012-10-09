function Image() {
	
}

 // Load image offscreen and replace placeholder
Image.prototype.load = function (node) {
	var images = [];

	if (node.is('img')) {
		images = [ node ];
	}
	else {
		images = node.find('img');	
	}

    var errorReset = function() {
        $(this).error(function() {});
        $(this).attr("src", placeholder);
    };

	for (var i = 0; i < images.length; i++) {
		var image = $(images[i]);
        var placeholder = image.attr('src');
		var src = image.attr('data-src');
		if (src != null) {
            image.error(errorReset);
			image.attr("src", src);
		}
	}
};