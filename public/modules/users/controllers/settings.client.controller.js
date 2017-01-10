'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'Acl',
	function($scope, $http, $location, Users, Authentication, Acl) {
        $scope.user      = Object.create(Authentication.user);
        $scope.users     = {};
        $scope.acl       = Acl;

		// If user is not signed in then redirect back home
		if (!$scope.user || (!$scope.user && !$scope.acl.hasAccess('user-management'))) {
            $location.path('/');
        }

		$scope.submitted = false;
		
		// DataTable options
		$scope.dtOptions = {
			filter: false,
			info  : false,
			paging: false,
			columnDefs: [
				{ targets: -1, sortable: false }
			]
		};

		// Update a user profile
		$scope.updateUserProfile = function(userForm) {
            $scope.submitted = true;
            $scope.upsuccess   = $scope.uperror = null;

			if (userForm.$valid) {
                $scope.upsuccess = $scope.uperror = null;
                var user       = new Users($scope.user);

				user.$update(function(response) {
					$scope.upsuccess = 'Profile saved successfully';
					userForm.$setPristine();
					Authentication.user = response;
				}, function(response) {
					$scope.uperror = response.data.message;
					
					if (response.data.field) {
						userForm[response.data.field].$setValidity('fieldError', false);
					}
				});
			} else {
				$scope.uperror = 'Please fill out the form';
			}

		};

		// Change user password
		$scope.changeUserPassword = function(passwordForm) {
            $scope.submitted = true;
            $scope.pwsuccess   = $scope.pwerror = null;

			if (passwordForm.$valid) {
				$http.post('/users/password', $scope.passwordDetails).success(function(response) {
					// If pwsuccessful show pwsuccess message and clear form
					$scope.pwsuccess = 'Password Changed successfully';
					$scope.passwordDetails = {};
					passwordForm.$setPristine();
				}).error(function(response) {
					$scope.pwerror = response.message;
				});
			} else {
				$scope.pwerror = 'Please fill out the form';
			}
		};

		// add new users
		$scope.signup = function(userForm) {
			$scope.submitted = true;
			$scope.success   = $scope.error = null;
			
			if (userForm.$valid) {
				userForm.credentials.userManagementForm = true;

				$http.post('/auth/signup', userForm.credentials).success(function (response) {
                    $scope.success       = 'User ' + userForm.credentials.name + ' was added successfully!';
                    userForm.credentials = {};
					userForm.$setPristine();
					
					$scope.users.unshift(response);
				}).error(function (response) {
					$scope.error = response.message;
				});
			} else {
				$scope.error = 'Please fill out all the fields.';
			}
		};
		
		$scope.listUsers = function() {
			$scope.users = Users.query({});
		};

		// Remove listed users
		$scope.removeUser = function(userId) {
			if ( userId ) {
				
				var answer = confirm('Are you sure you want to delete the selected user ?');
				
				if (answer) {
					
					Users.delete({
						userId: userId
					});

					for (var i in $scope.users) {
						if ($scope.users[i]._id === userId) {
							$scope.users[i].status = 'deleted';
						}
					}					
				}
			}
		};

        // Activate listed user
        $scope.activateUser = function(userId) {
            if ( userId ) {

                var answer = confirm('Are you sure you want to activate the selected user ?');

                if (answer) {

                    Users.update({
                        userId: userId
                    }, $scope.user);

                    for (var i in $scope.users) {
                        if ($scope.users[i]._id === userId) {
                            $scope.users[i].status = 'active';
                        }
                    }
                }
            }
        };
	}
]);
