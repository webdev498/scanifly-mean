'use strict';

angular.module('projects').factory('S3', ['$resource',
	function($resource) {
		return $resource('configuration/:resource', { resource: '@_id'});
	}
]);
