'use strict';

angular.module('projects').directive('projectReport', ['$http',
    function($http) {
        return {
            templateUrl: 'modules/projects/views/directives/project-report.client.directive.html',
            restrict: 'E',
            controller: function($scope, $sce, Lightbox) {
                $scope.downloadShadeReportUrl = '';

                $scope.unSanitizeHtml = function(html) {
                    return $sce.trustAsHtml(html);
                };
                Lightbox.templateUrl = 'modules/projects/views/directives/lightbox/lightbox.html';
                $scope.openLightboxModal = function (image, index) {
                    Lightbox.getImageUrl = function(image) {

                        return image.imagePath;

                    };

                    Lightbox.openModal($scope.project.details.droneImages.eyeView, index);

                    if($scope.project.details.droneImages.eyeView.length <= 1){
                        Lightbox.hideControlls = true;

                    }

                };

                $scope.openLightboxModalOne = function (image, index) {
                    Lightbox.getImageUrl = function(image) {

                        return image.imagePath;

                    };

                    Lightbox.openModal($scope.project.details.droneImages.topImage, index);
                    if($scope.project.details.droneImages.topImage.length <= 1){
                        Lightbox.hideControlls = true;

                    }

                };

                $scope.tabs = [
                    { title:'Dynamic Title 1', content:'Dynamic content 1' },
                    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
                ];

                $scope.downloadShadeReport = function () {
                    $scope.downloadShadeReportUrl     = '/download-shade-report/' + $scope.project._id + '?c=' + (new Date()).getTime();
                };

                $scope.multiplyPercentages = function(x, y) {
                    return (((x/100) * (y/100)) * 100).toFixed(2);
                };

            }


        };
    }
]);
