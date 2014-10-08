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

            $scope.error = null;

            this.sendAuthToken = function(transport, token) {
                chatWebsocketTransportService.sendMessage(transport, {
                    "type":"token","message":{"value":token}
                });
            };

            this.sendChatRequest = function(transport, nickname, subject) {
                chatWebsocketTransportService.sendMessage(transport, {
                    "type": "chat_request","message": {
                        "operationName": "chat request",
                        "nickname": nickname,
                        "subject": subject
                    }
                })
            };

            this.sendChatMessage = function(transport, text) {
                chatWebsocketTransportService.sendMessage(transport, {
                    "type": "chat_client_message","message": {
                        "operationName": "SendMessage",
                        "text": text
                    }
                })
            };

            if (!$scope.config || !$scope.config.webSocketAddr || !$scope.config.token) {
                $log.warn("Invalid websocket configuration " + $scope.config);
                $scope.error = "Invalid websocket configuration. Please contact administrator.";
                return;
            }

            var url = $scope.config.webSocketAddr + '/gcfd/websockets/messaging';

            var transport = chatWebsocketTransportService.connect(url,
                {
                    'onopen' : function(event) {
                        $log.info("Connection is established. Sending token...");
                        this.sendAuthToken(transport, $scope.config.token);
                        $timeout(function() {
                            this.sendChatRequest(transport, 'nickname', 'subject');
                        }.bind(this), 10);
                    }.bind(this),
                    'onmessage' : function(event) {
                        // TODO...
                    },
                    'onclose' : function(event) {

                    },
                    'onerror' : function(event) {
                        $scope.error = event;
                    }
                });

            if (!transport) {
                // TODO: failed to create 
            } else {

                $scope.sendMessage = function () {
                    this.sendChatMessage(transport, $scope.messageText);
                    $scope.messageText = "";
                }.bind(this);

                $scope.disconnect = function() {
                    $log.info("Chat is disconnecting...");
                    chatWebsocketTransportService.disconnect(transport);
                }

                // var side = 'left';

                // // Messages, client info & sending
                // $scope.messages = [];

                // Occurs when we receive chat messages
                // server.ngChatMessagesInform = function (p) {
                //     $scope.messages.push({
                //         avatar: "data:image/png;base64," + p.avatar.toBase64(),
                //         text: p.message,
                //         side: side
                //     });
                //     $scope.$apply();

                //     // Animate
                //     $("#viewport-content").animate({
                //         bottom: $("#viewport-content").height() - $("#viewport").height()
                //     }, 250);

                //     // flip the side
                //     side = side == 'left' ? 'right' : 'left';
                // };

                var notifications;

                function getNotificationId(fullPrefName) {
                    var id = Math.floor(Math.random() * 9007199254740992) + 1;
                    var idStr = id.toString();
                    notifications[idStr] = fullPrefName;
                    return idStr;
                }

                this.sendNotification = function(msg) {
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

            }

        }]
    ) 