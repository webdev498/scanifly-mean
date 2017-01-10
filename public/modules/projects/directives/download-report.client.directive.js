'use strict';

/*global JSZip */
/*global saveAs */
/*jshint loopfunc: true */

angular.module('projects')
    
    .directive('downloadReport', [
        function () {
            return {
                templateUrl: 'modules/projects/views/directives/download-report.client.directive.html',
                restrict   : 'E',
                controller : function ($scope, $detection, $window) {
                    $scope.isIos       = $detection.isiOS();
                    $scope.downloadUrl = '';

                    $scope.downloadReport = function () {
                        $scope.downloadUrl     = '/download/' + $scope.project._id + '?c=' + (new Date()).getTime();
                    };

                }
            };
        }
    ]);
