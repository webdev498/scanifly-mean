'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller'),
	    utils = require('../../app/controllers/utils.server.controller');

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users')
		.get(users.requiresLogin, users.list)
		.put(users.update);
	app.route('/users/:userId')
        .delete(users.requiresLogin, users.delete, users.prepareAccountDeactivationEmail, utils.sendEmail)
        .put(users.requiresLogin, users.activate, users.prepareAccountActivationEmail, utils.sendEmail);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot, users.prepareForgotPasswordEmail, utils.sendEmail);
	app.route('/auth/reset/:token')
        .get(users.validateResetToken)
	    .post(users.reset, users.prepareResetPasswordEmail, utils.sendEmail);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup, utils.sendCompanySignUpEmail, users.prepareSignUpEmail, utils.sendEmail);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
