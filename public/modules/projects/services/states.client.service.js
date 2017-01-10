'use strict';

angular.module('projects').factory('States', ['$resource',
	function($resource) {
		return $resource('modules/projects/config/states.json', {}, {});
	}
]);
