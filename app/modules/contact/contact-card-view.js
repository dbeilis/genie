angular.module('contact-card',[])
    .directive('contactCardView', function($log){
    	return {
            templateUrl: 'modules/contact/contact-card-view.html',
            restrict: 'E',
            transclude: true,
            scope: {
            	contact: "="
            },
            link: function(scope) {
                $log.info("Rendering contact card...");
    	    }
        };
    })