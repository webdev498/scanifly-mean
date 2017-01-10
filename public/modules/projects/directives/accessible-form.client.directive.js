'use strict';

angular.module('projects').directive('accessibleForm', [
	function() {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				elem.on('submit', function () {
					var firstInvalid = elem[0].querySelector('.ng-invalid');
					if (firstInvalid) {
						firstInvalid.focus();
					}
				});
			}
		};
	}
]);
