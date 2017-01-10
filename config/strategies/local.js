'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) {
			User
				.findOne({
					email: email
				})
				.populate('company')
				.exec(function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, {
							message: 'Unknown e-mail or invalid password'
						});
					}
					if (!user.authenticate(password)) {
						return done(null, false, {
							message: 'Unknown e-mail or invalid password'
						});
					}
                    if (user.status === 'deleted') {
                        return done(null, false, {
                            message: 'This account was suspended'
                        });
                    }

					return done(null, user);
				});
		}
	));
};
