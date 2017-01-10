'use strict';

angular.module('projects').directive('statusBar', [
    function() {
        return {
            templateUrl: 'modules/projects/views/directives/status-bar.client.directive.html',
            restrict: 'E',
            controller: function($scope) {
                var projectStatus = $scope.project.status;
                
                // available statuses in reverse order of how to show them
                var availableStatuses = [/*{
                        status: 'resolution-complete',
                        value: false,
                        current: false
                    },
                    {
                        status: 'resolution-required',
                        value: false,
                        current: false
                    },*/
                    {
                        status: 'upload-complete',
                        value: false,
                        current: false
                    },
                    {
                        status: 'flight-successful',
                        value: false,
                        current: false
                    },
                    {
                        status: 'flight-scheduled',
                        value: false,
                        current: false
                    },
                    {
                        status: 'location-submitted',
                        value: false,
                        current: false
                    }];

                var newValue = false;
                for (var elementId in availableStatuses) {
                    
                    if (availableStatuses[elementId].status === projectStatus) {
                        newValue = true;
                        availableStatuses[elementId].current = true;
                    }
                    availableStatuses[elementId].value = newValue;
                }
                availableStatuses.reverse();
                $scope.availableStatuses = availableStatuses;
            }
        };
    }
]);
