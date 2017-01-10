'use strict';

angular.module('projects').directive('createProjectMap', [
    function () {
        return {
            restrict   : 'E',
            scope      : false,
            controller : function ($scope) {
                var alphabet = [];
                for (var i = 0; i < 26; i++) {
                    alphabet.push(String.fromCharCode(65 + i));
                }

                if (!$scope.data) {
                    $scope.data = {
                        map: {
                            zoom       : 3,
                            center     : {
                                latitude : 37.1677,
                                longitude: -97.2639
                            },
                            options    : {
                                mapTypeId        : 'satellite',
                                scrollwheel      : true,
                                streetViewControl: false,
                                tilt             : 0
                            },
                            markers    : [],
                            markerLabel: '',
                            noOfMarkers: 0,
                            bounds     : {}
                        }
                    };
                }

                $scope.addMarker = function () {

                    if ($scope.data.map.noOfMarkers >= 26) {
                        return;
                    }

                    $scope.data.map.noOfMarkers += 1;

                    $scope.data.map.markers.push({
                        id     : $scope.data.map.noOfMarkers,
                        name   : alphabet[$scope.data.map.noOfMarkers - 1],
                        coords : {
                            latitude : $scope.data.map.center.latitude,
                            longitude: $scope.data.map.center.longitude
                        },
                        options: {
                            icon     : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + alphabet[$scope.data.map.noOfMarkers - 1] + '|FFFFFF|000000',
                            fillColor: '#0000FF',
                            draggable: true
                        }
                    });
                };

                $scope.removeMarker = function (id) {
                    $scope.data.map.noOfMarkers -= 1;
                    $scope.data.map.markers.pop();
                };

                $scope.renderMap = function () {
                    $scope.data.map.center = {
                        latitude : $scope.data.latitude,
                        longitude: $scope.data.longitude
                    };
                    $scope.data.map.zoom   = 20;
                };

            },
            templateUrl: 'modules/projects/views/directives/create-project/map.client.directive.html'
        };
    }
]);
