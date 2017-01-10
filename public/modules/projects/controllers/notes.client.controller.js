'use strict';

// Notes controller
angular.module('projects').controller('NotesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notes',
	function($scope, $stateParams, $location, Authentication, Notes) {
		$scope.authentication = Authentication;

		$scope.data = {};
		$scope.notes = [];

		// submit a new note
		$scope.create = function(commentsForm) {
			
			var note = new Notes ({
				note  : $scope.data.note,
				projectId: $stateParams.projectId
			});

			note.$save(function(response) {
				if ($scope.addNoteForm.value === true) {
					$scope.setResolutionRequired(); // this is called from resolution required controller
				}
				$scope.data = {};
				commentsForm.$setPristine();
				$scope.notes.unshift(note);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.notes = Notes.query({
				projectId: $stateParams.projectId
			});
		};
	}
]);
