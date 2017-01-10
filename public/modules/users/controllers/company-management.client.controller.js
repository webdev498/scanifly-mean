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
