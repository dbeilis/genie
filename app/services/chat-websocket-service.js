'use strict';

angular.module('genie')
    .factory('chatWebsocketTransportService', function($resource, $http, $log) {

    	var ChatWebsocketTransportService = function() {

    		this.reconnectInterval = 1000;
	        this.reconnectDecay = 1.5;
	        this.reconnectAttempts = 0;
	        this.timeoutInterval = 2000;

	        var self = this;
	        var ws;
	        var url; 
	        var handlers;

	        var forcedClose = false;
	        var timedOut = false;

	        this.readyState = WebSocket.CONNECTING;

	        function connect(reconnectAttempt) {
	        	ws = new WebSocket(url);
            
	            if(!reconnectAttempt)
	                handlers.onconnecting();
	                
				$log.debug('ReconnectingWebSocket', 'attempt-connect', url);
	            
	            var localWs = ws;
	            var timeout = setTimeout(function() {
	                $log.debug('ReconnectingWebSocket', 'connection-timeout', url);
	                timedOut = true;
	                localWs.close();
	                timedOut = false;
	            }, self.timeoutInterval);
	            
	            ws.onopen = function(event) {
	                clearTimeout(timeout);
	                $log.debug('ReconnectingWebSocket', 'onopen', url);
	                self.readyState = WebSocket.OPEN;
	                reconnectAttempt = false;
	                self.reconnectAttempts = 0;
	                handlers.onopen(event);
	            };
	            
	            ws.onclose = function(event) {
	                clearTimeout(timeout);
	                ws = null;
	                if (forcedClose) {
	                    self.readyState = WebSocket.CLOSED;
	                    handlers.onclose(event);
	                } else {
	                    self.readyState = WebSocket.CONNECTING;
	                    handlers.onconnecting();
	                    if (!reconnectAttempt && !timedOut) {
	                        $log.debug('ReconnectingWebSocket', 'onclose', url);
	                        handlers.onclose(event);
	                    }
	                    setTimeout(function() {
	                        self.reconnectAttempts++;
	                        connect(true);
	                    }, self.reconnectInterval * Math.pow(self.reconnectDecay, self.reconnectAttempts));
	                }
	            };

	            ws.onmessage = function(event) {
	                $log.debug('ReconnectingWebSocket', 'onmessage', url, event.data);
	                handlers.onmessage(event);
	            };

	            ws.onerror = function(event) {
	                $log.debug('ReconnectingWebSocket', 'onerror', url, event);
	                handlers.onerror(event);
	            };
	        }

			this.connect = function(_url, _handlers) {
				$log.info("Creating websocket - " + _url);

				url = _url;
				handlers = _handlers;
				connect(false);
			};

			this.sendMessage = function(message) {
				$log.info("Sending message - " + JSON.stringify(message));
				
				if (ws) {
					ws.send(JSON.stringify(message));
				} else {
                	throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
				}
			};

			this.disconnect = function() {
				$log.info("Disconnecting...");

				forcedClose = true;
				if (ws) {
					ws.close();
					ws = null;
				} 

			};

			/**
	         * Additional public API method to refresh the connection if still open (close, re-open).
	         * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
	         */
	        this.refresh = function() {
	            if (ws) {
	                ws.close();
	                ws = null;
	            }
	        };
		};

		return new ChatWebsocketTransportService();

	});