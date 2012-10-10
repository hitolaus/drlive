function Channels() {
	var channels = ["dr1", "dr2", "ramasjang", "drk", "drupdate", "drhd"];

	this.getCleanName = function (idx) {
		return channels[idx];
	};

	this.size = function () {
		return channels.lenght;
	};

}