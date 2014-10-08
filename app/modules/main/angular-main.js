angular.module('genie', [
	'ngCookies',
    'ngResource',
    'ngRoute',
    'jquery',
    'header',
    'contact-card',
    'chat'
   ])

.config(function($routeProvider, $httpProvider) {

	$routeProvider
        .when('/', {
            // routeName will contain the selected page name
            templateUrl: 'modules/main/main.html',
            controller: 'GenieController'
        })
        .otherwise({
            redirectTo: '/' // the default page
        });

})

.controller('GenieController', ['$scope', '$log', '$route', '$timeout', 'voicePlatformService',
	function($scope, $log, $route, $timeout, voicePlatformService) {
		$log.info("Angular Genie has started. Sending me request...");

		$scope.onLoginClick = function() {
			$log.info("Sending login request for user - " + $scope.email);

			voicePlatformService.sendLoginRequest($scope.email, 
				function(data) {
					$log.info("Login succeeded");
					$scope.emailError = "Dialing... Please enter pin number below once received.";	
				},
				function(error) {
					$log.warn("Failed to submit login request : " + error);
					if (error && error.status) {
						if (error.status === 'no_phone') {
							$scope.emailError = "Could not phone number for employee";
						} else if (error.status === 'no_employee') {
							$scope.emailError = "Could not find employee";
						} else if (error.status === 'out_call_error') {
							$scope.emailError = "Failed to dial. Please retry...";
						} else{
							$scope.emailError = "Unknown error. Please contact support.";
						}
					}
					
				});
		};

		$scope.onPinClick = function() {
			$log.info("Sending pin request - " + $scope.pin);

			voicePlatformService.sendPinRequest($scope.pin, 
				function() {
					$log.info("Successfully sent pin request. Refreshing...")
					$route.reload();
				},
				function(error) {
					$log.warn("Failed to submit pin request : " + error);
					$scope.pinError = error;
					if (error && error.status) {
						if (error.status === 'unknown') {
							$scope.pinError = "Unknown error";
						} else {
							$scope.pinError = "Unknown error. Please contact support.";
						}
					}
				}
			); 
		};

		voicePlatformService.sendMeRequest(
			function(data) {
				$log.info("Received me request - " + JSON.stringify(data));

				var locCountry = 'others';

				if (data.officeCountry === 'United States') {
					locCountry = 'us';
				} else if (data.officeCountry === 'Canada') {
					locCountry = 'ca';
				}

				var locCity = 'other_locations_day';

				$scope.contact = {
					'email' : data.email,
					'fullPrefName': data.fullPrefName,
					'locationImage': 'images/me/' + locCountry + '/' + locCity + '.png',
					'avatar': data.pictureUrl,
					'busy': data.busy
				};

				$log.info("Me: " + JSON.stringify($scope.contact));

				$scope.transportConfig = {
					'webSocketAddr': data.websocketDomainPort,
					'token': data.token 
				};

				$log.info("Transport config: " + JSON.stringify($scope.transportConfig));

				$timeout(function() {
					// HTTC Transport Version
					// var oChatUI = new GenesysChatUI($, $("#chat_panel"),
					// 	Transport_REST_HTTC, {
					// 		id : "515a4376-ac30-4ed2-801f-a876c0d56c93",
					// 		dataURL : "https://genesysvoice.com:8080/gcfd/servlets/chats/api/v2/chats/",
					// 		context : "demo"
					// 	}

					// 	// Transport_WebSocket, {
					// 	// 	id : "",
					// 	// 	dataURL : "wss://genesysvoice.com:8080/gcfd/websockets/messaging",
					// 	// 	context : "demo"
					// 	// }
					// );

					// oChatUI.startSession();
	
				}, 10, false);

							},
			function(data) {
				$log.info("User is not authenticated.");
			}
		);
	}
]);