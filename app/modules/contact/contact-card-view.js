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

                var updatePersonalizedMessage = function() {
                    
                    scope.pronoun = "He";
                    scope.possessive = "his";
                    if (scope.contact.gender === 'F') {
                        scope.pronoun = "She";
                        scope.possessive = "her";
                    }

                    if (scope.contact.availability === 'NONE') {
                        scope.availability_desc = "Sorry, I don't have " + scope.possessive + " availability information.";
                        return;
                    } 

                    scope.availability_desc = scope.pronoun + " is ";

                    if (scope.contact.availability === 'true') {

                        scope.availability_desc += "free";

                        if (scope.contact.nextChangeAbsoluteTime) {

                            scope.availability_desc += " right now, and will be";

                            if (scope.contact.nextChangeFromNowHours <= 3) {
                                scope.availability_desc += " for the next ";

                                if (scope.contact.nextChangeFromNowHours > 0) {
                                    scope.availability_desc += scope.contact.nextChangeFromNowHours;
                                    if (scope.contact.nextChangeFromNowHours == 1) {
                                        scope.availability_desc += " hour";
                                    } else {
                                        scope.availability_desc += " hours";
                                    }
                                }

                                if (scope.contact.nextChangeFromNowHours > 0 && scope.contact.nextChangeFromNowMinutes > 0) {
                                    scope.availability_desc += " and ";
                                }

                                if (scope.contact.nextChangeFromNowMinutes > 0) {
                                    scope.availability_desc += scope.contact.nextChangeFromNowMinutes;
                                    if (scope.contact.nextChangeFromNowMinutes == 0) {
                                        scope.availability_desc += " minute";
                                    } else {
                                        scope.availability_desc += " minutes";
                                    }
                                }

                            } else {
                                var date = new Date(scope.contect.nextChangeAbsoluteTime * 1000);
                                scope.availability_desc += " until " + date;
                            }

                        } else {
                            scope.availability_desc += " right now.";
                        }

                    } else {

                        if (scope.contact.reason === 'OOO_PERSONAL') {
                            scope.availability_desc += "is taking some time off";
                        } else if (scope.contact.reason === 'OOO_BIZ_TRAVEL') {
                            scope.availability_desc += "out of the office on business";
                        } else if (scope.contact.reason === 'OOO_OTHER') {
                            scope.availability_desc += "out of office";
                        } else if (scope.contact.reason === 'BUSY') {
                            scope.availability_desc += "busy";
                        } else {
                            scope.availability_desc += "not available";
                        }

                        scope.availability_desc += " right now.";

                        if (scope.contact.nextChangeAbsoluteTime) {
                            var date = new Date(scope.contect.nextChangeAbsoluteTime * 1000);
                            scope.availability_desc += scope.pronoun + " will be available on " + date;
                        }

                    }
                };

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
                        genesysLocationService.IMAGE_TIME.NIGHT,
                        scope.contact.country, scope.contact.city);
                    scope.coverPhotoBg = "background-image:url('" + coverPhotoBgUrl + "')";
                }

                updatePersonalizedMessage();

    	    }
        };
    })