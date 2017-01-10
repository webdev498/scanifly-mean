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
