'use strict';

angular.module('genie')
    .factory('voicePlatformService', function($resource, $http, $log) {

        var voicePlatformUri = "https://genesysvoice.com:8080" + "/gcfd/servlets";

        var VoicePlatformService = function() {

            var self = this;

            this.me = function(success, failure) {
                var serviceUrl = voicePlatformUri + '/chats/me';

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

            this.login = function(email, success, failure) {
                var serviceUrl = voicePlatformUri + '/chats/login';

                $http.post(serviceUrl, {'email': email}).
                    success(function(data, status) {
                    	if (data && data.status && data.status === 'ok' && success) {
                    		success(data);
                    	} else {
                    		failure(data);
                    	}
                    }).
                    error(function(data, status){
                        failure(data);
                    });
            };

            this.pin = function(pin, success, failure) {
            	var serviceUrl = voicePlatformUri + '/chats/pin';

                http.post(serviceUrl, {'pin': pin}).
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

            this.token = function(success, failure) {
                var serviceUrl = voicePlatformUri + '/chats/token';

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

            this.logout = function(success, failure) {

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