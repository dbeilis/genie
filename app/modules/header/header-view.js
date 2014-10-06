angular.module('genie',[])
.directive('header', function(){
	return {
        templateUrl: 'modules/header/header-view.html',
        restrict: 'E',
        transclude: true,
        scope: {
        	contact: "="
        },
        link: function(scope) {
	    }
    };
})