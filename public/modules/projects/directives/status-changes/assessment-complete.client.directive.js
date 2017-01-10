'use strict';

angular.module('projects').directive('assessmentComplete', ['$state', '$stateParams',
    function ($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/assessment-complete.client.directive.html',
            restrict   : 'E',
            controller : function ($scope) {
                $scope.upload = function() {
                    $state.go('upload-project-data', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
                
                $scope.markAsApproved = function() {
                    $scope.project.assessmentComplete = new Date();
                    $scope.project.isApproved = true;
                    $scope.project.status  = 'assessment-complete';
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
