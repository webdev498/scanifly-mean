'use strict';

/**
 * Module dependencies.
 */
var mongoose          = require('mongoose'),
    errorHandler      = require('./errors.server.controller'),
    Project           = mongoose.model('Project'),
    Activity          = mongoose.model('Activity'),
    utilsController   = require('./utils.server.controller'),
    companyController = require('./companies.management.server.controller'),
    _                 = require('lodash');

var searchProjects = function (res, filters, keyword) {
    // this is used to search projects by company name
    companyController.searchCompanyByName(keyword, function (companies) {
        var companyIds = [];

        if (companies.length > 0) {
            for (var index = 0, length = companies.length; index < length; index++) {
                companyIds.push(companies[index]._id.toString());
            }

            filters.$or.push({
                company: {
                    $in: companyIds
                }
            });
        }

        Project
            .find(filters)
            .sort('-created')
            .populate('submittedBy')
            .populate('company')
            .exec(function (err, projects) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err).message,
                        field  : errorHandler.getErrorMessage(err).field
                    });
                } else {
                    res.jsonp(projects);
                }
            });
    });
};

/**
 * Create a Project
 */
exports.create = function (req, res) {
    var project         = new Project(req.body);
    project.submittedBy = req.user;
    project.company     = req.user.company;
    project.status      = 'location-submitted';

    project.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
            });
        } else {

            (new Activity({
                type    : 'project-created',
                postedBy: req.user,
                project : project,
                company : req.user.company
            })).save();

            utilsController.getScaniflyAdminUsers(req, project._id.toString(), function (users) {
                for (var elementId in users) {
                    users[elementId].variables.companyName = req.user.company.name;
                    utilsController.sendNewProjectCreatedEmail(res, users[elementId].userEmail, users[elementId].variables);
                }
            });

            res.jsonp(project);
        }
    });
};

/**
 * Show the current Project
 */
exports.read = function (req, res) {
    res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.update = function (req, res) {

    var project = req.project;

    if (project.status !== req.body.status) { // status changed activity log

        (new Activity({
            type    : 'status-changed',
            status  : req.body.status,
            postedBy: req.user,
            project : project._id,
            company : project.company
        })).save();

        // used to send emails
        utilsController.getRelevantUsersPerProject(req, req.body, function (users) {
            for (var elementId in users) {
                utilsController.sendStatusChangeEmail(res, users[elementId].userEmail, users[elementId].variables);
            }
        });
    } else if ((typeof project.scheduledFlight !== 'undefined') &&
        (project.scheduledFlight !== req.body.scheduledFlight) &&
        (req.body.status === 'flight-scheduled')) { // project flight date was re-scheduled

        (new Activity({
            type    : 'flight-rescheduled',
            postedBy: req.user,
            project : project._id,
            company : project.company
        })).save();

        // used to send emails
        utilsController.getRelevantUsersPerProject(req, req.body, function (users) {
            for (var elementId in users) {
                utilsController.sendProjectRescheduledEmail(res, users[elementId].userEmail, users[elementId].variables);
            }
        });
    } else if (req.body.isCompleted === true && req.body.status === 'upload-complete') {

        var variables = {
            userName   : req.user.name,
            projectName: project.name
        };

        // sned project approved email
        utilsController.sendProjectApprovedEmail(res, project.submittedBy.email, variables);
    }

    // add new activity to download report if project is completed
    if (req.body.isCompleted === true) {
        (new Activity({
            type   : 'download-report',
            project: project._id,
            status : req.body.status,
            company: project.company
        })).save();
    }

    project = _.extend(project, req.body);

    project.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
            });
        } else {
            if (req.user.role === 'customer-admin' && project.status === 'location-submitted') { // this only happens if project details are updated

                (new Activity({
                    type    : 'project-updated',
                    postedBy: req.user,
                    project : project._id,
                    company : req.user.company
                })).save();

                utilsController.getScaniflyAdminUsers(req, req.body._id, function (users) {
                    for (var elementId in users) {
                        utilsController.sendProjectUpdateEmail(res, users[elementId].userEmail, users[elementId].variables);
                    }
                });
            } else if (
                (req.user.role === 'customer-admin' || req.user.role === 'customer-systemDesigner') &&
                project.status === 'upload-complete' && project.isCompleted === true) {

                (new Activity({
                    type    : 'site-assessment-acknowledged',
                    postedBy: req.user,
                    project : project._id,
                    company : req.user.company
                })).save();

                utilsController.getScaniflyAdminUsers(req, req.body._id, function (users) {
                    for (var elementId in users) {
                        utilsController.sendAssessmentAcknowledged(res, users[elementId].userEmail, users[elementId].variables);
                    }
                });
            }

            res.jsonp(project);
        }
    });
};

/**
 * Delete an Project
 */
exports.delete = function (req, res) {
    var project    = req.project;
    project.status = 'declined';
    var companyAdminEmail = project.companyAdminEmail;

    delete project.companyAdminEmail;

    (new Activity({
        type    : 'project-declined',
        postedBy: req.user,
        project : project._id,
        company : project.company
    })).save();

    project.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
            });
        } else {
            // used to send emails
            utilsController.getRelevantUsersPerProject(req, req.project, function (users) {
                for (var elementId in users) {
                    if(users[elementId].userEmail === companyAdminEmail){
                        users[elementId].variables.showing_declined_reason = true;
                    } else {
                        users[elementId].variables.showing_declined_reason = false;
                    }
                    utilsController.sendDeclinedProjectEmail(res, users[elementId].userEmail, users[elementId].variables);
                    
                }
            });

            res.jsonp({});
        }
    });
};

/**
 * List of Projects
 */
exports.list = function (req, res) {

    var filters = {
        status: {
            '$ne': 'declined'
        }
    };

    if (req.user.role !== 'scanifly-admin') {
        filters = _.assign(filters, {
            company: req.user.company._id
        });
    }

    if (req.query.dashboard) {
        filters = _.assign(filters, {
            status: {$in: ['location-submitted', 'flight-scheduled', 'flight-successful', 'resolution-required', 'approved']}
        });
    }

    if (req.query.status) {
        if (req.query.status === 'resolution-required') {
            filters = _.assign(filters, {
                status: {
                    $in: ['resolution-required', 'resolution-complete']
                }
            });
        } else {
            filters = _.assign(filters, {
                status: req.query.status
            });
        }
    }

    if (req.query.keyword) {

        var keywords               = req.query.keyword.split(' ');
        var regexPatternComponents = [];

        for (var i = 0; i < keywords.length; i++) {
            regexPatternComponents.push('(' + keywords[i].toLowerCase() + ')');
        }

        var regexPattern = regexPatternComponents.join('.*');
        var keyword      = new RegExp(regexPattern, 'i');

        filters = _.assign(filters, {
            $or: [
                {
                    'name': keyword
                },
                {
                    'address.state': keyword
                },
                {
                    'address.stateName': keyword
                },
                {
                    'ownerDetails.firstName': keyword
                },
                {
                    'ownerDetails.lastName': keyword
                },
                {
                    'ownerDetails.email': keyword
                },
                {
                    'ownerDetails.phone': keyword
                }
            ]
        });

        // scanifly admin can search for projects by company name
        if (req.user.role === 'scanifly-admin') {
            return searchProjects(res, filters, keyword);
        }
    }

    Project
        .find(filters)
        .sort('-created')
        .populate('submittedBy')
        .populate('company')
        .exec(function (err, projects) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err).message,
                    field  : errorHandler.getErrorMessage(err).field
                });
            } else {
                res.jsonp(projects);
            }
        });
};

/**
 * Project middleware
 */
exports.projectByID = function (req, res, next, id) {

    if (mongoose.Types.ObjectId.isValid(id)) {
        Project
            .findOne({
                _id: id
                // company: req.user.company
            })
            .populate('submittedBy')
            .populate('details')
            .populate('company')
            .exec(function (err, project) {
                if (err) {
                    return next(err);
                }
                if (!project) {
                    return next(new Error('Failed to load Project ' + id));
                }
                req.project = project;
                next();
            });
    } else {
        return next(new Error('Project not exists !'));
    }
};

/**
 * Helper function
 */
exports.getProjectByID = function (projectId, callback) {

    if (typeof projectId !== 'string') {
        projectId = projectId.toString();
    }

    if (mongoose.Types.ObjectId.isValid(projectId)) {
        Project
            .findOne({
                _id: projectId
            })
            .populate('details')
            .populate('submittedBy')
            .populate('company')
            .exec(function (err, project) {
                if (err) {
                    return callback(null, err);
                }
                if (!project) {
                    return callback(null, new Error('Failed to load Project ' + projectId));
                }
                return callback(project);
            });
    } else {
        return new Error('Project not exists !');
    }
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.project.user._id !== req.user._id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

