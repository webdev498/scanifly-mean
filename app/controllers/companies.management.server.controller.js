'use strict';

/**
 * Module dependencies.
 */
var _            = require('lodash'),
    errorHandler = require('./errors.server.controller'),
    mongoose     = require('mongoose'),
    usersController = require('./users/users.management.server.controller.js'),
    Company      = mongoose.model('Company');

var listAdminsPerCompany = function(res, companies) {

    if (companies.length > 0) {
        // get company ids
        var companyIds = [];
        for (var index = 0, length = companies.length; index < length; index++) {
            companyIds.push(companies[index]._id.toString());
        }
        
        usersController.getAdminsByCompanyIds(companyIds, function(admins) {
            var response = [];
            var newIndex, companyId;
            var newIndexIterator = function(chr) {
                return chr.companyId.toString() === companyId.toString();
            };
            
            if (admins.length > 0) {
                // iterate through companies array
                for (var companyIndex = 0, companyLength = companies.length; companyIndex < companyLength; companyIndex++) {
                    companyId = companies[companyIndex]._id;

                    response.push({
                        company  : companies[companyIndex],
                        admins   : [],
                        companyId: companyId
                    });
                    
                    // get all admins per company
                    for (var adminIndex = 0, adminLength = admins.length; adminIndex < adminLength; adminIndex++) {
                        if (admins[adminIndex].company.toString() === companyId.toString()) {
                            newIndex = _.findIndex(response, newIndexIterator);
                            response[newIndex].admins.push(admins[adminIndex]);
                        }
                    }
                }
                res.jsonp(response);
            } else {
                res.jsonp(response);
            }
        });
    } else {
        res.jsonp({});
    }
};

exports.list = function (req, res) {

    Company
        .find()
        .sort('-created')
        .exec(function (err, companies) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err).message,
                    field  : errorHandler.getErrorMessage(err).field
                });
            } else {
                listAdminsPerCompany(res, companies);    
            }
        });
};

/**
 * Update company details
 */
exports.update = function(req, res) {
    // Init Variables
    var message = null,
        user    = req.user,
        company = req.user.company;

    if (company) {
        // Merge existing company
        company         = _.extend(company, req.body);
        company.updated = Date.now();

        company.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err).message,
                    field  : errorHandler.getErrorMessage(err).field
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

exports.searchCompanyByName = function(keyword, callback) {
    
    var filters = {
        'name': keyword
    };

    Company
        .find(filters)
        .sort('-created')
        .exec(function (err, companies) {
            if (err) {
                return {
                    message: err.message,
                    field  : err.field
                };
            } else {
                return callback(companies);
            }
        });
};

/**
 * Delete an Project
 */
exports.delete = function (req, res) {
    var company    = req.company;

    company.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err).message,
                field  : errorHandler.getErrorMessage(err).field
            });
        } else {

            res.jsonp({});
        }
    });
};

exports.companyByID = function (req, res, next, id) {

    if (mongoose.Types.ObjectId.isValid(id)) {
        Company
            .findOne({
                _id: id
                // company: req.user.company
            })
            .exec(function (err, company) {
                if (err) {
                    return next(err);
                }
                if (!company) {
                    return next(new Error('Failed to load Company ' + id));
                }
                req.company = company;
                next();
            });
    } else {
        return next(new Error('Company not exists !'));
    }
};