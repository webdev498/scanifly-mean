'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	crypto   = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length >= 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your Name']
	},
	company: {
		type: Schema.ObjectId,
		ref: 'Company'
	},
	email: {
		type: String,
		trim: true,
        unique: 'testing error message',
		validate: [validateLocalStrategyProperty, 'Please fill in your E-Mail'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer then 6 characters']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	role: {
        type: String,
        enum: ['scanifly-admin', 'customer-admin', 'customer-systemDesigner'],
		default: ['customer-admin']
	},
	status: {
		type: String,
		enum: ['active', 'deleted'],
		default: ['active']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 5 && !this.companyToBeUpdated && !this.statusToBeUpdated) {
		this.salt     = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used email
 */
UserSchema.statics.findUniqueEmail = function(email, suffix, callback) {
	var _this = this;
	var possibleEmail = email + (suffix || '');

	_this
		.findOne({
			email: possibleEmail
		})
		.populate('company')
		.exec(function(err, email) {
			if (!err) {
				if (!email) {
					callback(possibleEmail);
				} else {
					return _this.findUniqueEmail(email, (suffix || 0) + 1, callback);
				}
			} else {
				callback(null);
			}
		});
};

mongoose.model('User', UserSchema);
