angular.module('ng-crazyegg', ['ng'])
	.factory('crazyegg', ['$rootScope', '$window', '$timeout',
		function($rootScope, $window, $timeout, $q) {
		    var service = $window.crazyegg = $window.crazyegg || {};

		    service.loadProject = function(key) {

				/** remove previous script **/
				var element = document.getElementById('crazyegg-js');
				if (element) {
					element.parentNode.removeChild(element);
				}

				/** create new script **/
				key = key + '';
				var scriptPath = key.substr(0, 4) + '/' + key.substr(4, 4);

				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.id = 'crazyegg-js';
				script.async = true;
				script.src = 'https://script.crazyegg.com/pages/scripts/' + scriptPath + '.js?' + (new Date().getTime());
				script.onload = script.onreadystatechange = function () {};

				/** add new script **/
				var first = document.getElementsByTagName('script')[0];
				first.parentNode.insertBefore(script, first);
		    };

			service.initCrazyEgg = function(accountKey) {
				$rootScope.$on('$stateChangeSuccess', function() {
					$timeout(function() {
						$window.crazyegg.loadProject(accountKey);
					});
				});

				return true;
			};

		    return service;
		}
	]);
