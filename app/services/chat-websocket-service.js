'use strict';

angular.module('genie')
    .factory('chatWebsocketTransportService', function($resource, $http, $log) {

    	var ChatWebsocketTransportService = function() {

    		var ws = null;

			this.connect = function(url, handlers) {
				$log.info("Creating websocket - " + url);

				if ('WebSocket' in window) {
					ws = new WebSocket(url);
				} else {
					$log.info('WebSocket is not supported by this browser.');
					this.ws = null;
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

			this.sendMessage = function(_ws, message) {
				$log.info("Sending message - " + JSON.stringify(message));
				
				if (_ws == null) {
					_ws = ws;
				}

				if (_ws !== null) {
					_ws.send(JSON.stringify(message));
				} 
			};

			this.disconnect = function(_ws) {
				$log.info("Disconnecting...");

				if (_ws == null) {
					_ws = ws;
				}

				if (_ws !== null) {
					_ws.close();
					_ws = null;
				}

			};
		};

		return new ChatWebsocketTransportService();

	});