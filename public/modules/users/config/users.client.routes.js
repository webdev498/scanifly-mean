'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
			state('settings', {
				url			: '/settings/',
				authenticate: true,
				controller	: 'SettingsController',
				templateUrl : 'modules/users/views/settings/edit-profile.client.view.html'
			}).
            state('profile', {
                url         : '/settings/profile',
                authenticate: true,
                controller  : 'SettingsController',
                templateUrl : 'modules/users/views/settings/edit-profile.client.view.html'
            }).
            state('company', {
                url         : '/settings/company',
                authenticate: true,
                controller  : 'CompanyManagementController',
                templateUrl : 'modules/users/views/settings/edit-company.client.view.html'
            }).
            state('password', {
                url         : '/settings/password',
                authenticate: true,
                controller  : 'SettingsController',
                templateUrl : 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('billing', {
                url         : '/settings/billing',
                authenticate: true,
                controller  : 'SettingsController',
                templateUrl : 'modules/users/views/settings/billing.client.view.html'
            }).
            state('user-management', {
                url         : '/settings/user/management',
                authenticate: true,
                controller  : 'SettingsController',
                templateUrl : 'modules/users/views/settings/user-management.client.view.html'
            }).
            state('company-management', {
                url         : '/settings/company/management',
                authenticate: true,
                templateUrl : 'modules/users/views/settings/company-management.client.view.html'
            }).
			state('tutorials', {
                url         : '/settings/tutorials',
                authenticate: true,
                templateUrl : 'modules/users/views/settings/tutorials.client.view.html'
            }).
            state('signup', {
                url         : '/signup',
                authenticate: false,
                seo         : {
                    title      : 'Sign up - Scanifly',
                    description: 'Create your scanifly account',
                    keywords   : ''
                },
                controller : 'AuthenticationController',
                templateUrl: 'modules/users/views/authentication/signup.client.view.html'
            }).
            state('signin', {
                url         : '/signin',
                authenticate: false,
                seo         : {
                    title      : 'Sign in - Scanifly',
                    description: 'Access your account',
                    keywords   : ''
                },
                controller  : 'AuthenticationController',
                templateUrl : 'modules/users/views/authentication/signin.client.view.html'
            }).
            state('forgot', {
                url         : '/password/forgot',
                authenticate: false,
                controller  : 'PasswordController',
                templateUrl : 'modules/users/views/password/forgot-password.client.view.html'
            }).
            state('reset-invalid', {
                url         : '/password/reset/invalid',
                authenticate: false,
                templateUrl : 'modules/users/views/password/reset-password-invalid.client.view.html'
            }).
            state('reset-success', {
                url         : '/password/reset/success',
                authenticate: false,
                templateUrl : 'modules/users/views/password/reset-password-success.client.view.html'
            }).
            state('reset', {
                url         : '/password/reset/:token',
                authenticate: false,
                controller  : 'PasswordController',
                templateUrl : 'modules/users/views/password/reset-password.client.view.html'
            });
    }
]).run(['$rootScope', '$state',
    function ($rootScope, $state) {
        $rootScope.$state = $state;
}]);
