'use strict';

angular.module('projects').controller('CreateProjectController', ['$rootScope', '$scope', '$location', '$state', '$stateParams', 'ProjectService', 'stateList',
    function ($rootScope, $scope, $location, $state, $stateParams, ProjectService, stateList) {
        $scope.states = stateList;
		$scope.selfScanStatus = false;

        var generateImageLink = function () {
            var link = 'https://maps.google.com/maps/api/staticmap?';

            link += 'center=' + $scope.data.map.center.latitude + ',' + $scope.data.map.center.longitude;
            link += '&sensor=false';
            link += '&size=535x380';
            link += '&maptype=satellite';
            link += '&zoom=' + $scope.data.map.zoom;

            for (var i = $scope.data.map.markers.length - 1; i >= 0; i--) {
                var marker = $scope.data.map.markers[i];
                link += '&markers=color:white%7Clabel:' + marker.name + '%7C' + marker.coords.latitude + ',' + marker.coords.longitude;
            }

            return link;
        };

		// Set if Project is a Self Scan Project
		$scope.setSelfScan = function(selfScanState)
		{
			$scope.selfScanStatus = true;
		};
		
        // Create new Project
        $scope.create = function () {
            // Create new Project object

			$scope.data.selfscan = $scope.selfScanStatus;
            $scope.data.propertyImage = generateImageLink();
            var project               = ProjectService.createProject($scope.data);

            // Redirect after save
            project.$save(function(response) {
				$state.go('project-details', {
						projectId: project._id
					}, {
						reload: true
				}).then(function(argument) {
					$rootScope.$broadcast('newProjectCreated');
				});
				
/* 				if ($scope.data.selfscan === false) {
					$state.go('project-details', {
						projectId: project._id
					}, {
						reload: true
					});
				}
				else {
					$state.go('project-details', {
						projectId: project._id
					}, {
						reload: true
					});
				} */

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                jQuery(window).scrollTop(jQuery('.submitted .ng-invalid.ng-pristine:first').offset().top - 10);
                $scope.error = errorResponse.data.message;
            });
        };
		
		// Calculate Total Annual kWh Usage
		$scope.totalkWh = function ()
		{
			$scope.data.annual = '';
			$scope.total = 0;
			var months = document.getElementsByName('kWh');

			for (var i = 0; i < months.length; i++)
			{
			   $scope.total += parseInt(months[i].value) || 0;
			}
			$scope.data.annual = $scope.total.toString();
			$scope.total = 'Total Annual Usage: ' + $scope.total + ' kWh';
		};

    }
]);
