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
