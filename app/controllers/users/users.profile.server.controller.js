'use strict';

/**
 * Module dependencies.
 */
var _            = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    config       = require('../../../config/config'),
    User         = mongoose.model('User'),
    Activity     = mongoose.model('Activity');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err).message,
					field: errorHandler.getErrorMessage(err).field
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Deactivate User
 */
exports.delete = function(req, res, next) {
    var user                = req.profile;
    user.status             = 'deleted';
    user.statusToBeUpdated  = true;

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
			});
		} else {

			(new Activity({
				type    : 'user-deleted',
				postedBy: req.user,
				user    : user,
				company : req.user.company
			})).save();

            req.user = user;
            next();
		}
	});
};

/**
 * Activate User
 */
exports.activate = function(req, res, next) {
    var user               = req.profile;
    user.status            = 'active';
    user.statusToBeUpdated = true;

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
            });
        } else {

            (new Activity({
                type    : 'user-activated',
                postedBy: req.user,
                user    : user,
                company : req.user.company
            })).save();

            req.user = user;
            next();
        }
    });
};

/**
 * Deactivation email
 */
exports.prepareAccountDeactivationEmail = function (req, res, next) {

    req.mailData = {
        template : 'templates/account-deleted-email',
        variables: {
            name   : req.user.name,
            appName: config.app.title
        },
        from     : config.mailer.from,
        to       : req.user.email,
        subject  : 'Scanifly :: Account status change - deactivated'
    };

    next();
};

/**
 * Activation email
 */
exports.prepareAccountActivationEmail = function (req, res, next) {

    req.mailData = {
        template : 'templates/account-activated-email',
        variables: {
            name   : req.user.name,
            appName: config.app.title
        },
        from     : config.mailer.from,
        to       : req.user.email,
        subject  : 'Scanifly :: Account status change - activated'
    };

    next();
};
