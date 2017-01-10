'use strict';

// Projects controller
angular.module('projects').controller('SearchController', ['$scope', 'projects',
    function ($scope, projects) {

        $scope.projects = projects;

        $scope.dtOptions = {
            filter    : false,
            info      : false,
            paging    : false,
            columnDefs: [
                {targets: 5, sortable: false}
            ]
        };

    }
]);
