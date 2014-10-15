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
                scope.availability = "";
                if (scope.contact.availability === "true") {
                    scope.availability = "free";
                } else if (scope.contact.availability === "false") {
                    scope.availability = "busy";
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

                if (scope.contact.pictureUrl) {
                    loadImage(scope.contact.pictureUrl, function(blobUri, requesteUri) {
                        scope.profilePictureBg = "background-image:url('" + blobUri + "')";
                        scope.$apply();
                    });
                }

                if (scope.contact.country && scope.contact.city) {
                    var coverPhotoBgUrl = genesysLocationService.getImageByLocation(
                        genesysLocationService.IMAGE_TIME.DAY,
                        scope.contact.country, scope.contact.city);
                    scope.coverPhotoBg = "background-image:url('" + coverPhotoBgUrl + "')";
                }

                scope.genderCalling = "He";
                if (scope.contact.gender === 'F') {
                    scope.genderCalling = "She";
                }
                scope.availability_desc = scope.genderCalling + " is ";
                if (scope.contact.availability === 'true') {
                    scope.availability_desc += "available for the next ";
                    if (scope.contact.nextChangeFromNowHours > 0) {
                        scope.availability_desc += scope.contact.nextChangeFromNowHours + " hours";
                        if (scope.contact.nextChangeFromNowMinutes > 0) {
                            scope.availability_desc += " and ";
                        }
                    }
                    if (scope.contact.nextChangeFromNowMinutes > 0) {
                        scope.availability_desc += scope.contact.nextChangeFromNowMinutes + " min."
                    }
                } else {
                    if (scope.contact.reason === 'OOO_PERSONAL') {
                        scope.availability_desc += "out of office for a personal reason";
                    } else if (scope.contact.reason === 'OOO_BIZ_TRAVEL') {
                        scope.availability_desc += "out of office on a business trip";
                    } else if (scope.contact.reason === 'OOO_OTHER') {
                        scope.availability_desc += "out of office";
                    } else if (scope.contact.reason === 'HOLIDAY') {
                        scope.availability_desc += "out of office for a holiday";
                    } else if (scope.contact.reason === 'WEEKEND') {
                        scope.availability_desc += "out of office for the weekend";
                    } else if (scope.contact.reason === 'OFF_HOURS') {
                        scope.availability_desc += "out of office for today";
                    } else if (scope.contact.reason === 'OOO_APPT') {
                        scope.availability_desc += "out of office for a meeting";
                    } else if (scope.contact.reason === 'BUSY') {
                        scope.availability_desc += "busy";
                    }  

                    scope.availability_desc += " available in ";
                    if (scope.contact.nextChangeFromNowHours > 0) {
                        scope.availability_desc += scope.contact.nextChangeFromNowHours + " hours";
                        if (scope.contact.nextChangeFromNowMinutes > 0) {
                            scope.availability_desc += " and ";
                        }
                    }
                    if (scope.contact.nextChangeFromNowMinutes > 0) {
                        scope.availability_desc += scope.contact.nextChangeFromNowMinutes + " min."
                    }
                }

    	    }
        };
    })