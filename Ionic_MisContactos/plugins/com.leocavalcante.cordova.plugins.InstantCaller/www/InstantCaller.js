var InstantCaller = {
	call: function(number, sucessCallback, errorCallback) {
		cordova.exec(sucessCallback, errorCallback, 'InstantCaller', 'call', [number]);
	}
};

module.exports = InstantCaller;