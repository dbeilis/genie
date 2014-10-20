angular.module('chat',[])
    .directive('chatView', function($log){
    	return {
            templateUrl: 'modules/chat/chat-view.html',
            restrict: 'E',
            transclude: true,
            scope: {
                config: "="
            },
            link: function(scope) {
                $log.info("Rendering chat with the following conifg " + JSON.stringify(scope.config));
    	    }
        };
    })
    .controller('ChatController', ['$scope', '$rootScope', '$log', '$timeout', 'chatWebsocketTransportService', 
        function($scope, $rootScope, $log, $timeout, chatWebsocketTransportService) {

            $scope.messages = [];

            $scope.error = null;

            $rootScope.$on('SEND_MSG_TMA', function(scope, msg) {
                this.sendChatMessage("tma " + msg);
            }.bind(this));

            $scope.sendMessage = function () {

                var text = $scope.messageText;
                if (text && text.toLowerCase().indexOf('tma') < 0 && text.toLowerCase().indexOf('tell') < 0 && text.length > 5)  {
                    text = "Tell me about " + text;
                }

                this.sendChatMessage(text);
                $scope.messageText = "";
            }.bind(this);

            $scope.refresh = function() {
                $log.info("Chat is reconnecting...");
                chatWebsocketTransportService.refresh();
            };

            $scope.disconnect = function() {
                $log.info("Chat is disconnecting...");
                chatWebsocketTransportService.disconnect();
            };

            this.sendAuthToken = function(token) {
                chatWebsocketTransportService.sendMessage({
                    "type":"token","message":{"value":token}
                });
            };

            this.sendChatMessage = function(text) {
                chatWebsocketTransportService.sendMessage({
                    "type": "chat_client_message","message": {
                        "operationName": "SendMessage",
                        "text": text
                    }
                })
            };

            this.renderEvent = function(event) {

                var data = JSON.parse(event.data);

                if (data && data.type === 'chat_server_message') {
                    if (data.message && data.message.participant && data.message.text) {
                        var side = 'right';
                        if (data.message.participant.type === 'Customer') {
                            side = 'left';
                        }

                        $scope.messages.push({
                            avatar: "images/avatar.png",
                            msgType: data.message.msgType,
                            text: data.message.text,
                            side: side
                        });
                        $scope.$apply();

                        // Animate
                        $("#viewport-content").animate({
                            bottom: $("#viewport-content").height() - $("#viewport").height() + 10
                        }, 250);
                    }
                }

            };

            this.connect = function(url) {
                $log.info("Starting websocket connection to " + url);
                chatWebsocketTransportService.connect(url, {
                    'onopen' : function(event) {
                        $log.info("Connection is established. Sending token...");
                        this.sendAuthToken($scope.config.token);
                    }.bind(this),
                    'onmessage' : function(event) {
                        this.renderEvent(event);
                    }.bind(this),
                    'onclose' : function(event) {
                    }.bind(this),
                    'onerror' : function(event) {
                        $scope.error = event;
                    },
                    'onconnecting' : function(event) {
                        $log.info("Connecting to " + url);
                    }
                });

            }.bind(this);

            if (!$scope.config || !$scope.config.webSocketAddr || !$scope.config.token) {
                $log.warn("Invalid websocket configuration " + $scope.config);
                $scope.error = "Invalid websocket configuration. Please contact administrator.";
                return;
            }

            var url = $scope.config.webSocketAddr + '/gcfd/websockets/messaging';
            this.connect(url);

        }]
    ) 