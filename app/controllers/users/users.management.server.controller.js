'use strict';

/**
 * Module dependencies.
 */
var _            = require('lodash'),
    errorHandler = require('../errors.server.controller.js'),
    mongoose     = require('mongoose'),
    User         = mongoose.model('User');

exports.list = function (req, res) {

    var filters = {
        _id: {
            '$ne': req.user._id
        }
    };
    
    switch (req.user.role) {
        case 'customer-admin':
            filters = _.assign(filters, {
                company: {
                    _id: req.user.company._id
                }
            });
            break;
        case 'scanifly-admin':
            filters = _.assign(filters, {
                role: 'scanifly-admin'
            });
            break;
        default:
            filters = {
                _id: 0
            }; 
    }
    
    User
        .find(filters)
        .sort('-created')
        .populate('company')
        .exec(function (err, users) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err).message,
                    field: errorHandler.getErrorMessage(err).field
                });
            } else {
                res.jsonp(users); 
            }
        });
};

/**
 * Get all users OR all Scanifly users OR all users for a company
 */
exports.getAllActiveUsers = function(userType, companyId, callback) {

    var filters = {
        'status': 'active'
    };

    if (userType === 'scanifly-admin') {
        filters = _.assign(filters, {
            'role': userType
        });
    } else {
        filters = _.assign(filters, {
            role: userType,
            company: {
                _id: companyId
            }
        });
    }

    User
        .find(filters)
        .sort('-created')
        .populate('company')
        .exec(function (err, users) {
            if (err) {
                callback(null, {
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                callback(users);
            }
        });
};

exports.getAdminsByCompanyIds = function(companyIds, callback) {

    var filters = {
        status : 'active',
        company: {
            $in: companyIds
        },
        role   : 'customer-admin'         
    };
    
    User
        .find(filters)
        .sort('-created')
        .exec(function (err, admins) {
            if (err) {
                callback(null, {
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                callback(admins);
            }
        });
};
