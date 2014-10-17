'use strict';

angular.module('genie')
    .factory('voicePlatformService', function($resource, $http, $log) {

        var voicePlatformUri = "https://www.genesysvoice.com" + "/gcfd/servlets";

        var VoicePlatformService = function() {

            var self = this;

            this.sendMeRequest = function(success, failure) {
                var serviceUrl = voicePlatformUri + '/chats/me';

                $http.get(serviceUrl).
                    success(function(data, status) {
                    	if (data && data.status && (data.status === 'okay' || data.status === 'ok') && success) {
                    		success(data);
                    	} else {
                    		failure(data);
                    	}
                    }).
                    error(function(data,status){
                        failure(data);
                    });
            };

            this.sendLoginRequest = function(email, success, failure) {
                var serviceUrl = voicePlatformUri + '/chats/login';

                $http.post(serviceUrl, {'email': email}).
                    success(function(data, status) {
                    	if (data && data.status && (data.status === 'okay' || data.status === 'ok') && success) {
                    		success(data);
                    	} else {
                    		failure(data);
                    	}
                    }).
                    error(function(data, status){
                        failure(data);
                    });
            };

            this.sendPinRequest = function(pin, success, failure) {
            	var serviceUrl = voicePlatformUri + '/chats/enter_pin';

                $http.post(serviceUrl, {'pin': pin}).
                    success(function(data, status) {
                    	if (data && data.status && data.status === 'ok' && success) {
                    		success(data);
                    	} else {
                    		failure(data);
                        }
                    }).
                    error(function(data,status){
                        failure(data);
                    });
            };

            

            this.sendLogoutRequest = function(success, failure) {

            	var serviceUrl = voicePlatformUri + '/chats/logout';

               $http.get(serviceUrl).
                    success(function(data, status) {
                        if (data && data.status && data.status === 'ok' && success) {
                            success(data);
                        } else {
                            failure(data);
                        }
                    }).
                    error(function(data,status){
                        failure(data);
                    });
            };

        };

        return new VoicePlatformService();

    });