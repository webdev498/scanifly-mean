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
