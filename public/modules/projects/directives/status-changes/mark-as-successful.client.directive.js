'use strict';

angular.module('projects').directive('markAsSuccessful', ['$state', 
    function($state) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/mark-as-successful.client.directive.html',
            restrict: 'E',
            controller: function($scope) {

                $scope.showSchedulePanel = false;
                $scope.minDate           = new Date();

                $scope.toggleSchedulePanel = function () {
                    $scope.showSchedulePanel = !$scope.showSchedulePanel;
                };

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.dateOptions = {
                    startingDay: 0
                };

                $scope.schedule = function () {
                    if (angular.isDefined($scope.data.date)) {
                        var date                       = $scope.data.date;
                        $scope.project.scheduledFlight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $scope.data.time);
                        var project                    = $scope.project;

                        project.$update(function () {
                            $state.go($state.current, {}, {reload: true});
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                };

                $scope.markAsSuccessful = function() {
                    $scope.project.successfulFlight = new Date();
                    $scope.project.status = 'flight-successful';
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
