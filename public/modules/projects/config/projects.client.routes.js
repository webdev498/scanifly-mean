'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
            state('dashboard', {
                url         : '/dashboard',
                authenticate: true,
                resolve     : {
                    projectList : ['Projects', function (Projects) {
                        return Projects.query({
                            dashboard: 1
                        });
                    }],
                    totalActivities: ['Activities', function (Activities) {
                        return Activities.get({'activities': 'all'}).$promise.then(function (activityCount) {
                            return activityCount;
                        }, function (error) {
                            console.log(error);
                        });
                    }],
                    activityList: ['Activities', function (Activities) {
                        return Activities.query().$promise.then(function (activities) {
                            return activities;
                        }, function (error) {
                            console.log(error);
                        });
                    }]
                },
                controller  : 'DashboardController',
                templateUrl : 'modules/projects/views/dashboard.client.view.html',
            }).
            state('list-projects', {
                url         : '/projects/:status',
                authenticate: true,
                resolve     : {
                    projects: ['$stateParams', 'ProjectService', function ($stateParams, ProjectService) {
                        return ProjectService.find($stateParams.status);
                    }],
                    markers: ['ProjectService', 'projects', function (ProjectService, projects) {
                        return ProjectService.getMarkers(projects);
                    }]
                },
                controller  : 'ProjectListController',
                templateUrl : 'modules/projects/views/list-projects.client.view.html'

            }).
            state('create-new-scan', {
                url         : '/project/new-scan',
                authenticate: true,
				resolve     : {
                    stateList: ['States', function (States) {
                        return States.query();
                    }]
                },
                controller  : 'CreateProjectController',
                templateUrl : 'modules/projects/views/create-project.client.view.html'
            }).
/*
            state('create-project', {
                url         : '/project/create',
                authenticate: true,
                resolve     : {
                    stateList: ['States', function (States) {
                        return States.query();
                    }]
                },
                controller  : 'CreateProjectController',
                templateUrl : 'modules/projects/views/create-project.client.view.html'
            }).
			state('create-own-project', {
                url         : '/project/create-own',
                authenticate: true,
                resolve     : {
                    stateList: ['States', function (States) {
                        return States.query();
                    }]
                },
                controller  : 'CreateOwnProjectController',
                templateUrl : 'modules/projects/views/create-own-project.client.view.html'
            }).
            state('project-details', {
                url         : '/project/:projectId',
                authenticate: true,
                resolve     : {
                    project: ['$stateParams', '$location', 'Projects', function ($stateParams, $location, Projects) {
                        return Projects.get({
                            projectId: $stateParams.projectId
                        }).$promise.then(function (project) {
                                return project;
                            }, function (error) {
                                $location.path('/');
                            });
                    }],
                    S3Configuration: ['S3', function (S3) {
                        return S3.get({
                            resource: 's3'
                        });
                    }]
                },
                controller  : 'ProjectDetailsController',
                templateUrl : 'modules/projects/views/project-details.client.view.html'
            }).
*/
            state('edit-project', {
                url        : '/project/:projectId/edit',
                authenticate: true,
                resolve     : {
                    currentProject: ['$stateParams', '$location', 'Projects', function ($stateParams, $location, Projects) {
                        return Projects.get({
                            projectId: $stateParams.projectId
                        }).$promise.then(function (project) {
                                return project;
                            }, function (error) {
                                $location.path('/');
                            });
                    }],
                    stateList: ['States', function (States) {
                        return States.query();
                    }]
                },
                controller  : 'EditProjectController',
                templateUrl: 'modules/projects/views/edit-project.client.view.html'
            }).
//          state('upload-project-data', {
			state('project-details', {
                url         : '/project-upload/:projectId',
                authenticate: true,
                resolve     : {
                    currentProject: ['$stateParams', '$location', 'Projects', function ($stateParams, $location, Projects) {
                        return Projects.get({
                            projectId: $stateParams.projectId
                        }).$promise.then(function (project) {
                                return project;
                            }, function (error) {
                                $location.path('/');
                            });
                    }],
                    S3Configuration: ['S3', function (S3) {
                        return S3.get({
                            resource: 's3'
                        });
                    }]
                },
                controller  : 'UploadProjectDataController',
                templateUrl : 'modules/projects/views/upload-project-data.client.view.html'
            }).
            state('search-projects', {
                url         : '/search-results/:keyword',
                authenticate: true,
                resolve     : {
                    projects: ['$stateParams', 'Projects', function ($stateParams, Projects) {
                        return Projects.query({
                            keyword: $stateParams.keyword || ''
                        });
                    }]
                },
                controller  : 'SearchController',
                templateUrl : 'modules/projects/views/search-results.client.view.html'
            });
    }
]);
