angular.module('contact-card',[])
    .directive('contactCardView', function($log){
    	return {
            templateUrl: 'modules/contact/contact-card-view.html',
            restrict: 'E',
            transclude: true,
            scope: {
            	name: "=",
                image: "=",
                title: "=",
                locCity: "=",
                locCountry: "=",
                supervisor: "="
            },
            link: function(scope) {
                $log.info("Rendering contact card...");
    	    }
        };
    })