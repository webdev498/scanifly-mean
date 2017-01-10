'use strict';

angular.module('core').directive('usMap', [
	function() {
		return {
			scope: true,
			restrict: 'A',

			controller: function ($scope, $element, $attrs) {
			},

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
