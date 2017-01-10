'use strict';

// Projects controller
angular.module('projects').controller('ProjectListController', ['$scope', '$stateParams', '$location', 'uiGmapIsReady', 'projects', 'markers',
    function ($scope, $stateParams, $location, uiGmapIsReady, projects, markers) {

        $scope.projects = projects;

        var statusFilter = '';

        switch ($stateParams.status) {
            case 'location-submitted' :
                statusFilter = 'location-submitted';
                break;
            case 'flight-scheduled' :
                statusFilter = 'flight-scheduled';
                break;
            case 'flight-successful' :
                statusFilter = 'flight-successful';
                break;
            case 'upload-complete' :
                statusFilter = 'upload-complete';
                break;
            case 'resolution-required':
                statusFilter = 'resolution-required-or-resolution-complete';
                break;
            default:
                statusFilter = null;
        }
        $scope.statusFilter = statusFilter;

        $scope.mapListing = {
            view : false,
            zoom     : 4,
            center   : {
                latitude : 41,
                longitude: -70
            },
            options  : {
                mapTypeId: 'satellite',
                scrollwheel: true
            },
            markers  : markers
        };

        $scope.dtOptions = {
            filter    : false,
            info      : false,
            paging    : false,
            columnDefs: [
                {targets: 5, sortable: false}
            ],
            order: [
                [2, 'desc']
            ]
        };


        $scope.toggleMap = function () {
            $scope.mapListing.view = !$scope.mapListing.view;
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
