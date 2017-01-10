'use strict';

/**
 * Module dependencies.
 */
var _            = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    User         = mongoose.model('User'),
    config       = require('../../../config/config'),
    nodemailer   = require('nodemailer'),
    async        = require('async'),
    crypto       = require('crypto');

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
	async.waterfall([
		// Generate random token
		function(done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},
		// Lookup user by email
		function(token, done) {
			if (req.body.email) {
				User.findOne({
					email: req.body.email
				}, '-salt -password', function(err, user) {
					if (!user) {
						return res.status(400).send({
							message: 'No account with that e-mail address has been found'
						});
					} else if (user.provider !== 'local') {
						return res.status(400).send({
							message: 'It seems like you signed up using your ' + user.provider + ' account'
						});
					} else if (user.status === 'deleted') {
						return res.status(400).send({
							message: 'The user registered with ' + user.email + ' email address is currently inactive.'
						});
					} else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function(err) {
							done(err, token, user);
						});
                        req.user = user;
                        next();
					}
				});
			} else {
				return res.status(400).send({
					message: 'Email field must not be blank'
				});
			}
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Forgot password email
 */
exports.prepareForgotPasswordEmail = function(req, res, next) {

    req.mailData = {
        template : 'templates/reset-password-email',
        variables: {
            name: req.user.name,
            appName: config.app.title,
            url: 'http://' + req.headers.host + '/auth/reset/' + req.user.resetPasswordToken
        },
        from     : config.mailer.from,
        to       : req.user.email,
        subject  : 'Scanifly :: Password reset'
    };

    next();
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
	req.logout();

	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function(err, user) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

	async.waterfall([

		function(done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password             = passwordDetails.newPassword;
                        user.resetPasswordToken   = undefined;
                        user.resetPasswordExpires = undefined;

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
                                        req.user = user;
                                        next();
                                    }
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						message: 'Password reset token is invalid or has expired.'
					});
				}
			});
		}
	], function(err) {
		if (err) return next(err);
	});
};

/**
 * Reset password confirmation email
 */
exports.prepareResetPasswordEmail = function(req, res, next) {

    req.mailData = {
        template : 'templates/reset-password-confirm-email',
        variables: {
            name: req.user.name,
            appName: config.app.title,
        },
        from     : config.mailer.from,
        to       : req.user.email,
        subject  : 'Scanifly :: Your password has been changed'
    };

    next();
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function(err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;

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
											res.send({
												message: 'Password changed successfully'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(400).send({
							message: 'Current password is incorrect'
						});
					}
				} else {
					res.status(400).send({
						message: 'User is not found'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
