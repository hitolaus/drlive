/**
 * Clock.
 *
 * @author Jakob Hilarius, http://syscall.dk
 */
function Clock() {

}

Clock.prototype.show = function() {
	var now = new Date();

	$('#clock').remove();
	
	$('body').append('<div id="clock"></div>');
	
	$('#clock').append('<span class="icon clock"></span>');
	$('#clock').append(now.getFormattedTime());
	
	// TODO: Nessasary?
	$('#clock').show();
};

Clock.prototype.hide = function() {
    $('#clock').hide();
};