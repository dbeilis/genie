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

            var notID = 0;

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

            $scope.callme = function() {
                $log.info("Call me is launched...");
                this.sendChatMessage("call me");
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

            function creationCallback(notID) {
                $log.debug("Succesfully created " + notID + " notification");
                $timeout(function() {
                    chrome.notifications.clear(notID, function(wasCleared) {
                        $log.debug("Notification " + notID + " cleared: " + wasCleared);
                    });
                }, 15000);
            }

            // Event handlers for the various notification events
            function notificationClosed(notID, bByUser) {
                $log.debug("The notification '" + notID + "' was closed" + (bByUser ? " by the user" : ""));
            }

            function notificationClicked(notID) {
                $log.debug("The notification '" + notID + "' was clicked");
            }

            function notificationBtnClick(notID, iBtn) {
                $log.debug("The notification '" + notID + "' had button " + iBtn + " clicked");
            }

            var loadImage = function(uri, callback) {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function() {
                    callback(window.URL.createObjectURL(xhr.response), uri);
                }
                xhr.open('GET', uri, true);
                xhr.send();
            }

            function sendNotificationWithImage(_title, _icon) {
                var options = {
                    type : "basic",
                    title: _title,
                    message: "Incoming call",
                    iconUrl: _icon,
                    buttons: [
                        { title: 'Decline' }
                    ],
                    priority: 0
                };

                chrome.notifications.create("id"+notID++, options, creationCallback);
            }

            function sendNotification(message) {

                var _title = (message.fullPrefName) ? message.fullPrefName : message.phoneNumber;
                if (!_title || _title.toLowerCase() === 'anonymous') {
                    _title = "Anonymous (" + message.phoneNumber + ")";
                }

                if (message.pictureUrl && message.pictureUrl !== "") {

                    try{
                        loadImage(message.pictureUrl, function(blobUri, requesteUri) {
                            sendNotificationWithImage(_title, blobUri);
                        });
                    } catch(err){
                        $log.warn("Error Retrieving image for (" + message.pictureUrl + ") - " + err);
                        sendNotificationWithImage(_title, "/images/avatar.png");
                    }

                } else {
                    sendNotificationWithImage(_title, "/images/avatar.png");
                }

            }

            this.renderEvent = function(event) {

                var data = JSON.parse(event.data);

                if (data) {
                    if (data.type === 'chat_server_message') {
                        if (data.message && data.message.participant && data.message.text) {
                            var side = 'left';
                            if (data.message.participant.type === 'Customer') {
                                side = 'right';
                            }

                            var curMessageId = $scope.messages.length;

                            $scope.messages.push({
                                messageId: curMessageId,
                                avatar: "images/avatar.png",
                                msgType: data.message.msgType,
                                text: data.message.text,
                                side: side
                            });
                            $scope.$apply();

                            // Animate
                            angular.element("#viewport").animate({
                                scrollTop:  $("#viewport-content").height()
                            }, 800);
                        }
                    } else if (data.type === 'notification') {
                        sendNotification(data.message);
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