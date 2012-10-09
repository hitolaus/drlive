function Title(rawTitle) {
	function analyze(rawTitle) {
		var minIdx = 100000;
		var i = -1;

		i = rawTitle.indexOf(":");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		i = rawTitle.indexOf("(");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		i = rawTitle.indexOf("[");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		i = rawTitle.indexOf("-");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		if (minIdx < 100000) {
			return rawTitle.substring(0, minIdx);
		}
		else {
			return rawTitle;
		}
	}

	this.name = analyze(rawTitle);
}

Title.prototype.getName = function() {
	return this.name;
};