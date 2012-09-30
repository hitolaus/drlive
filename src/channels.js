function Channels() {
	this.channels = ["dr1", "dr2", "ramasjang", "drk", "drupdate", "drhd"];
}

Channels.prototype.getCleanName = function (idx) {
	return this.channels[idx];
};
