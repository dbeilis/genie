function Transport_WebSocket(oOptions){
    'use strict';

    if(!oOptions || (oOptions && !oOptions.id))return false;

    var notifications = {};
	var ws;
	connect();

	function connect() {
		var target = 'wss://genesysvoice.com:8080/gcfd/websockets/messaging';
		if ('WebSocket' in window) {
			ws = new WebSocket(target);
		} else {
			console.log('WebSocket is not supported by this browser.');
			return;
		}
		ws.onopen = function() {
			console.log('Info: WebSocket connection opened.');
		};
		ws.onmessage = function(event) {
			console.log('Received: ' + event.data);
			sendNotification(event.data);
		};
		ws.onclose = function() {
			console.log('Info: WebSocket connection closed.');
		};
	}

	function disconnect() {
		if (ws != null) {
			ws.close();
			ws = null;
		}
	}

	function getNotificationId(fullPrefName) {
		var id = Math.floor(Math.random() * 9007199254740992) + 1;
		var idStr = id.toString();
		notifications[idStr] = fullPrefName;
		return idStr;
	}

	function sendNotification(msg) {
		var json = JSON.parse(msg);
		chrome.notifications.create(getNotificationId(json.fullPrefName), {
			title : 'New email',
			iconUrl : 'icon_128.png',
			type : 'basic',
			message : json.message
		}, creationCallback);
	}

	function creationCallback(notID) {
		console.log("Succesfully created " + notID + " notification");
	}
};
