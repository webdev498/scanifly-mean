'use strict';

angular.module('projects').controller('DashboardController', ['$scope', '$stateParams', '$location', '_', 'Authentication', 'Acl', 'Activities', 'projectList', 'activityList', 'totalActivities',
    function ($scope, $stateParams, $location, _, Authentication, Acl, Activities, projectList, activityList, totalActivities) {
        var skipActivitiesLimit    = 10;
        $scope.authentication      = Authentication;
        $scope.acl                 = Acl;
        $scope.data                = {};
        $scope.hideSidebarOnMobile = true;
        $scope.skipActivities      = skipActivitiesLimit;
        $scope.disableLoadMore     = false;

        if (!$scope.authentication.user) {
            $location.path('/');
            return;
        }

        $scope.date = $scope.authentication.user.created;

        $scope.dtOptions = {
            filter    : false,
            info      : false,
            paging    : false,
            columnDefs: [
                {targets: 5, sortable: false}
            ]
        };

        // Find a list of Projects
        $scope.find = function () {
            $scope.projects   = projectList;
            $scope.activities = activityList;
            if ($scope.activities.length < skipActivitiesLimit || $scope.activities.length === totalActivities.activityCount) {
                $scope.disableLoadMore = true;
            }
        };

        $scope.toggleSidebar = function () {
            $scope.hideSidebarOnMobile = !$scope.hideSidebarOnMobile;
        };

        jQuery('.dataTable').DataTable({
            responsive: true
        });

        $scope.updateActivitiesLimit = function () {

            Activities.query({
                skip: $scope.skipActivities
            }).$promise.then(function (activities) {
                    var bodyWrapper = jQuery('#body-wrapper');
                    if (bodyWrapper.hasClass('body-wrapper')) {
                        bodyWrapper.removeClass('body-wrapper');
                        bodyWrapper.addClass('body-wrapper-two');
                    } else {
                        bodyWrapper.removeClass('body-wrapper-two');
                        bodyWrapper.addClass('body-wrapper');
                    }

                    $scope.activities = _.union($scope.activities, activities);
                    $scope.skipActivities += skipActivitiesLimit;

                    if (activities.length < skipActivitiesLimit || $scope.activities.length === totalActivities.activityCount) {
                        $scope.disableLoadMore = true;
                    }
             
                }, function (error) {
                    console.log(error);
                });
        };
    }
]);
