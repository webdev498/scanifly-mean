'use strict';

angular.module('core').controller('TermsAndConditionsController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);
