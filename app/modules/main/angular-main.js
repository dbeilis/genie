angular.module('genie', [
	'ngCookies',
    'ngResource',
    'ngRoute',
    'jquery'
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

.controller('GenieController', ['$scope', '$log', '$route', 'voicePlatformService',
	function($scope, $log, $route, voicePlatformService) {
		$log.info("Angular Genie has started...");

		voicePlatformService.me(
			function(data) {

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

				$scope.config = {
					'webSocketAddr': data.websocketDomainPort
				};

				// Initialize WebSocket Transport for messaging 
				voicePlatformService.token(
					function(data){
						$log.info("Successfully got the token " + data.token);

						$scope.config.tocket = data.token;

						// TODO: initialize websocket
					},
					function(){
						$log.warn("Failed to retrieve token from voice platform. Redirecting to login...");
						$route.reload();
					});
			},
			function(data) {
				$log.info("User is not authenticated.");
			}
		);

		$scope.login = function() {
			$log.info("Sending login request for user - " + $scope.email);

			voicePlatformService.login($scope.email, 
				function() {
					$log.info("Login succeeded");
				},
				function(error) {
					$log.warn("Failed to submit login request : " + error);
					$scope.error = error;
				});
		};

		$scope.pin = function() {
			voicePlatformService.pin($scope.pin, 
				function() {
					$log.info("Successfully sent pin request. Refreshing...")
					$route.reload();
				},
				function(error) {
					$log.warn("Failed to submit pin request : " + error);
					$scope.error = error;
				}
			); 
		};
	}
]);