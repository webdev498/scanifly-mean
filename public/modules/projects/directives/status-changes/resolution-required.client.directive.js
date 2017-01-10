'use strict';

angular.module('projects').directive('resolutionRequired', ['$state', '$stateParams',
    function($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/resolution-required.client.directive.html',
            restrict: 'E',
            controller: function($scope) {

                $scope.upload = function() {
                    $state.go('upload-project-data', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
                
                $scope.markResolutionComplete = function() {
                    $scope.project.status = 'resolution-complete';
                    $scope.project.isCompleted = true;
                    $scope.project.completeDate = new Date();
                    $scope.project.$update(function() {
                        $state.go($state.current, {}, {reload: true});
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });                    
                };
            }
        };
    }
]);
