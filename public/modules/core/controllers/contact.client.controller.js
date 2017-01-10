'use strict';

angular.module('core').controller('ContactController', ['$scope', '$http','Authentication',
    function ($scope, $http, Authentication) {
        $scope.authentication = Authentication;
        $scope.formData  = {
            siteAssessments: '<25',
			subject: 'Learn more about our services'
        };
        $scope.submitted = false;

        $scope.submit = function (contactForm) {
            $scope.submitted = true;
            $scope.success   = $scope.error = null;

            if (contactForm.$valid) {
                $http.post('/contact-us', $scope.formData)
                    .success(function (data) {
                        $scope.success = 'Thanks for contacting us!';

                        $scope.formData  = {
                            siteAssessments: '<25',
                            subject: 'Learn more about our services'
                        };
                        contactForm.$setPristine();
                    })
                    .error(function (error) {
                        $scope.error  = error.message;
                        $scope.result = 'bg-danger';
                    });
            } else {
                $scope.error = 'Sending Failed. Please fill out all the fields.';
            }
        };

    }
]);
