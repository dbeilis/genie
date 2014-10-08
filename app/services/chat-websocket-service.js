'use strict';

angular.module('genie')
    .factory('chatWebsocketTransportService', function($resource, $http, $log) {

    	var ChatWebsocketTransportService = function() {

			this.connect = function(url, handlers) {
				$log.info("Creating websocket - " + url);

				var ws = null;

				if ('WebSocket' in window) {
					ws = new WebSocket(url);
				} else {
					$log.info('WebSocket is not supported by this browser.');
					ws = null;
					return;
				}
				ws.onopen = function(event) {
					$log.info('WebSocket connection opened.');
					handlers.onopen();
				};
				ws.onmessage = function(event) {
					$log.info('Websocket message received: ' + event.data);
					handlers.onmessage(event);
				};
				ws.onclose = function(event) {
					$log.info('WebSocket connection closed.');
					handlers.onclose();
				};
				ws.onerror = function(event) {
					$log.info("Websocket error " + event);
					handlers.onerror(event);
				}

				return ws;
			};

			this.sendMessage = function(ws, message) {
				$log.info("Sending message - " + JSON.stringify(message));
				if (ws !== null) {
					ws.send(JSON.stringify(message));
				}
			};

			this.disconnect = function(ws) {
				$log.info("Disconnecting...");
				if (ws !== null) {
					ws.close();
					ws = null;
				}
			};
		};

		return new ChatWebsocketTransportService();

	});