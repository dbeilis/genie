angular.module('contact-card',[])
    .directive('contactCardView', function($log, genesysLocationService){
    	return {
            templateUrl: 'modules/contact/contact-card-view.html',
            restrict: 'E',
            transclude: true,
            scope: {
            	contact: "="
            },
            link: function(scope) {

                $log.info("Rendering contact card...");

                scope.coverPhotoBg = "background-image:url('../../images/locations/card/others/other_locations_day.png')";
                scope.profilePictureBg = "background-image:url('../../images/loading.gif')";

                var loadImage = function(uri, callback) {
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function() {
                        callback(window.URL.createObjectURL(xhr.response), uri);
                    }
                    xhr.open('GET', uri, true);
                    xhr.send();
                }

                if (scope.contact.pictureUrl) {
                    loadImage(scope.contact.pictureUrl, function(blobUri, requesteUri) {
                        scope.profilePictureBg = "background-image:url('" + blobUri + "')";
                        scope.$apply();
                    });
                }

                if (scope.contact.country && scope.contact.city) {
                    var coverPhotoBgUrl = genesysLocationService.getImageByLocation(
                        genesysLocationService.IMAGE_TYPE.CARD,
                        genesysLocationService.IMAGE_TIME.DAY,
                        scope.contact.country, scope.contact.city);
                    scope.coverPhotoBg = "background-image:url('" + coverPhotoBgUrl + "')";
                }
          
    	    }
        };
    })