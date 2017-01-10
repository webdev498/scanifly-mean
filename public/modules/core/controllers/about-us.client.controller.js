'use strict';

angular.module('core').controller('AboutUsController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);
