'use strict';

/**
 * Module dependencies.
 */
var _            = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    config       = require('../../../config/config'),
    utils        = require('../utils.server.controller'),
    User         = mongoose.model('User'),
    Company      = mongoose.model('Company'),
    Activity     = mongoose.model('Activity');

/**
 * Internal signup for company users
 */
var usersSignup = function(req, res) {
	// Init Variables
	var userCompany = new User(req.body);
	var role = 'customer-admin'; 

	if (req.user.role === 'scanifly-admin') {
        userCompany.role = 'scanifly-admin';
		role		     = 'scanifly-admin';
	}

	// Add missing user fields
    userCompany.provider = 'local';
    userCompany.company  = req.user.company;

	// Then save the user
    userCompany.save(function(err) {
		if (err) {
			res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
			});
		} else {

            (new Activity({
                type    : 'user-created',
                postedBy: req.user,
                user    : userCompany,
                company : req.user.company
            })).save();
			
            if (userCompany.role === 'customer-systemDesigner') {
                role = 'System Designer';
            }
            
			var variables = {
                userName   : req.user.name,
                companyName: req.user.company.name,
                email      : userCompany.email,
                password   : req.body.password,
                role       : role
			};
			
			utils.sendNewUserCreatedEmail(res, userCompany.email, variables);

			// Remove sensitive data before login
            userCompany.password = undefined;
            userCompany.salt     = undefined;

            res.json(userCompany);
		}
    });

};

/**
 * Signup
 */
exports.signup = function(req, res, next) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	
	if (req.body.userManagementForm === true) {
		delete req.body.userManagementForm;
		
		return usersSignup(req, res);
	}

	var companyName = req.body.company;
	delete req.body.company;

	// Init Variables
    var user    = new User(req.body);
    var message = null;

	// Add missing user fields
	user.provider = 'local';

	// Then save the user
	user.save(function(err) {
		if (err) {
            res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
			});
		} else {
            var company  = new Company();
            company.name = companyName;

			company.save(function(err) {
				if (err) {
					res.status(400).send({
                        message: errorHandler.getErrorMessage(err).message,
                        field  : errorHandler.getErrorMessage(err).field
					});
				} else {
                    user.company            = company;
                    user.companyToBeUpdated = true;

					user.save(function(err) {
						if (err) {
							res.status(400).send({
                                message: errorHandler.getErrorMessage(err).message,
                                field  : errorHandler.getErrorMessage(err).field
							});
						} else {
                            (new Activity({
                                type    : 'company-created',
                                postedBy: user,
                                company : user.company
                            })).save();

							req.login(user, function(err) {
								if (err) {
									res.status(400).send(err);
								} else {
                                    // Remove sensitive data before login
                                    user.password = undefined;
                                    user.salt     = undefined;

									user         = user.toObject();
									user.company = company;

                                    req.companyName = company.name;
                                    req.user        = user;
                                    next();
								}
							});
						}
					});
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {

		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
            user.password = undefined;
            user.salt     = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Sign up email
 */
exports.prepareSignUpEmail = function (req, res, next) {

	req.mailData = {
		template : 'templates/sign-up-email',
		variables: {
            name       : req.user.name,
            companyName: req.companyName,
            email      : req.user.email
		},
		from     : config.mailer.from,
        to       : req.user.email,
		subject  : 'Scanifly :: Welcome!'
	};

	next();
};
