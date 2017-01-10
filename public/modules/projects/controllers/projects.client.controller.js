'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'ProjectService', 'uiGmapIsReady', 'Acl', 'States',
    function ($scope, $stateParams, $location, Authentication, Projects, ProjectService, uiGmapIsReady, Acl, States) {
        $scope.mapView = false;

        $scope.mapListing = {
            zoom     : 4,
            center   : {
                latitude : 41,
                longitude: -70
            },
            options  : {
                mapTypeId: 'satellite',
                scrollwheel: true
            },
            markers  : []
        };

        $scope.toggleMap = function (displayMap) {
            $scope.mapView = displayMap;
        };

        $scope.dtOptions = {
            filter    : false,
            info      : false,
            paging    : false,
            columnDefs: [
                {targets: 5, sortable: false}
            ]
        };

        // Remove existing Project
        $scope.remove = function (project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects [i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function () {
                    $location.path('projects');
                });
            }
        };

        // Update existing Project
        $scope.update = function () {
            var project = $scope.project;

            project.$update(function () {
                $location.path('projects/' + project._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Projects
        $scope.find = function () {

            $scope.statusFilter = '';

            switch ($stateParams.status) {
                case 'location-submitted' :
                    $scope.statusFilter = 'location-submitted';
                    break;
                case 'flight-scheduled' :
                    $scope.statusFilter = 'flight-scheduled';
                    break;
                case 'flight-successful' :
                    $scope.statusFilter = 'flight-successful';
                    break;
                case 'assessment-complete' :
                    $scope.statusFilter = 'assessment-complete';
                    break;
                case 'resolution-required':
                    $scope.statusFilter = 'resolution-required-or-resolution-complete';
                    break;
                default:
                    $scope.statusFilter = null;
            }

            Projects.query({
                status: $scope.statusFilter
            }, function (projects) {

                var markers = [];
                for (var i = 0; i < projects.length; i++) {
                    var marker = {
                        id       : i,
                        latitude : projects[i].geoLocation.latitude,
                        longitude: projects[i].geoLocation.longitude,
                        name     : projects[i].name,
                        projectId: projects[i]._id,
                        show     : false
                    };
                    markers.push(marker);
                }

                $scope.projects           = projects;
                $scope.mapListing.markers = markers;
            });
        };

        $scope.showNewScan = function () {
            if ($scope.statusFilter === null) {
                return true;
            } else {
                return false;
            }
        };
		
    }
]);
