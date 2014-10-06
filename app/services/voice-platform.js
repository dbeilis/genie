function VoicePlatform(){

	var voicePlatformUri = "https://genesysvoice.com:8080" + "/gcfd/servlets";

	var sendNetworkRequest = function(request, success, failure) {

	};

	this.me = function() {
		sendNetworkRequest("/chats/me", success, failure);
	};

	this.call = function(email) {
		sendNetworkRequest("/chats/me", success, failure);
	};

	this.auth = function(pin) {
		sendNetworkRequest("/chats/me", success, failure);
	};

	this.logout = function() {
		sendNetworkRequest("/chats/logout" success, failure);
	};

};