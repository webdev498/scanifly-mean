'use strict';

angular.module('projects').directive('projectsHeader', ['$state', '$stateParams', 'Acl', 'Authentication',
    function ($state, $stateParams, Acl, Authentication) {
        return {
            scope      : true,
            templateUrl: 'modules/projects/views/directives/projects-header.client.directive.html',
            restrict   : 'E',
            controller : function ($scope) {
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
            }
        };
    }
]);
