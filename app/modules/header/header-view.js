angular.module('header',[])
    .directive('headerView', function($log, genesysLocationService){
    	return {
            templateUrl: 'modules/header/header-view.html',
            restrict: 'E',
            transclude: true,
            scope: {
            	contact: "="
            },
            link: function(scope) {
                $log.info("Rendering header for " + scope.contact);
                
                scope.headerPictureBg = "background-image:url('../../images/avatar.png')";

                var loadImage = function(uri, callback) {
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function() {
                        callback(window.URL.createObjectURL(xhr.response), uri);
                    }
                    xhr.open('GET', uri, true);
                    xhr.send();
                }

                if (scope.contact.country && scope.contact.city) {
                    var coverPhotoBgUrl = genesysLocationService.getImageByLocation(
                        genesysLocationService.IMAGE_TIME.DAY,
                        scope.contact.country, scope.contact.city);
                    scope.coverPhotoBg = "background-image:url('" + coverPhotoBgUrl + "')";
                }

                if (scope.contact.pictureUrl) {
                    loadImage(scope.contact.pictureUrl, function(blobUri, requesteUri) {
                        scope.headerPictureBg = "background-image:url('" + blobUri + "')";
                        scope.$apply();
                    });
                }
    	    }
        };
    })