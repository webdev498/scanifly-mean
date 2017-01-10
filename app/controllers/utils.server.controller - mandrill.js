'use strict';
/*jshint loopfunc: true */

var nodemailer         = require('nodemailer'),
    mandrillTransport  = require('nodemailer-mandrill-transport'),
    config             = require('../../config/config'),
    projectsController = require('./projects.server.controller'),
    usersController    = require('./users/users.management.server.controller.js'),
    _                  = require('lodash');

var transport = nodemailer.createTransport(mandrillTransport(config.mailer.options));

var formatDate = function (date) {

    if (!date) {
        return null;
    } else {
        var year    = date.getFullYear(),
            month   = date.getMonth() + 1,
            day     = date.getDate(),
            hour    = date.getHours(),
            dayTime = hour < 12 ? 'AM' : 'PM',
            time;

        hour = (hour % 12) === 0 ? '12' : (hour % 12);
        hour = hour + ':00';

        time = month + '.' + day + '.' + year + ', ' + hour + dayTime;

        return time;
    }
};

exports.sendEmail = function (req, res) {

    res.render(
        req.mailData.template,
        req.mailData.variables,
        function (err, html) {
            if (err) {
                res.status(400).jsonp(err);
            } else {
                transport.sendMail({
                    to     : req.mailData.to || config.mailer.to,
                    subject: req.mailData.subject || 'Scanifly :: New contact message received!',
                    from   : req.mailData.from || config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        res.status(500).jsonp(err);
                    } else {
                        res.jsonp(req.user);
                    }
                });
            }
        });
};

/**
 * Used to send note notification
 */
exports.sendNoteEmail = function (res, to, variables) {

    res.render(
        'templates/new-note-email',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Project Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendStatusChangeEmail = function (res, to, variables) {

    var emailTemplate = null;

    switch (variables.projectStatus) {
        case 'location-submitted':
        {
            emailTemplate = 'templates/project-status/flight-scheduled-email';
            break;
        }
        case 'flight-scheduled':
        {
            emailTemplate = 'templates/project-status/flight-successful-email';
            break;
        }
        case 'flight-successful':
        {
            emailTemplate = 'templates/project-status/assessment-complete-email';
            break;
        }
        case 'assessment-complete':
        {
            emailTemplate = 'templates/project-status/resolution-required-email';
            break;
        }
        case 'resolution-required':
        {
            emailTemplate = 'templates/project-status/resolution-complete-email';
            break;
        }
    }

    res.render(
        emailTemplate,
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Status Change Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendDeclinedProjectEmail = function (res, to, variables) {
    res.render(
        'templates/project-status/project-declined-email',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Project Deleted Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendProjectUpdateEmail = function (res, to, variables) {
    res.render(
        'templates/project-updated-email',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Project Updated Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendProjectDataUpdateEmail = function (res, to, variables) {
    res.render(
        'templates/project-data-updated-email',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Project Data Updated Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendAssessmentAcknowledged = function (res, to, variables) {
    res.render(
        'templates/site-assessment-acknowledged-email',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Site Assessment Acknowledged Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendProjectRescheduledEmail = function (res, to, variables) {
    res.render(
        'templates/project-status/flight-rescheduled-email',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Project Rescheduled Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendNewUserCreatedEmail = function (res, to, variables) {
    res.render(
        'templates/new-user-notification',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: New Account!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.sendNewProjectCreatedEmail = function (res, to, variables) {
    res.render(
        'templates/new-scan-notification',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: New Scan Notification!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

/*
 This one is special
 */
exports.sendCompanySignUpEmail = function (req, res, next) {

    usersController.getAllActiveUsers('scanifly-admin', null, function (users, err) {
        if (err) {
            return err;
        }

        for (var elementId in users) {

            var variables = {
                userName   : req.user.name,
                email      : req.user.email,
                companyName: req.companyName
            };

            res.render(
                'templates/new-company-email',
                variables || {},
                function (err, html) {
                    if (err) {
                        return err;
                    } else {
                        transport.sendMail({
                            to     : users[elementId].email,
                            subject: 'Scanifly :: New Company!',
                            from   : config.mailer.from,
                            html   : html
                        }, function (err, info) {
                            if (err) {
                                return err;
                            } else {
                                return 'Email sent successfully';
                            }
                        });
                    }
                }
            );
        }
    });
    next();
};

exports.sendProjectApprovedEmail = function (res, to, variables) {
    res.render(
        'templates/project-status/project-approved-email',
        variables || {},
        function (err, html) {
            if (err) {
                return err;
            } else {
                transport.sendMail({
                    to     : to,
                    subject: 'Scanifly :: Project Approved by System Designer!',
                    from   : config.mailer.from,
                    html   : html
                }, function (err, info) {
                    if (err) {
                        return err;
                    } else {
                        return 'Email sent successfully';
                    }
                });
            }
        });
};

exports.getNotifiedUsersPerProject = function (req, projectId, callback) {

    var usersArray = [];
    projectsController.getProjectByID(projectId, function (project, err) {
        if (err) {
            return err;
        }
        var projectUrl = req.protocol + '://' + req.hostname + '/#!/project/' + project._id;

        usersController.getAllActiveUsers('scanifly-admin', null, function (users, err) {
            if (err) {
                return err;
            }

            for (var elementId in users) {
                if (users[elementId].email === req.user.email) {
                    continue;
                }

                usersArray.push({
                    userEmail: users[elementId].email,
                    variables: {
                        contactPersonName  : users[elementId].name,
                        userName           : req.user.name,
                        companyName        : (users[elementId].company && users[elementId].company.name) || '',
                        projectName        : project.name,
                        projectStatus      : project.status,
                        scheduledFlightDate: formatDate((req.project && req.project.scheduledFlight) || project.scheduledFlight || ''),
                        projectUrl         : projectUrl
                    }
                });

            }

            usersController.getAllActiveUsers('company', project.company._id, function (users, err) {
                if (err) {
                    return err;
                }

                for (var elementId in users) {
                    if (users[elementId].email === req.user.email) {
                        continue;
                    }

                    usersArray.push({
                        userEmail: users[elementId].email,
                        variables: {
                            contactPersonName  : users[elementId].name,
                            userName           : req.user.name,
                            companyName        : users[elementId].company.name,
                            projectName        : project.name,
                            projectStatus      : project.status,
                            scheduledFlightDate: formatDate((req.project && req.project.scheduledFlight) || project.scheduledFlight || ''),
                            projectUrl         : projectUrl
                        }
                    });
                }
                return callback(usersArray);
            });
        });
    });
};

exports.getRelevantUsersPerProject = function (req, requestBody, callback) {

    var usersArray = [];
    projectsController.getProjectByID(requestBody._id, function (project, err) {
        if (err) {
            return err;
        }
        var projectUrl = req.protocol + '://' + req.hostname + '/#!/project/' + project._id;

        usersController.getAllActiveUsers('scanifly-admin', null, function (users, err) {
            if (err) {
                return err;
            }

            for (var elementId in users) {
                if (users[elementId].email === req.user.email) {
                    continue;
                }

                usersArray.push({
                    userEmail: users[elementId].email,
                    variables: {
                        contactPersonName  : users[elementId].name,
                        userName           : req.user.name,
                        companyName        : (users[elementId].company && users[elementId].company.name) || '',
                        projectName        : project.name,
                        projectStatus      : project.status,
                        scheduledFlightDate: formatDate((req.project && req.project.scheduledFlight) || project.scheduledFlight || ''),
                        projectUrl         : projectUrl
                    }
                });
            }

            // add project owner - submittedBy
            if (project.submittedBy.email !== req.user.email) {
                usersArray.push({
                    userEmail: project.submittedBy.email,
                    variables: {
                        contactPersonName  : project.submittedBy.name,
                        userName           : req.user.name,
                        companyName        : (project.company && project.company.name) || '',
                        projectName        : project.name,
                        projectStatus      : project.status,
                        scheduledFlightDate: formatDate((req.project && req.project.scheduledFlight) || project.scheduledFlight || ''),
                        projectUrl         : projectUrl
                    }
                });
            }

            var statusRegex = new RegExp('assessment-complete|resolution-required|resolution-complete');

            if (statusRegex.exec(requestBody.status)) {
                usersController.getAllActiveUsers('customer-systemDesigner', project.company._id, function (users, err) {
                    if (err) {
                        return err;
                    }

                    for (var elementId in users) {
                        if (users[elementId].email === req.user.email) {
                            continue;
                        }

                        usersArray.push({
                            userEmail: users[elementId].email,
                            variables: {
                                contactPersonName  : users[elementId].name,
                                userName           : req.user.name,
                                companyName        : users[elementId].company.name,
                                projectName        : project.name,
                                projectStatus      : project.status,
                                scheduledFlightDate: formatDate((req.project && req.project.scheduledFlight) || project.scheduledFlight || ''),
                                projectUrl         : projectUrl
                            }
                        });
                    }
                    return callback(usersArray);
                });
            } else {
                return callback(usersArray);
            }
        });
    });
};

exports.getScaniflyAdminUsers = function (req, projectId, callback) {

    var usersArray = [];
    projectsController.getProjectByID(projectId, function (project, err) {
        if (err) {
            return err;
        }
        var projectUrl = req.protocol + '://' + req.hostname + '/#!/project/' + project._id;

        usersController.getAllActiveUsers('scanifly-admin', null, function (users, err) {
            if (err) {
                return err;
            }

            for (var elementId in users) {
                if (users[elementId].email === req.user.email) {
                    continue;
                }

                usersArray.push({
                    userEmail: users[elementId].email,
                    variables: {
                        contactPersonName  : users[elementId].name,
                        userName           : req.user.name,
                        companyName        : (users[elementId].company && users[elementId].company.name) || '',
                        projectName        : project.name,
                        projectStatus      : project.status,
                        scheduledFlightDate: formatDate((req.project && req.project.scheduledFlight) || project.scheduledFlight || ''),
                        projectUrl         : projectUrl
                    }
                });

            }
            return callback(usersArray);
        });
    });
};
