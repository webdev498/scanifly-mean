'use strict';

angular.module('projects').filter('removeDash', [
    function () {
        return function (input) {
            if (input) {
                return input.replace(/-/g, ' ');
            } else {
                return 'All Projects';
            }
        };
    }
]);

