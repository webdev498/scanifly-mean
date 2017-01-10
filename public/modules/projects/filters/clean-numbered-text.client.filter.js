'use strict';

angular.module('projects').filter('cleanNumberedText', [
    function () {
        return function (input) {
            if (input) {
                input = input.replace(/[0-9]/g, '');
                input = input.replace(/-/g, ' ');
                return input;
            } else {
                return input;
            }
        };
    }
]);

