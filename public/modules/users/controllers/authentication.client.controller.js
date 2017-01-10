'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.submitted = false;

		$scope.signup = function(userForm) {
			$scope.submitted = true;
			$scope.success = $scope.error = null;

			if (userForm.$valid && !userForm.agreement.$pristine) {
				$http.post('/auth/signup', $scope.credentials).success(function (response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/dashboard');
				}).error(function (response) {
					$scope.error = response.message;

                    if (response.field) {
                        userForm[response.field].$setValidity('fieldError', false);
                    }

				});
			} else {
				$scope.error = 'Please fill out all the fields.';
			}
		};

		$scope.signin = function(userForm) {
			$scope.success = $scope.error = null;

			if (userForm.$valid) {
				$http.post('/auth/signin', $scope.credentials).success(function (response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/dashboard');
				}).error(function (response) {
					userForm.$setPristine();
					$scope.error = response.message;
				});
			} else {
				$scope.error = 'Please fill out all the fields.';
			}
		};
	}
]);
