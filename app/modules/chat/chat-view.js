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
    .controller('ChatController', ['$scope', '$log', '$timeout', 'chatWebsocketTransportService', 
        function($scope, $log, $timeout, chatWebsocketTransportService) {

            $scope.messages = [];

            $scope.error = null;

            $scope.sendMessage = function () {
                this.sendChatMessage(transport, $scope.messageText);
                $scope.messageText = "";
            }.bind(this);

            $scope.disconnect = function() {
                $log.info("Chat is disconnecting...");
                chatWebsocketTransportService.disconnect(transport);
            }

            this.sendAuthToken = function(transport, token) {
                chatWebsocketTransportService.sendMessage(transport, {
                    "type":"token","message":{"value":token}
                });
            };

            this.sendChatMessage = function(transport, text) {
                chatWebsocketTransportService.sendMessage(transport, {
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
                            bottom: $("#viewport-content").height() - $("#viewport").height()
                        }, 250);
                    }
                }

            };

            this.connect = function(url) {
                $log.info("Starting websocket connection to " + url);
                var transport = chatWebsocketTransportService.connect(url,
                    {
                        'onopen' : function(event) {
                            $log.info("Connection is established. Sending token...");
                            this.sendAuthToken(transport, $scope.config.token);
                        }.bind(this),
                        'onmessage' : function(event) {
                            this.renderEvent(event);
                        }.bind(this),
                        'onclose' : function(event) {
                            this.connect(url);
                        },
                        'onerror' : function(event) {
                            $scope.error = event;
                        }
                    });

                return transport;
            }.bind(this);

            if (!$scope.config || !$scope.config.webSocketAddr || !$scope.config.token) {
                $log.warn("Invalid websocket configuration " + $scope.config);
                $scope.error = "Invalid websocket configuration. Please contact administrator.";
                return;
            }

            var url = $scope.config.webSocketAddr + '/gcfd/websockets/messaging';
            var transport = this.connect(url);

        }]
    ) 