'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
            state('home', {
                url        : '/',
                controller : 'HomeController',
                templateUrl: 'modules/core/views/home.client.view.html',
                seo        : {
                    title      : '',
                    description: '',
                    keywords   : ''
                }
            }).
            state('terms-and-conditions', {
                url        : '/terms-and-conditions',
                controller : 'TermsAndConditionsController',
                templateUrl: 'modules/core/views/terms-and-conditions.client.view.html',
                seo        : {
                    title      : 'Terms and conditions - Scanifly',
                    description: 'In using this website you are deemed to have read and agreed to the following terms and conditions:',
                    keywords   : ''
                }
            }).
            state('where-we-scan', {
                url        : '/where-we-scan',
                controller : 'WhereWeScanController',
                templateUrl: 'modules/core/views/where-we-scan.client.view.html',
                seo        : {
                    title      : 'Where we scan - Scanifly',
                    description: 'See if we\'re available in your area',
                    keywords   : ''
                }
            }).
            state('contact', {
                url        : '/contact',
                controller : 'ContactController',
                templateUrl: 'modules/core/views/contact.client.view.html',
                seo        : {
                    title      : 'Contact us - Scanifly',
                    description: 'Drop us a line :)',
                    keywords   : ''
                }
            }).
            state('about-us', {
                url        : '/about-us',
                controller : 'AboutUsController',
                templateUrl: 'modules/core/views/about-us.client.view.html',
                seo        : {
                    title      : 'About us - Scanifly',
                    description: 'Scanifly is a startup dedicated to making solar site assessments safe, accurate, and efficient. The Scanifly Team has experienced the typical solar site assessment first hand.',
                    keywords   : ''
                }
            }).
            state('features', {
                url        : '/features',
                controller : 'FeaturesController',
                templateUrl: 'modules/core/views/features.client.view.html',
                seo        : {
                    title      : 'Features - Scanifly',
                    description: 'What\'s included in the Scanifly solar site assessment',
                    keywords   : ''
                }
            });
    }
]).run(['$rootScope', '$state',
    function ($rootScope, $state) {
        $rootScope.$state = $state;
    }]);
