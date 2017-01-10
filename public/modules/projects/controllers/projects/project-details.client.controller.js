'use strict';

angular.module('projects').controller('ProjectDetailsController', ['$scope', '$state', 'project', 'Authentication', '$detection', '$location', '$anchorScroll',
    function ($scope, $state, project, Authentication, $detection, $location, $anchorScroll) {
        $scope.authentication = Authentication;
        $scope.user           = $scope.authentication.user;

        $scope.project     = project;
        $scope.addNoteForm = {
            value: false,
            hideQuestion: false
        };
        $scope.isIos = $detection.isiOS();

        $scope.setResolutionRequired = function() {
            $scope.project.resolutionRequired = new Date();
            $scope.project.isCompleted  = false;
            $scope.project.completeDate = null; 
            $scope.publishReportForm = false;
            $scope.project.status = 'resolution-required';
            $scope.project.$update(function() {
                $state.go($state.current, {}, {reload: true});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        $scope.markAsCompleted = function() {
            $scope.project.isCompleted  = true;
            $scope.project.completeDate = new Date();
            $scope.project.$update(function() {
                $state.go($state.current, {}, {reload: true});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });         
        };
        $scope.hideNotification = function(){
            $scope.hideNotif = true;
        };
		
		// Maximize/Minimize the 3D Model Viewer
		$scope.modelviewer = function() {
			if (document.getElementById('3Dmodel').value === 'min')
			{
				$location.hash('start3D');
				$anchorScroll();
				document.getElementById('start3D').className = 'padding-top: 132px';
				document.getElementById('3Dmodel').value = 'max';
				document.getElementById('3Dmodel').className = '';
				document.getElementById('enabler').className = '';
				document.getElementById('adjustMessage').innerHTML = 'Click to Minimize 3D Model Window';
				document.getElementById('iframe').height = window.innerHeight*0.88;
			}
			else
			{
				$location.hash('projectdetails');
				$anchorScroll();
				document.getElementById('start3D').className = '';
				document.getElementById('3Dmodel').value = 'min';
				document.getElementById('3Dmodel').className = 'container';
				document.getElementById('enabler').className = 'disabled';
				document.getElementById('adjustMessage').innerHTML = 'Click to Maximize 3D Model Window';
				document.getElementById('iframe').height = '300';
			}
		};
    }
]);
