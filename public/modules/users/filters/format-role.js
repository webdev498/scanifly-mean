'use strict';

angular.module('users').filter('formatRole', function() {
    return function(input) {

        return input.replace('customer-', '');
    };
});
