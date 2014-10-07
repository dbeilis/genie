angular.module('components',[])
.directive('contactCardView', function($log){
	return {
        templateUrl: 'modules/contact-view/contact-card-view.html',
        restrict: 'E',
        transclude: true,
        scope: {
        	contactCard: "="
        },
        link: function(scope) {
            $log.info("Rendering contact card...");
	    }
    };
})