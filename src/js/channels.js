function Channels() {
	var channels = ["dr1", "dr2", "ramasjang", "drk", "drupdate", "dr3"];

	this.getCleanName = function (idx) {
		return channels[idx];
	};

	this.size = function () {
		return channels.length;
	};

}