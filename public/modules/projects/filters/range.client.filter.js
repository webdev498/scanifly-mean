'use strict';

angular.module('projects').filter('range', [
    function () {
        return function (input, from, to, format) {
            from = parseInt(from);
            to   = parseInt(to);

            for (var i = from; i <= to; i++) {
                if (format) {
                    input.push(format.replace('#', i));
                } else {
                    input.push(i);
                }
            }

            return input;
        };
    }
]);
