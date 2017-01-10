'use strict';

angular.module('core').controller('FeaturesController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);
