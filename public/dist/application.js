'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName               = 'scanifly';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'adaptive.detection',
        'underscore',
        'datatables',
        'uiGmapgoogle-maps',
        'ngFileUpload',
        'angular-flexslider',
        'bootstrapLightbox'
    ];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName              : applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule                     : registerModule
    };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]).run(["$timeout", function($timeout){
	$timeout(window.googeAnalytics);
	$timeout(window.sessionCam);
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('core').run(['Menus',
    function (Menus) {

        Menus.addMenuItem('header', 'Features', 'features', null, '/features', true);
        // Menus.addMenuItem('header', 'Where We Scan', 'where-we-scan', null, '/where-we-scan', true);
        Menus.addMenuItem('header', 'Contact Us', 'contact', null, '/contact', true);

        Menus.addMenuItem('footer', 'Home', 'home', null, '/', true);
        Menus.addMenuItem('footer', 'Features', 'features', null, '/features', true);
        // Menus.addMenuItem('footer', 'Where We Scan', 'where-we-scan', null, '/where-we-scan', true);
        Menus.addMenuItem('footer', 'About Us', 'about-us', null, '/about-us', true);
        Menus.addMenuItem('footer', 'Contact', 'contact', null, '/contact', true);
        Menus.addMenuItem('footer', 'Terms & Conditions', 'terms-and-conditions', null, '/terms-and-conditions', true);
    }
]);

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

'use strict';

angular.module('core').controller('AboutUsController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);

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

'use strict';

angular.module('core').controller('FeaturesController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);

'use strict';

angular.module('core').controller('FooterController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('footer');
		$scope.currentYear = new Date().getFullYear();

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Acl',
	function($scope, Authentication, Menus, Acl) {
		$scope.authentication = Authentication;
		$scope.isCollapsed    = false;
		$scope.menu           = Menus.getMenu('header');
		$scope.acl            = Acl;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});

		$scope.toggleCustomDropDown = function() {
			$scope.showDropDown = !$scope.showDropDown;
		};

		jQuery(window).on('click', function (event) {
			var $target = jQuery(event.target);
			if ($scope.showDropDown && !$target.hasClass('dropdown-toggle') && !$target.parents('.user-menu').length) {

				$scope.$apply(function () {
					$scope.showDropDown = false;
				});
			}
		});

	}

]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
	function($scope, Authentication, $location) {
        $scope.authentication = Authentication;
	}
]);

'use strict';

angular.module('core').controller('TermsAndConditionsController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);

'use strict';

angular.module('core').controller('WhereWeScanController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
	}
]);

'use strict';

angular.module('core').directive('scroll', ['$window',
    function($window) {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                angular.element($window).bind('scroll', function() {
                    if (this.pageYOffset >= 20) {
                        element.addClass('small');

                    } else {
                        element.removeClass('small');

                    }
                });
            }
        };
    }
]);

'use strict';

angular.module('core').directive('usMap', [
	function() {
		return {
			scope: true,
			restrict: 'A',

			controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
			}],

			link: function (scope, el, attrs) {
				angular.element(document).ready(function () {
					jQuery(el).usmap({
						showLabels: false,
						labelBackingStyles: {
							fill: '#FFFFFF'
						},
						labelBackingHoverStyles: {
							fill: '#7FBCDB'
						},
						labelTextStyles: {
							fill: '#000000'
						},
						stateStyles: {
							fill: '#FFFFFF',
							'stroke': '#999999'
						},
						stateHoverStyles: {
							//fill: '#7FBCDB'
						},
						stateSpecificStyles: {
							'NY': {
								fill: '#005a8b'
							},
							'CT': {
								fill: '#005a8b'
							},
							'CA': {
								fill: '#005a8b'
							},
							'AZ': {
								fill: '#005a8b'
							},
							'CO': {
								fill: '#005a8b'
							},
							'MA': {
								fill: '#005a8b'
							},
							'NJ': {
								fill: '#005a8b'
							}
						}
					});
				});
			}
		};
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding menus
		this.addMenu('header', true);
		this.addMenu('projectNav', false);
		this.addMenu('footer', true);

	}
]);

'use strict';

// Configuring the Articles module
angular.module('projects').run(['Menus',
	function(Menus) {
	}
]);

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

'use strict';

// Activities controller
angular.module('projects').controller('ActivitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Activities',
	function($scope, $stateParams, $location, Authentication, Activities) {
		$scope.authentication = Authentication;



	}
]);

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

'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'ProjectService', 'uiGmapIsReady', 'Acl', 'States',
    function ($scope, $stateParams, $location, Authentication, Projects, ProjectService, uiGmapIsReady, Acl, States) {
        $scope.mapView = false;

        $scope.mapListing = {
            zoom     : 4,
            center   : {
                latitude : 41,
                longitude: -70
            },
            options  : {
                mapTypeId: 'satellite',
                scrollwheel: true
            },
            markers  : []
        };

        $scope.toggleMap = function (displayMap) {
            $scope.mapView = displayMap;
        };

        $scope.dtOptions = {
            filter    : false,
            info      : false,
            paging    : false,
            columnDefs: [
                {targets: 5, sortable: false}
            ]
        };

        // Remove existing Project
        $scope.remove = function (project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects [i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function () {
                    $location.path('projects');
                });
            }
        };

        // Update existing Project
        $scope.update = function () {
            var project = $scope.project;

            project.$update(function () {
                $location.path('projects/' + project._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Projects
        $scope.find = function () {

            $scope.statusFilter = '';

            switch ($stateParams.status) {
                case 'location-submitted' :
                    $scope.statusFilter = 'location-submitted';
                    break;
                case 'flight-scheduled' :
                    $scope.statusFilter = 'flight-scheduled';
                    break;
                case 'flight-successful' :
                    $scope.statusFilter = 'flight-successful';
                    break;
                case 'assessment-complete' :
                    $scope.statusFilter = 'assessment-complete';
                    break;
                case 'resolution-required':
                    $scope.statusFilter = 'resolution-required-or-resolution-complete';
                    break;
                default:
                    $scope.statusFilter = null;
            }

            Projects.query({
                status: $scope.statusFilter
            }, function (projects) {

                var markers = [];
                for (var i = 0; i < projects.length; i++) {
                    var marker = {
                        id       : i,
                        latitude : projects[i].geoLocation.latitude,
                        longitude: projects[i].geoLocation.longitude,
                        name     : projects[i].name,
                        projectId: projects[i]._id,
                        show     : false
                    };
                    markers.push(marker);
                }

                $scope.projects           = projects;
                $scope.mapListing.markers = markers;
            });
        };

        $scope.showNewScan = function () {
            if ($scope.statusFilter === null) {
                return true;
            } else {
                return false;
            }
        };
		
    }
]);

'use strict';

angular.module('projects').controller('CreateOwnProjectController', ['$scope', '$location', '$state', 'ProjectService', 'stateList',
    function ($scope, $location, $state, ProjectService, stateList) {
        $scope.states = stateList;

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

        // Create new Project
        $scope.create = function () {
            // Create new Project object

			$scope.data.selfscan = true;
            $scope.data.propertyImage = generateImageLink();
            var project               = ProjectService.createProject($scope.data);

            // Redirect after save
            project.$save(function (response) {
                $state.go('list-projects');

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

'use strict';

angular.module('projects').controller('EditProjectController', ['$scope', '$location', '$state', 'ProjectService', 'stateList', 'currentProject',
    function ($scope, $location, $state, ProjectService, stateList, currentProject, kWh) {
        $scope.states = stateList;
        $scope.data   = ProjectService.recodeProject(currentProject);

        console.log(currentProject);


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

        // Create new Project
        $scope.update = function () {
            // Create new Project object

            $scope.data.propertyImage = generateImageLink();
            var project               = ProjectService.createProject($scope.data);

            // Redirect after save
            project.$update(function (response) {
                $state.go('list-projects');

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
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

'use strict';

// Projects controller
angular.module('projects').controller('ProjectListController', ['$scope', '$stateParams', '$location', 'uiGmapIsReady', 'projects', 'markers',
    function ($scope, $stateParams, $location, uiGmapIsReady, projects, markers) {

        $scope.projects = projects;

        var statusFilter = '';

        switch ($stateParams.status) {
            case 'location-submitted' :
                statusFilter = 'location-submitted';
                break;
            case 'flight-scheduled' :
                statusFilter = 'flight-scheduled';
                break;
            case 'flight-successful' :
                statusFilter = 'flight-successful';
                break;
            case 'upload-complete' :
                statusFilter = 'upload-complete';
                break;
            case 'resolution-required':
                statusFilter = 'resolution-required-or-resolution-complete';
                break;
            default:
                statusFilter = null;
        }
        $scope.statusFilter = statusFilter;

        $scope.mapListing = {
            view : false,
            zoom     : 4,
            center   : {
                latitude : 41,
                longitude: -70
            },
            options  : {
                mapTypeId: 'satellite',
                scrollwheel: true
            },
            markers  : markers
        };

        $scope.dtOptions = {
            filter    : false,
            info      : false,
            paging    : false,
            columnDefs: [
                {targets: 5, sortable: false}
            ],
            order: [
                [2, 'desc']
            ]
        };


        $scope.toggleMap = function () {
            $scope.mapListing.view = !$scope.mapListing.view;
        };

        $scope.showNewScan = function () {
            if ($scope.statusFilter === null) {
                return true;
            } else {
                return false;
            }
        };

    }
]);

'use strict';
/*jshint loopfunc: true */

angular.module('projects').controller('UploadProjectDataController', ['$rootScope', '$scope', '$q', '$state', '_', 'Authentication', 'Upload', 'ProjectDetails', 'currentProject', 'S3Configuration', '$detection', '$location', '$anchorScroll',
    function ($rootScope, $scope, $q, $state, _, Authentication, Upload, ProjectDetails, currentProject, S3Configuration, $detection, $location, $anchorScroll) {
		$scope.authentication = Authentication;
        $scope.user           = $scope.authentication.user;
		
        $scope.project      = currentProject;
        $scope.threeDviewerUrl = 'http://scaniflypv.com?ID=' + $scope.project._id;
        console.log($scope.threeDviewerUrl);
		$scope.addNoteForm = {
            value: false,
            hideQuestion: false
        };
		$scope.isIos = $detection.isiOS();
        $scope.uploadErrors = {roofs: {}};

        $scope.$on('newProjectCreated',function(event, toState, toParams, fromState, fromParams) {
            setTimeout(function(){
                alert('Thanks!\nWe will notify you when the flight is scheduled, completed,\nand when we upload your 3D model and images.');
            }, 1000);
        });

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
		
		$scope.modelviewer = function() {
			if (document.getElementById('3Dmodel').value === 'min')
			{
				$location.hash('start3D');
				$anchorScroll();
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
				document.getElementById('3Dmodel').value = 'min';
				document.getElementById('3Dmodel').className = 'container';
				document.getElementById('enabler').className = 'disabled';
				document.getElementById('adjustMessage').innerHTML = 'Click to Maximize 3D Model Window';
				document.getElementById('iframe').height = '300';
			}
		};
        $scope.uploadTmp = {
            droneImages    : {
//                topImage: [],
                eyeView : []
            },
            additionalFiles: [],
            shadeReport    : {
/*                roofImage        : [],
                roofNotationImage: [],
                magDec           : '',
                reportAuthor     : '',
                siteAssessor     : '',		*/
                roofs            : {}
            }

        };

        for (var i = 0, roofs = {}; i < $scope.project.map.markers.length; i++) {
            roofs[$scope.project.map.markers[i].name] = {
                image           : [],
                shadeImages     : [],
                siteAssessorName: ''
            };
        }

        $scope.uploadTmp.shadeReport.roofs = roofs;

        if ($scope.project.details) {

            $scope.updateAction = true;
            $scope.data         = $scope.project.details;

        } else {

            $scope.updateAction    = false;
            $scope.data            = angular.copy($scope.uploadTmp);
            $scope.data.roofPlanes = [];
            $scope.data.model3d    = [];

            for (var j = 0, roofPlanes = []; j < $scope.project.map.markers.length; j++) {
                roofPlanes.push({
                    '1-roof-plane'                 : $scope.project.map.markers[j].name,
                    '2-azimuth'                    : '',
                    '3-tilt'                       : '',
                    '4-average-annual-solar-access': '',
                    '5-tsrf'                       : '',
                    '6-tof'                        : ''
                });
            }
            $scope.data.roofPlanes = roofPlanes;

        }

        var prepareNewValues = function (newValues, shadeImage) {
            var values = [];
            for (var i = 0; i < newValues.length; i++) {
                var key   = currentProject._id + '/' + (new Date()).getTime() + '-' + newValues[i].name;
                values[i] = {
                    key      : key,
                    name     : newValues[i].name,
                    imagePath: S3Configuration.bucketUrl + key,
                    data     : newValues[i]
                };

                if (shadeImage) {
                    values[i].number            = 0;
                    values[i].annualSolarAccess = '';
                }
            }
            return values;
        };
/*
        $scope.$watch('uploadTmp.droneImages.topImage', function (newValues) {
            if (!(newValues && newValues.length)) {
                return;
            }
            delete $scope.uploadErrors.topImage;
            var values                       = prepareNewValues(newValues);
            $scope.data.droneImages.topImage = values;
        });
*/
        $scope.$watch('uploadTmp.droneImages.eyeView', function (newValues) {
            if (!(newValues && newValues.length)) {
                return;
            }
            delete $scope.uploadErrors.eyeView;
            var values                      = prepareNewValues(newValues);
            $scope.data.droneImages.eyeView = _.union(
                $scope.data.droneImages.eyeView, values
            );
        });

        $scope.$watch('uploadTmp.additionalFiles', function (newValues) {
            if (!(newValues && newValues.length)) {
                return;
            }
            delete $scope.uploadErrors.additionalFiles;
            var values                  = prepareNewValues(newValues);
            $scope.data.additionalFiles = _.union(
                $scope.data.additionalFiles, values
            );
        });
/*
        $scope.$watch('uploadTmp.shadeReport.roofImage', function (newValues) {
            if (!(newValues && newValues.length)) {
                return;
            }
            delete $scope.uploadErrors.roofImage;
            var values                        = prepareNewValues(newValues);
            $scope.data.shadeReport.roofImage = values;
        });

        $scope.$watch('uploadTmp.shadeReport.roofNotationImage', function (newValues) {
            if (!(newValues && newValues.length)) {
                return;
            }
            delete $scope.uploadErrors.roofNotationImage;
            var values                                = prepareNewValues(newValues);
            $scope.data.shadeReport.roofNotationImage = values;
        });
*/
/*
        for (var roofName in $scope.data.shadeReport.roofs) {
            (function (roofName) {
                $scope.$watch('uploadTmp.shadeReport.roofs[\'' + roofName + '\'].image', function (newValues) {
                    if (!(newValues && newValues.length)) {
                        return;
                    }
                    if ($scope.uploadErrors.roofs[roofName]) {
                        delete $scope.uploadErrors.roofs[roofName];
                    }
                    var values                                    = prepareNewValues(newValues);
                    $scope.data.shadeReport.roofs[roofName].image = values;
                });
                $scope.$watch('uploadTmp.shadeReport.roofs[\'' + roofName + '\'].shadeImages', function (newValues) {
                    if (!(newValues && newValues.length)) {
                        return;
                    }
                    var values                                          = prepareNewValues(newValues, true);
                    $scope.data.shadeReport.roofs[roofName].shadeImages = _.union(
                        $scope.data.shadeReport.roofs[roofName].shadeImages, values
                    );
                });
            })(roofName);
        }
*/

        $scope.removeImage = function (identifier, index, roofName) {
            switch (identifier) {
/*
				case 'topImage' :
                    $scope.data.droneImages.topImage.splice(0, 1);
                    break;
*/
                case 'eyeView' :
                    $scope.data.droneImages.eyeView.splice(index, 1);
                    break;
                case 'additionalFiles' :
                    $scope.data.additionalFiles.splice(index, 1);
                    break;
/*
					case 'roofImage' :
                    $scope.data.shadeReport.roofImage.splice(0, 1);
                    break;
                case 'roofNotationImage' :
                    $scope.data.shadeReport.roofNotationImage.splice(0, 1);
                    break;
                case 'individualRoofImage' :
                    $scope.data.shadeReport.roofs[index].image.splice(0, 1);
                    break;
                case 'shadeImages' :
                    $scope.data.shadeReport.roofs[roofName].shadeImages.splice(index, 1);
                    break;
*/
			}
        };

        var progressFunction = function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        };

        var successFunction = function (data, status, headers, config) {
            console.log('file ' + config.file.name + ' uploaded');
			$scope.uploadSuccessful();
            return data;
        };

        var errorFunction = function (error) {
            console.error('error on file upload');
            return error;
        };
		
		$scope.uploadSuccessful = function()
		{
			$scope.project.uploadComplete = new Date();
			$scope.project.status  = 'upload-complete';
			$scope.project.$update(function() {
				$state.go($state.current, {}, {reload: true});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}); 
		};

        var uploadFiles = function (files) {

            var promises = [];

            if (files && files.length) {

                for (var i = 0; i < files.length; i++) {
                    var file = Object.create(files[i]);

                    if (file.data) {
                        var promise = Upload.upload({
                            url   : S3Configuration.bucketUrl,
                            method: 'POST',
                            fields: {
                                key           : file.key,
                                AWSAccessKeyId: S3Configuration.AWSAccessKeyId,
                                acl           : 'public-read',
                                policy        : S3Configuration.policy,
                                signature     : S3Configuration.signature,
                                'Content-Type': (file.data.type !== '') ? file.data.type : 'application/octet-stream'
                            },
                            file  : file.data,
                        }).progress(progressFunction)
                            .success(successFunction)
                            .error(errorFunction);

                        promises.push(promise);
                    }
                }

            }

            return $q.all(promises);
        };

        var clearDataFileField = function (fileList) {
            if (fileList && fileList.length > 0) {
                for (var i = 0; i < fileList.length; i++) {
                    delete fileList[i].data;
                }
            }
        };

        var validateUploadFiles = function (uploadForm) {
            $scope.uploadErrors = {};
/*
            if (!$scope.data.droneImages.topImage.length) {
                $scope.uploadErrors.topImage = 'Please upload a Top Down Image';
            }
            uploadForm.$setValidity('files-topimage', !$scope.uploadErrors.topImage);
*/
            if (!$scope.data.droneImages.eyeView.length) {
                $scope.uploadErrors.eyeView = 'Please upload Drone\'s Eye View Images';
            }
            uploadForm.$setValidity('files-eyeView', !$scope.uploadErrors.eyeView);

            if (!$scope.data.additionalFiles.length) {
                $scope.uploadErrors.additionalFiles = 'Please upload the 3D model';
            }
            uploadForm.$setValidity('files-additionalFiles', !$scope.uploadErrors.additionalFiles);
/*
            if (!$scope.data.shadeReport.roofImage.length) {
                $scope.uploadErrors.roofImage = 'Please upload the Roof Image';
            }
            uploadForm.$setValidity('files-roofImage', !$scope.uploadErrors.roofImage);

            if (!$scope.data.shadeReport.roofNotationImage.length) {
                $scope.uploadErrors.roofNotationImage = 'Please upload the Roof Notation Image';
            }
            uploadForm.$setValidity('files-roofNotationImage', !$scope.uploadErrors.roofNotationImage);

            $scope.uploadErrors.roofs = {};
            for (var roofName in $scope.data.shadeReport.roofs) {
                var roof = $scope.data.shadeReport.roofs[roofName];

                if (!roof.image || !roof.image.length) {
                    $scope.uploadErrors.roofs[roofName] = 'Please upload the Image for Roof ' + roofName;
                }
                uploadForm.$setValidity('files-roof-' + roofName, !$scope.uploadErrors.roofs[roofName]);
            }
*/
        };

        var mergeFilesForUpload = function () {

            var files = _.union(
//                $scope.data.droneImages.topImage,
                $scope.data.droneImages.eyeView,
                $scope.data.additionalFiles			//,
//                $scope.data.shadeReport.roofImage,
//                $scope.data.shadeReport.roofNotationImage
            );

            for (var roofName in $scope.data.shadeReport.roofs) {
                var roof = $scope.data.shadeReport.roofs[roofName];

                files = _.union(files, roof.image);
                files = _.union(files, roof.shadeImages);
            }

            return files;
        };

        var clearDataFileFields = function () {
//           clearDataFileField($scope.data.droneImages.topImage);
            clearDataFileField($scope.data.droneImages.eyeView);
            clearDataFileField($scope.data.additionalFiles);
//            clearDataFileField($scope.data.shadeReport.roofImage);
//            clearDataFileField($scope.data.shadeReport.roofNotationImage);
/*
            for (var roofName in $scope.data.shadeReport.roofs) {
                clearDataFileField($scope.data.shadeReport.roofs[roofName].image);
                clearDataFileField($scope.data.shadeReport.roofs[roofName].shadeImages);
            }
*/
        };

        $scope.upload = function (uploadForm) {

            $scope.startUploadData               = true;
            $scope.data.shadeReport.reporterName = Authentication.user.name;

            validateUploadFiles(uploadForm);

            if (uploadForm.$valid) {

                var files = mergeFilesForUpload();

                uploadFiles(files).then(function (returnedData) {

                    clearDataFileFields();

                    $scope.data.projectInfo = {
                        '_id'    : $scope.project._id,
                        'company': $scope.project.company
                    };

                    if ($scope.data._id) {
                        console.log('Here');
                        ProjectDetails.update($scope.data, function (projectDetail) {
                            console.log(projectDetail);
                            $scope.startUploadData = false;
                            $state.go('project-details', {'projectId': $scope.project._id}, {reload: true});
                        }, function (errorResponse) {
                            $scope.startUploadData = false;
                            $scope.error           = errorResponse.data.message;
                        });
                    } else {
                        console.log('There');
                        ProjectDetails.save($scope.data, function (projectDetail) {
                            console.log('Success - Project Details creating');
                            $scope.project.details = projectDetail._id;
                            $scope.project.$update(function(response) {
                                console.log('Success - Project Updating');
                                $scope.startUploadData = false;
                                $state.go('project-details', {'projectId': $scope.project._id}, {reload: true});
                            }, function(errorResponse) {
                                console.log('Fail - Project Updating');
                                $scope.startUploadData = false;
                                $scope.error           = errorResponse.data.message;
                            });
                            
                        }, function (errorResponse) {
                            console.log('Failed - Project Details creating');
                            $scope.startUploadData = false;
                            $scope.error           = errorResponse.data.message;
                        });
                    }
                }, function (errorResponse) {
                    $scope.startUploadData = false;
                    $scope.error           = 'An error occurred when trying to upload a file';
                });

            } else {
                $scope.startUploadData = false;
                //$scope.error           = uploadForm.$error;
                $scope.error = 'Please fill out the fields';
            }
        };

    }
]).filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

'use strict';

// Projects controller
angular.module('projects').controller('SearchController', ['$scope', 'projects',
    function ($scope, projects) {

        $scope.projects = projects;

        $scope.dtOptions = {
            filter    : false,
            info      : false,
            paging    : false,
            columnDefs: [
                {targets: 5, sortable: false}
            ]
        };

    }
]);

'use strict';

angular.module('projects').directive('accessibleForm', [
	function() {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				elem.on('submit', function () {
					var firstInvalid = elem[0].querySelector('.ng-invalid');
					if (firstInvalid) {
						firstInvalid.focus();
					}
				});
			}
		};
	}
]);

'use strict';

angular.module('projects').directive('blockEnter', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.bind('keydown keypress', function (event) {
					if(event.which === 13) {
						event.preventDefault();
					}
				});

			}
		};
	}
]);

'use strict';

angular.module('projects').directive('createProjectMap', [
    function () {
        return {
            restrict   : 'E',
            scope      : false,
            controller : ["$scope", function ($scope) {
                var alphabet = [];
                for (var i = 0; i < 26; i++) {
                    alphabet.push(String.fromCharCode(65 + i));
                }

                if (!$scope.data) {
                    $scope.data = {
                        map: {
                            zoom       : 3,
                            center     : {
                                latitude : 37.1677,
                                longitude: -97.2639
                            },
                            options    : {
                                mapTypeId        : 'satellite',
                                scrollwheel      : true,
                                streetViewControl: false,
                                tilt             : 0
                            },
                            markers    : [],
                            markerLabel: '',
                            noOfMarkers: 0,
                            bounds     : {}
                        }
                    };
                }

                $scope.addMarker = function () {

                    if ($scope.data.map.noOfMarkers >= 26) {
                        return;
                    }

                    $scope.data.map.noOfMarkers += 1;

                    $scope.data.map.markers.push({
                        id     : $scope.data.map.noOfMarkers,
                        name   : alphabet[$scope.data.map.noOfMarkers - 1],
                        coords : {
                            latitude : $scope.data.map.center.latitude,
                            longitude: $scope.data.map.center.longitude
                        },
                        options: {
                            icon     : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + alphabet[$scope.data.map.noOfMarkers - 1] + '|FFFFFF|000000',
                            fillColor: '#0000FF',
                            draggable: true
                        }
                    });
                };

                $scope.removeMarker = function (id) {
                    $scope.data.map.noOfMarkers -= 1;
                    $scope.data.map.markers.pop();
                };

                $scope.renderMap = function () {
                    $scope.data.map.center = {
                        latitude : $scope.data.latitude,
                        longitude: $scope.data.longitude
                    };
                    $scope.data.map.zoom   = 20;
                };

            }],
            templateUrl: 'modules/projects/views/directives/create-project/map.client.directive.html'
        };
    }
]);

'use strict';

/*global JSZip */
/*global saveAs */
/*jshint loopfunc: true */

angular.module('projects')
    
    .directive('downloadReport', [
        function () {
            return {
                templateUrl: 'modules/projects/views/directives/download-report.client.directive.html',
                restrict   : 'E',
                controller : ["$scope", "$detection", "$window", function ($scope, $detection, $window) {
                    $scope.isIos       = $detection.isiOS();
                    $scope.downloadUrl = '';

                    $scope.downloadReport = function () {
                        $scope.downloadUrl     = '/download/' + $scope.project._id + '?c=' + (new Date()).getTime();
                    };

                }]
            };
        }
    ]);

'use strict';

angular.module('projects').directive('projectReport', ['$http',
    function($http) {
        return {
            templateUrl: 'modules/projects/views/directives/project-report.client.directive.html',
            restrict: 'E',
            controller: ["$scope", "$sce", "Lightbox", function($scope, $sce, Lightbox) {
                $scope.downloadShadeReportUrl = '';

                $scope.unSanitizeHtml = function(html) {
                    return $sce.trustAsHtml(html);
                };
                Lightbox.templateUrl = 'modules/projects/views/directives/lightbox/lightbox.html';
                $scope.openLightboxModal = function (image, index) {
                    Lightbox.getImageUrl = function(image) {

                        return image.imagePath;

                    };

                    Lightbox.openModal($scope.project.details.droneImages.eyeView, index);

                    if($scope.project.details.droneImages.eyeView.length <= 1){
                        Lightbox.hideControlls = true;

                    }

                };

                $scope.openLightboxModalOne = function (image, index) {
                    Lightbox.getImageUrl = function(image) {

                        return image.imagePath;

                    };

                    Lightbox.openModal($scope.project.details.droneImages.topImage, index);
                    if($scope.project.details.droneImages.topImage.length <= 1){
                        Lightbox.hideControlls = true;

                    }

                };

                $scope.tabs = [
                    { title:'Dynamic Title 1', content:'Dynamic content 1' },
                    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
                ];

                $scope.downloadShadeReport = function () {
                    $scope.downloadShadeReportUrl     = '/download-shade-report/' + $scope.project._id + '?c=' + (new Date()).getTime();
                };

                $scope.multiplyPercentages = function(x, y) {
                    return (((x/100) * (y/100)) * 100).toFixed(2);
                };

            }]


        };
    }
]);

'use strict';

angular.module('projects').directive('projectsHeader', ['$state', '$stateParams', 'Acl', 'Authentication',
    function ($state, $stateParams, Acl, Authentication) {
        return {
            scope      : true,
            templateUrl: 'modules/projects/views/directives/projects-header.client.directive.html',
            restrict   : 'E',
            controller : ["$scope", function ($scope) {
                var currentUser  = Authentication.user;
                $scope.acl       = Acl;
                $scope.keyword   = $stateParams.keyword || '';
                $scope.filtersOn = false;
                $scope.searchPlaceholder = ' Search Project ';
                
                if (currentUser.role === 'scanifly-admin') {
                    $scope.searchPlaceholder = ' Search by Project or by Company ';
                }

                $scope.search = function () {

                    var answer = true;
                    if ($state.current.name === 'create-project') {
                        answer = confirm('Requesting a search will redirect you from this page. Would you like to continue ?');
                    }

                    if (answer) {
                        $state.go('search-projects', {
                            keyword: $scope.keyword
                        }, {
                            reload: true
                        });
                    }
                };

                $scope.toggleFilters    = function () {
                    $scope.filtersOn = !$scope.filtersOn;
                };
                $scope.toggleProjectBar = function () {
                    $scope.showProjectBar = !$scope.showProjectBar;

                };
                $scope.showSearchBar    = function () {
                    $scope.showSearch = true;
                    jQuery('.search-input').focus();

                };
                $scope.hideSearchBar    = function () {
                    $scope.showSearch = false;
                    $scope.keyword    = '';

                };


                if ($state.current.name === 'list-projects') {

                    $scope.stickyFilter = true;
                }
                jQuery(window).on('click', function (event) {
                    var $target = jQuery(event.target);
                    if ($scope.showProjectBar && !$target.hasClass('link-projects') && !$target.parents('.my-projects').length) {

                        $scope.$apply(function () {
                            $scope.showProjectBar = false;
                        });
                    }
                });
            }]
        };
    }
]);

'use strict';

angular.module('projects').directive('statusBar', [
    function() {
        return {
            templateUrl: 'modules/projects/views/directives/status-bar.client.directive.html',
            restrict: 'E',
            controller: ["$scope", function($scope) {
                var projectStatus = $scope.project.status;
                
                // available statuses in reverse order of how to show them
                var availableStatuses = [/*{
                        status: 'resolution-complete',
                        value: false,
                        current: false
                    },
                    {
                        status: 'resolution-required',
                        value: false,
                        current: false
                    },*/
                    {
                        status: 'upload-complete',
                        value: false,
                        current: false
                    },
                    {
                        status: 'flight-successful',
                        value: false,
                        current: false
                    },
                    {
                        status: 'flight-scheduled',
                        value: false,
                        current: false
                    },
                    {
                        status: 'location-submitted',
                        value: false,
                        current: false
                    }];

                var newValue = false;
                for (var elementId in availableStatuses) {
                    
                    if (availableStatuses[elementId].status === projectStatus) {
                        newValue = true;
                        availableStatuses[elementId].current = true;
                    }
                    availableStatuses[elementId].value = newValue;
                }
                availableStatuses.reverse();
                $scope.availableStatuses = availableStatuses;
            }]
        };
    }
]);

'use strict';

angular.module('projects').directive('assessmentComplete', ['$state', '$stateParams',
    function ($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/assessment-complete.client.directive.html',
            restrict   : 'E',
            controller : ["$scope", function ($scope) {
                $scope.upload = function() {
                    $state.go('upload-project-data', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
                
                $scope.markAsApproved = function() {
                    $scope.project.assessmentComplete = new Date();
                    $scope.project.isApproved = true;
                    $scope.project.status  = 'assessment-complete';
                    $scope.project.$update(function() {
                        $state.go($state.current, {}, {reload: true});
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });                    
                };
            }]
        };
    }
]);

'use strict';

angular.module('projects').directive('markAsSuccessful', ['$state', 
    function($state) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/mark-as-successful.client.directive.html',
            restrict: 'E',
            controller: ["$scope", function($scope) {

                $scope.showSchedulePanel = false;
                $scope.minDate           = new Date();

                $scope.toggleSchedulePanel = function () {
                    $scope.showSchedulePanel = !$scope.showSchedulePanel;
                };

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.dateOptions = {
                    startingDay: 0
                };

                $scope.schedule = function () {
                    if (angular.isDefined($scope.data.date)) {
                        var date                       = $scope.data.date;
                        $scope.project.scheduledFlight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $scope.data.time);
                        var project                    = $scope.project;

                        project.$update(function () {
                            $state.go($state.current, {}, {reload: true});
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                };

                $scope.markAsSuccessful = function() {
                    $scope.project.successfulFlight = new Date();
                    $scope.project.status = 'flight-successful';
                    $scope.project.$update(function() {
                        $state.go($state.current, {}, {reload: true});
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };
            }]
        };
    }
]);

'use strict';

angular.module('projects').directive('resolutionRequired', ['$state', '$stateParams',
    function($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/resolution-required.client.directive.html',
            restrict: 'E',
            controller: ["$scope", function($scope) {

                $scope.upload = function() {
                    $state.go('upload-project-data', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
                
                $scope.markResolutionComplete = function() {
                    $scope.project.status = 'resolution-complete';
                    $scope.project.isCompleted = true;
                    $scope.project.completeDate = new Date();
                    $scope.project.$update(function() {
                        $state.go($state.current, {}, {reload: true});
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });                    
                };
            }]
        };
    }
]);

'use strict';

angular.module('projects').directive('scheduleFlight', ['$state','Companies',
    function ($state,Companies) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/schedule-flight.client.directive.html',
            restrict   : 'E',
            controller : ["$scope", function ($scope) {
                $scope.data              = {};
                $scope.showSchedulePanel = false;
                $scope.minDate           = new Date();

                $scope.toggleSchedulePanel = function () {
                    $scope.showSchedulePanel = !$scope.showSchedulePanel;
                };

                $scope.open = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.opened = true;
                };

                $scope.dateOptions = {
                    startingDay: 0
                };

                $scope.schedule = function () {
                    if (angular.isDefined($scope.data.date)) {
                        var date                       = $scope.data.date;
                        $scope.project.scheduledFlight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $scope.data.time);
                        $scope.project.status          = 'flight-scheduled';
                        var project                    = $scope.project;

                        project.$update(function () {
                            $state.go($state.current, {}, {reload: true});
                        }, function (errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });
                    }
                };
                
                $scope.declineProject = function () {
                    var project = $scope.project;
                    project.status = 'declined';
                    var answer = confirm('Are you sure you want to decline this project ?');
                    
                    if (answer) {
                        Companies.query({},function(companies){
                            for(var index in companies){
                                if(companies[index].companyId === project.company._id){
                                    project.companyAdminEmail = companies[index].admins[0].email;
                                }
                            }

                            project.$delete(function(response) {
                                $state.go('dashboard', {}, {reload: true});
                            }, function (errorResponse) {
                                $scope.error = errorResponse.data.message;
                            });
                        });
                    }
                };
            }]
        };
    }
]);

'use strict';

angular.module('projects').directive('uploadComplete', ['$state', '$stateParams',
    function ($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/status-changes/upload-complete.client.directive.html',
            restrict   : 'E',
            controller : ["$scope", function ($scope) {
                $scope.upload = function() {
                    // $state.go('upload-project-data', {
                    $state.go('project-details', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
                
                $scope.markAsApproved = function() {
                    $scope.project.uploadComplete = new Date();
                    $scope.project.isApproved = true;
                    $scope.project.status  = 'upload-complete';
                    $scope.project.$update(function() {
                        $state.go($state.current, {}, {reload: true});
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });                    
                };
            }]
        };
    }
]);

'use strict';

angular.module('projects').directive('uploadData', ['$state', '$stateParams',
    function($state, $stateParams) {
        return {
            templateUrl: 'modules/projects/views/directives/upload-data.client.directive.html',
            restrict: 'E',
            controller: ["$scope", function($scope) {
                
                $scope.upload = function() {
                    $state.go('upload-project-data', {
                        projectId: $stateParams.projectId
                    }, {
                        reload: true
                    });
                };
            }]
        };
    }
]);

'use strict';

angular.module('projects').filter('cleanNumberedText', [
    function () {
        return function (input) {
            if (input) {
                input = input.replace(/[0-9]/g, '');
                input = input.replace(/-/g, ' ');
                return input;
            } else {
                return input;
            }
        };
    }
]);


'use strict';

angular.module('projects').filter('range', [
    function () {
        return function (input, from, to, format) {
            from = parseInt(from);
            to   = parseInt(to);

            for (var i = from; i <= to; i++) {
                if (format) {
                    input.push(format.replace('#', i));
                } else {
                    input.push(i);
                }
            }

            return input;
        };
    }
]);

'use strict';

angular.module('projects').filter('removeDash', [
    function () {
        return function (input) {
            if (input) {
                return input.replace(/-/g, ' ');
            } else {
                return 'All Projects';
            }
        };
    }
]);


'use strict';

//Activities service used to communicate Activities REST endpoints
angular.module('projects').factory('Activities', ['$resource',
	function($resource) {
		return $resource('activities/:activityId', { activityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Notes service used to communicate Notes REST endpoints
angular.module('projects').factory('Notes', ['$resource',
	function($resource) {
		return $resource('notes/:noteId', { noteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Project details service used to communicate Project details REST endpoints
angular.module('projects').factory('ProjectDetails', ['$resource',
    function ($resource) {
        return $resource('project-details/:projectDetailId', {
            projectDetailId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects')
    .factory('Projects', ['$resource',
        function ($resource) {
            return $resource('projects/:projectId', {
                projectId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                },
                delete: {
                    method: 'DELETE'
                }
            });
        }
    ])
    .service('ProjectService', ['Projects', '$q',
        function (Projects, $q) {

            this.find = function (status) {

                return Projects.query({
                    status: status
                });
            };

            this.getMarkers = function (projectsResource) {

                var deferred = $q.defer();

                projectsResource.$promise.then(function (projects) {
                    var markers = [];

                    for (var i = 0; i < projects.length; i++) {

                        var marker = {
                            id       : i,
                            latitude : projects[i].geoLocation.latitude,
                            longitude: projects[i].geoLocation.longitude,
                            name     : projects[i].name,
                            projectId: projects[i]._id,
                            show     : false
                        };
                        markers.push(marker);
                    }

                    deferred.resolve(markers);

                });

                return deferred.promise;
            };

            this.recodeProject = function (dbProject) {

                var data = {
                    '_id'          : dbProject._id,
                    name           : dbProject.name,
                    propertyImage  : dbProject.propertyImage,
                    street         : dbProject.address.street,
                    city           : dbProject.address.city,
                    state          : dbProject.address.stateName + '-' + dbProject.address.state,
                    zip            : dbProject.address.zip,
                    map            : dbProject.map,
                    firstName      : dbProject.ownerDetails.firstName,
                    lastName       : dbProject.ownerDetails.lastName,
                    phone          : dbProject.ownerDetails.phone,
                    email          : dbProject.ownerDetails.email,
 					month1		   : dbProject.kWh.month1,
					month2		   : dbProject.kWh.month2,
					month3		   : dbProject.kWh.month3,
					month4		   : dbProject.kWh.month4,
					month5		   : dbProject.kWh.month5,
					month6		   : dbProject.kWh.month6,
					month7		   : dbProject.kWh.month7,
					month8		   : dbProject.kWh.month8,
					month9		   : dbProject.kWh.month9,
					month10		   : dbProject.kWh.month10,
					month11		   : dbProject.kWh.month11,
					month12		   : dbProject.kWh.month12,
					annual		   : dbProject.kWh.annual,
                    nearTrees      : dbProject.propertyDetails.nearTrees,
                    nearAirport    : dbProject.propertyDetails.nearAirport,
                    nearHighVoltage: dbProject.propertyDetails.nearHighVoltage,
                    nearHighway    : dbProject.propertyDetails.nearHighway,
					selfscan	   : dbProject.selfscan,
                    status         : dbProject.status,
                };

                return data;
            };

            this.createProject = function (data) {

                var stateArray = [];

                if (angular.isDefined(data.state)) {
                    stateArray = data.state.split('-');
                }

                var project = new Projects({
                    name           : data.name,
                    propertyImage  : data.propertyImage,
                    address        : {
                        street   : data.street,
                        city     : data.city,
                        state    : stateArray[1] || '',
                        stateName: stateArray[0] || '',
                        zip      : data.zip
                    },
                    geoLocation    : {
                        latitude : data.map.center.latitude,
                        longitude: data.map.center.longitude
                    },
                    map            : data.map,
                    ownerDetails   : {
                        firstName: data.firstName,
                        lastName : data.lastName,
                        phone    : data.phone,
                        email    : data.email
                    },
					kWh			   : {
						month1   : data.month1,
						month2   : data.month2,
						month3   : data.month3,
						month4   : data.month4,
						month5   : data.month5,
						month6   : data.month6,
						month7   : data.month7,
						month8   : data.month8,
						month9   : data.month9,
						month10  : data.month10,
						month11  : data.month11,
						month12  : data.month12,
						annual	 : data.annual
					},
                    propertyDetails: {
                        nearTrees      : data.nearTrees,
                        nearAirport    : data.nearAirport,
                        nearHighVoltage: data.nearHighVoltage,
                        nearHighway    : data.nearHighway
                    },
					selfscan	   : data.selfscan,
                    status         : data.status || ''
                });

                if (data._id) {
                    project._id = data._id;
                }

                return project;
            };
        }
    ]);

'use strict';

angular.module('projects').factory('S3', ['$resource',
	function($resource) {
		return $resource('configuration/:resource', { resource: '@_id'});
	}
]);

'use strict';

angular.module('projects').factory('States', ['$resource',
	function($resource) {
		return $resource('modules/projects/config/states.json', {}, {});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
    function ($httpProvider) {
        // Set the httpProvider "not authorized" interceptor
        $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
            function ($q, $location, Authentication) {
                return {
                    responseError: function (rejection) {
                        switch (rejection.status) {
                            case 401:
                                // Deauthenticate the global user
                                Authentication.user = null;

                                // Redirect to signin page
                                $location.path('signin');
                                break;
                            case 403:
                                // Add unauthorized behaviour
                                break;
                        }

                        return $q.reject(rejection);
                    }
                };
            }
        ]);
    }
]).run(['$rootScope', 'Acl',
    function ($rootScope, Acl) {
        $rootScope.$on('$stateChangeStart', Acl.handleAuthenticationRedirects);
        $rootScope.acl = Acl;
    }
]);

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

'use strict';
angular.module('users').directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.companydata, function(value){
          var data = value.admins;
          if(data !== undefined){
          	data = data[0];
			var admin_name = data.name;
			var admin_email = data.email;
			jQuery(element).find('#admin_name').val(admin_name);
			jQuery(element).find('#admin_email').val(admin_email);
          }

        });
        scope.$watch(attrs.visible, function(value){
          if(value === true)
            jQuery(element).modal('show');
          else
            jQuery(element).modal('hide');
        });

        jQuery(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        jQuery(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });



angular.module('users').controller('CompanyManagementController', ['$scope', '$state', '$http', '$location', 'Authentication', 'Companies', 'Projects',
	function($scope, $state, $http, $location, Authentication, Companies, Projects) {
        $scope.user      = Authentication.user;
        $scope.companies = {};
		$scope.projects = {};

        // If user is not signed in then redirect back home
        if (!$scope.user || (!$scope.acl.hasAccess('company-management') && !$scope.acl.hasAccess('edit-company'))) {
            $location.path('/');
        }

        $scope.submitted   = false;
        $scope.isCollapsed = true;

        // DataTable options
        $scope.dtOptions = {
            filter: false,
            info  : false,
            paging: false,
            columnDefs: [
                { targets: -1, sortable: false }
            ]
        };

		$scope.listCompanies = function() {
			$scope.companies = Companies.query({});
		};

        // Update a company profile
        $scope.updateCompanyProfile = function(companyForm) {
            $scope.submitted = true;
            $scope.success   = $scope.error = null;

            if (companyForm.$valid) {
                $scope.success = $scope.error = null;

                var company = new Companies($scope.user.company);

                company.$update(function(response) {
                    $scope.success = 'Company saved successfully';
                    companyForm.$setPristine();
                    Authentication.user = response;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.error = 'Please fill out the form';
            }

        };
		
		
		$scope.projects = Projects.query({});
		
		// Count projects with "Location Submitted" status
		$scope.countLocationsSubmitted = function(company_id) {
			$scope.locationsSubmittedCount = 0;
			for (var i in $scope.projects)
			{
				if (($scope.projects[i].company && $scope.projects[i].company._id) === company_id)
				{
					if ($scope.projects[i].status === 'location-submitted')
					{
						$scope.locationsSubmittedCount += 1;
					}
				}
			}
			return $scope.locationsSubmittedCount;
		};

		// Count projects with "Flight Scheduled" status
		$scope.countFlightsScheduled = function(company_id) {
			$scope.flightsScheduledCount = 0;
			for (var i in $scope.projects)
			{
				if (($scope.projects[i].company && $scope.projects[i].company._id) === company_id)
				{
					if ($scope.projects[i].status === 'flight-scheduled')
					{
						$scope.flightsScheduledCount += 1;
					}
				}
			}
			return $scope.flightsScheduledCount;
		};
		
		// Count projects with "Flight Successful" status
		$scope.countFlightsSuccessful = function(company_id) {
			$scope.flightsSuccessfulCount = 0;
			for (var i in $scope.projects)
			{
				if (($scope.projects[i].company && $scope.projects[i].company._id) === company_id)
				{
					if ($scope.projects[i].status === 'flight-successful')
					{
						$scope.flightsSuccessfulCount += 1;
					}
				}
			}
			return $scope.flightsSuccessfulCount;
		};
		
		// Count projects with "Data Upload" status
		$scope.countDataUpload = function(company_id) {
			$scope.dataUploadCount = 0;
			for (var i in $scope.projects)
			{
				if (($scope.projects[i].company && $scope.projects[i].company._id) === company_id)
				{
					if ($scope.projects[i].status === 'upload-complete')
					{
						$scope.dataUploadCount += 1;
					}
				}
			}
			return $scope.dataUploadCount;
		};

		$scope.removeCompany = function(company){
			var company_id = company.companyId;
			var r = confirm('Do you want to really remove this company?');
			if (r === true) {
				Companies.delete({companyId : company_id}).$promise.then(function() {
					jQuery.each($scope.companies, function(i){
					    if($scope.companies[i].companyId === company.companyId) {
					        $scope.companies.splice(i,1);
					        return false;
					    }
					});
					console.log('Company successfully removed');
				});
			}
		};

		$scope.getProjectsByCompanyID = function(company) {
			var myProjects = [];
			var company_id = company.companyId;

			for(var i in $scope.projects){
				if(($scope.projects[i].company && $scope.projects[i].company._id) === company_id){
					myProjects.push($scope.projects[i]);
				}
			}
			return myProjects;

		};

		$scope.formateDate = function(data) {
			var date = new Date(data);
			return (date.getMonth() + 1 ) + '.' + date.getDay() + '.' + (date.getYear() + 1900);
		};

		$scope.formatStatus_icon = function(data) {
			if(data === 'flight-successful'){
				return 'status-icons-listing icon-flight-successful';
			} else if(data === 'flight-scheduled'){
				return 'status-icons-listing icon-flight-scheduled';
			} else if(data === 'location-submitted'){
				return 'status-icons-listing icon-location-submitted';
			}else {
				return 'status-icons-listing icon-assessment-complete';
			}
		};

		$scope.formatStatus_title = function(data) {
			var data1 = data.split('-')[0];
			var data2 = data.split('-')[1];

			return (data1.charAt(0).toUpperCase() + data1.slice(1)) + ' ' + (data2.charAt(0).toUpperCase() + data2.slice(1));
		};

		$scope.removeProject = function(project, company) {
			var r = confirm('Do you really want to remove this project?');
			if (r === true) {
				Projects.delete({projectId : project._id}).$promise.then(function(response){
					$scope.projects = Projects.query({});
					console.log('Project was successfully removed');
				},function(err){
					alert('There is an error removing this project.');
				});
			}
		};

		$scope.isLocationSubmitted = function(project) {
			if(project.status === 'location-submitted'){
				return true;
			} else{
				return false;
			}
		};

		$scope.isFlightSuccessful = function(project) {
			if(project.status === 'flight-successful'){
				return true;
			} else{
				return false;
			}
		};

		$scope.isAssessmentComplete = function(project) {
			if(project.status === 'upload-complete'){
				return true;
			} else{
				return false;
			}
		};

		$scope.isFlightScheduled = function(project) {
			if(project.status === 'flight-scheduled'){
				return true;
			} else{
				return false;
			}
		};

		$scope.view_project = function(project) {
			
			var url = $state.href('project-details', {'projectId': project._id});
			window.open(url,'_blank');

		};

		$scope.showModal = false;
		$scope.companyToshow = {};

		$scope.view_companyInfo = function(company) {
			$scope.showModal = !$scope.showModal;
			$scope.companyToshow = company;
		};

		$scope.closeModal = function(){
			$scope.showModal = false;
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.submitted = false;

		// Submit forgotten password account id
		$scope.askForPasswordReset = function(forgotPassForm) {
			$scope.submitted = true;
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = {};
				forgotPassForm.$setPristine();

                $scope.credentials = null;
                $scope.success     = 'Email was sent successfully';

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

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

'use strict';

angular.module('users').directive('blockSpace', [
    function () {
        return {
            restrict: 'A',
            link    : function postLink(scope, element, attrs, ctrl) {
                element.bind('keydown keypress', function (event) {
                    if (event.which === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    }
]);

'use strict';

angular.module('users').directive('clearFieldError', [
	function() {
		return {
			require: 'ngModel',
			link: function postLink(scope, element, attrs, ctrl) {
				element.bind('change', function() {
					ctrl.$setValidity('fieldError', true);
				});
			}
		};
	}
]);

'use strict';

angular.module('users').directive('uniqueEmail', [ 'Users',
	function(Users) {
		return {
			require:'ngModel',
			restrict: 'A',
			link: function postLink(scope, element, attrs, ctrl) {

				//TODO: We need to check that the value is different to the original

				//using push() here to run it as the last parser, after we are sure that other validators were run
				ctrl.$parsers.push(function (viewValue) {

					if (viewValue) {
						Users.query({email:viewValue}, function (users) {
							if (users.length === 0) {
								ctrl.$setValidity('uniqueEmail', true);
							} else {
								ctrl.$setValidity('uniqueEmail', false);
							}
						});
						return viewValue;
					}
				});
			}
		};
	}
]);

'use strict';

angular.module('users').filter('formatRole', function() {
    return function(input) {

        return input.replace('customer-', '');
    };
});

'use strict';

angular.module('users').service('Acl', ['Authentication', '$state',
    function (Authentication, $state) {
        var authentication = Authentication;

        var abilities = {
            'scanifly-admin'         : ['dashboard-submittedCompany', 'user-management', 'company-management', 'project-processing', 'view-pre-report', 'download-report'],
            'customer-admin'         : ['dashboard-submittedUser', 'assessment-feedback', 'billing', 'new-scan', 'user-management', 'user-management-customerType', 'edit-company', 'download-report', 'edit-project', 'download-project-files', 'tutorials'],
            'customer-systemDesigner': ['dashboard-submittedUser', 'assessment-feedback', 'download-report', 'download-project-files', 'tutorials'],
            'guest'                  : []
        };

        return {

            hasAccess: function (resource) {
                var role = (authentication.user && abilities[authentication.user.role]) ? authentication.user.role : 'guest';

                return (abilities[role].indexOf(resource) !== -1);
            },

            handleAuthenticationRedirects: function (event, toState, toParams) {

                if (angular.isDefined(toState.authenticate)) {
                    if (!Authentication.user && (toState.authenticate === true)) {
                        $state.go('signin');
                        event.preventDefault();
                    } else if (Authentication.user && (toState.authenticate === false)) {
                        $state.go('dashboard');
                        event.preventDefault();
                    }
                }

            }

        };
    }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

angular.module('users').factory('Companies', ['$resource',
    function($resource) {
        return $resource('companies/:companyId', {
        	companyId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            delete: {
            	method: 'DELETE'
            }
        });
    }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users/:userId', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
