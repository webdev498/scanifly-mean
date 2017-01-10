'use strict';

angular.module('projects').directive('uploadData', ['$state', '$stateParams',
    function($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/upload-data.client.directive.html',
            restrict: 'E',
            controller: function($scope) {
                
                $scope.upload = function() {
                    $state.go('upload-project-data', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
            }
        };
    }
]);
