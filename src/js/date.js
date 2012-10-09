function formatTimeComponent(i) {
	if (i < 10) {
        i = "0" + i;
    }
    return i;
}

Date.prototype.getFormattedTime = function () {
    return formatTimeComponent(this.getHours()) + ':' + formatTimeComponent(this.getMinutes());
};

Date.prototype.getFormattedHour = function () {
	return formatTimeComponent(this.getHours()) + ':00';
};

Date.parseJsonDate = function (jsonDate) {
    var offset = new Date().getTimezoneOffset() * 60000,
        parts  = /\/Date\((-?\d+)([+\-]\d{2})?(\d{2})?.*/.exec(jsonDate);

    if (parts[2] === undefined) {
        parts[2] = 0;
    }
    
    if (parts[3] === undefined) {
        parts[3] = 0;
    }
    
    return new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
};

/**
 * Return a Javascript Date for the given XML Schema date string.  Return
 * null if the date cannot be parsed.
 *
 * Does not know how to parse BC dates or AD dates < 100.
 *
 * Valid examples of input:
 * 2010-04-28T10:46:37.0123456789Z
 * 2010-04-28T10:46:37.37Z
 * 2010-04-28T10:46:37Z
 * 2010-04-28T10:46:37
 * 2010-04-28T10:46:37.012345+05:30
 * 2010-04-28T10:46:37.37-05:30
 * 1776-04-28T10:46:37+05:30
 * 0150-04-28T10:46:37-05:30
 *
 * Ref: http://stackoverflow.com/questions/2731579/convert-an-xml-schema-date-string-to-a-javascript-date
 */
Date.parseXmlDate = function(xmlDate) {
	// It's times like these you wish Javascript supported multiline regex specs
	var re = /^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]+)?(Z|([+\-])([0-9]{2}):([0-9]{2}))?$/,
        match = xmlDate.match(re);
    
	if (!match) {
		return null;
	}
	
	var all = match[0];
	var year = match[1];  var month = match[2];  var day = match[3];
	var hour = match[4];  var minute = match[5]; var second = match[6];
	var milli = match[7]; 
	var z_or_offset = match[8];  var offset_sign = match[9]; 
	var offset_hour = match[10]; var offset_minute = match[11];
	
	// The DR timestamp is totally screwed up in regards to timezone so we ignore
	// the timezone offset (which _is_ specified) and just use the time as-is. 
	/*
	if (offset_sign) { // ended with +xx:xx or -xx:xx as opposed to Z or nothing
		var direction = (offset_sign == "+" ? 1 : -1);
		hour   = parseInt(hour)   + parseInt(offset_hour)   * direction;
		minute = parseInt(minute) + parseInt(offset_minute) * direction;
	}
	var utcDate = Date.UTC(year, month, day, hour, minute, second, (milli || 0));
	return new Date(utcDate);
	*/
	return new Date(year, month, day, hour, minute, second, (milli || 0));
};