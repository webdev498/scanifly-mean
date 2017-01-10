'use strict';

angular.module('core').controller('WhereWeScanController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);
