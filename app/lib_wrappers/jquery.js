'use strict';

angular.module('jquery', [])
    .factory('$', function() {
        return window.$;
    });