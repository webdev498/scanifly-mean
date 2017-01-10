'use strict';

angular.module('projects').directive('uploadComplete', ['$state', '$stateParams',
    function ($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/upload-complete.client.directive.html',
            restrict   : 'E',
            controller : function ($scope) {
                $scope.upload = function() {
                    // $state.go('upload-project-data', {
                    $state.go('project-details', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
                
                $scope.markAsApproved = function() {
                    $scope.project.uploadComplete = new Date();
                    $scope.project.isApproved = true;
                    $scope.project.status  = 'upload-complete';
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
