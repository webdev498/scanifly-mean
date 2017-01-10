'use strict';

angular.module('projects').directive('scheduleFlight', ['$state','Companies',
    function ($state,Companies) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/schedule-flight.client.directive.html',
            restrict   : 'E',
            controller : function ($scope) {
                $scope.data              = {};
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
                        $scope.project.status          = 'flight-scheduled';
                        var project                    = $scope.project;

                        project.$update(function () {
                            $state.go($state.current, {}, {reload: true});
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                };
                
                $scope.declineProject = function () {
                    var project = $scope.project;
                    project.status = 'declined';
                    var answer = confirm('Are you sure you want to decline this project ?');
                    
                    if (answer) {
                        Companies.query({},function(companies){
                            for(var index in companies){
                                if(companies[index].companyId === project.company._id){
                                    project.companyAdminEmail = companies[index].admins[0].email;
                                }
                            }

                            project.$delete(function(response) {
                                $state.go('dashboard', {}, {reload: true});
                            }, function (errorResponse) {
                                $scope.error = errorResponse.data.message;
                            });
                        });
                    }
                };
            }
        };
    }
]);
