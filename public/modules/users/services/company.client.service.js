'use strict';

angular.module('users').factory('Companies', ['$resource',
    function($resource) {
        return $resource('companies/:companyId', {
        	companyId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            delete: {
            	method: 'DELETE'
            }
        });
    }
]);
