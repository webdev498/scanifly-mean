'use strict';

/**
 * Module dependencies.
 */
var mongoose          = require('mongoose'),
	errorHandler      = require('./errors.server.controller'),
	ProjectDetail     = mongoose.model('ProjectDetail'),
    Project           = mongoose.model('Project'),
    Activity          = mongoose.model('Activity'),
    utilsController   = require('./utils.server.controller'),
	// projectController = require('./projects.server.controller'),
	_ = require('lodash');

/**
 * Create a Project detail
 */
exports.create = function(req, res) {

	var projectDetail = new ProjectDetail(req.body);

	projectDetail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectDetail);
		}
	});
};

/**
 * Show the current Project detail
 */
exports.read = function(req, res) {
	res.jsonp(req.projectDetail);
};

/**
 * Update a Project detail
 */
exports.update = function(req, res) {
	var projectDetail = req.projectDetail,
        projectInfo   = req.body.projectInfo;

    if(projectInfo !== undefined){
    	delete req.body.projectInfo;
    }
    

	projectDetail = _.extend(projectDetail , req.body);

	projectDetail.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if(projectInfo !== undefined){
				(new Activity({
	                type    : 'project-data-updated',
	                postedBy: req.user,
	                project : projectInfo._id,
	                company : projectInfo.company._id
	            })).save();

	            utilsController.getRelevantUsersPerProject(req, projectInfo, function (users) {
	                for (var elementId in users) {
	                    utilsController.sendProjectDataUpdateEmail(res, users[elementId].userEmail, users[elementId].variables);
	                }
	            });
			}

			res.jsonp(projectDetail);
		}
	});
};

/**
 * Delete an Project detail
 */
exports.delete = function(req, res) {
	var projectDetail = req.projectDetail ;

	projectDetail.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectDetail);
		}
	});
};

/**
 * List of Project details
 */
exports.list = function(req, res) { 
	ProjectDetail.find().sort('-created').populate('user', 'displayName').exec(function(err, projectDetails) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projectDetails);
		}
	});
};

/**
 * Project detail middleware
 */
exports.projectDetailByID = function(req, res, next, id) { 
	ProjectDetail.findById(id).populate('user', 'displayName').exec(function(err, projectDetail) {
		if (err) return next(err);
		if (! projectDetail) return next(new Error('Failed to load Project detail ' + id));
		req.projectDetail = projectDetail ;
		next();
	});
};

/**
 * Project detail authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projectDetail.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.processRoofPlanes = function(req, res, next) {

    // remove average
    if(req.body.roofPlanes !== undefined) {
    	if(req.body.roofPlanes.length !== 0) {
	    	if (req.body.roofPlanes[req.body.roofPlanes.length - 1]['1-roof-plane'] === 'average') {
		        req.body.roofPlanes.pop();
		    }

		    var averageAnnualSolarAccessTotal = 0;
		    var averageAnnualSolarAccessValue = 0;
		    var tsrfTotal                     = 0;
		    var initialLength                 = req.body.roofPlanes.length;
		    var tofValue                      = req.body.roofPlanes[0]['6-tof'] ? parseInt(req.body.roofPlanes[0]['6-tof']) : 0;

		    // sets all TOF values with the first value
		    for (var i = 0; i < req.body.roofPlanes.length; i++) {
		        averageAnnualSolarAccessValue = req.body.roofPlanes[i]['4-average-annual-solar-access'] ? parseInt(req.body.roofPlanes[i]['4-average-annual-solar-access']) : 0 ;

		        req.body.roofPlanes[i]['6-tof']  = tofValue;
		        req.body.roofPlanes[i]['5-tsrf'] = Math.round((averageAnnualSolarAccessValue * tofValue) / 100);
		        req.body.roofPlanes[i]['5-tsrf'] = isNaN(req.body.roofPlanes[i]['5-tsrf']) ? '' : req.body.roofPlanes[i]['5-tsrf'];
		        

		        averageAnnualSolarAccessTotal += averageAnnualSolarAccessValue;
		        tsrfTotal                     += req.body.roofPlanes[i]['5-tsrf'] ? parseFloat(req.body.roofPlanes[i]['5-tsrf']) : 0.0;
		    }

			averageAnnualSolarAccessTotal = isNaN(averageAnnualSolarAccessTotal) ? '' : Math.round(averageAnnualSolarAccessTotal / initialLength);
			tsrfTotal				      = isNaN(tsrfTotal) ? '' : Math.round(tsrfTotal / initialLength);

		    req.body.roofPlanes.push({
		        '1-roof-plane'                 : 'average',
		        '2-azimuth'                    : ' ',
		        '3-tilt'                       : ' ',
		        '4-average-annual-solar-access': averageAnnualSolarAccessTotal.toFixed(0),
		        '5-tsrf'                       : tsrfTotal,
		        '6-tof'                        : ' '
		    });
	    }
    }
    
    next();
};
