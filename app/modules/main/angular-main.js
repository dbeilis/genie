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
				$scope.contact = {
					'email' : data.email,
					'fullPrefName': data.fullPrefName,
					'country': data.officeCountry,
					'city':data.officeCity,
					'pictureUrl': data.pictureUrl,
					'busy': data.busy
				};

				$log.info("Me: " + JSON.stringify($scope.contact));

				$scope.transportConfig = {
					'webSocketAddr': data.websocketDomainPort,
					'token': data.token 
				};

				$log.info("Transport config: " + JSON.stringify($scope.transportConfig));

			},
			function(data) {
				$log.info("User is not authenticated.");
			}
		);
	}
]);