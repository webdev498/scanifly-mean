'use strict';

angular.module('core').directive('scroll', ['$window',
    function($window) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                angular.element($window).bind('scroll', function() {
                    if (this.pageYOffset >= 20) {
                        element.addClass('small');

                    } else {
                        element.removeClass('small');

                    }
                });
            }
        };
    }
]);
