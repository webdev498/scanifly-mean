'use strict';

//Project details service used to communicate Project details REST endpoints
angular.module('projects').factory('ProjectDetails', ['$resource',
    function ($resource) {
        return $resource('project-details/:projectDetailId', {
            projectDetailId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
