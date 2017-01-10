'use strict';

angular.module('users').directive('uniqueEmail', [ 'Users',
	function(Users) {
		return {
			require:'ngModel',
			restrict: 'A',
			link: function postLink(scope, element, attrs, ctrl) {

				//TODO: We need to check that the value is different to the original

				//using push() here to run it as the last parser, after we are sure that other validators were run
				ctrl.$parsers.push(function (viewValue) {

					if (viewValue) {
						Users.query({email:viewValue}, function (users) {
							if (users.length === 0) {
								ctrl.$setValidity('uniqueEmail', true);
							} else {
								ctrl.$setValidity('uniqueEmail', false);
							}
						});
						return viewValue;
					}
				});
			}
		};
	}
]);
