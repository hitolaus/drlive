/*global test:true, equal:true*/
test('Load sub images', function() {
	var container = $('<div/>');
	container.append('<img src="" data-src="test" />');

	new Image().load(container);

	var img = $(container.find('img')[0]); 
	equal(img.attr('src'), 'test');
});

test('Load image', function() {
	var img = $('<img src="" data-src="test" />');

	new Image().load(img);

	equal(img.attr('src'), 'test');
});