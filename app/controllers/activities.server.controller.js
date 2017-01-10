'use strict';

/**
 * Module dependencies.
 */
var mongoose     = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    _            = require('lodash'),
    Activity     = mongoose.model('Activity');

/**
 * List of Activities
 */
exports.list = function(req, res) {

    // filter applied for scanifly admin
	var filters = {
        '$or': [{
            type: {
                $ne: 'download-report'
            },
            postedBy: {
                $ne: req.user._id
            }            
        }, {
            type: 'project-declined'
        }]
    };
    // used on dashboard
	var skip    = req.query.skip || 0;

	var roles = [
		'customer-admin',
		'customer-systemDesigner'
	];

    // Get activity based on company, IF customer
	if (roles.indexOf(req.user.role) !== -1) {
		filters = {
			company: {
				_id: req.user.company._id
			},
            postedBy: {
                $ne: req.user._id
            }
		};

        // Hide company's user-activity for SD
        if (req.user.role === 'customer-systemDesigner') {
            // filters.project = {$exists: true};
            filters = _.assign(filters, {
                $or: [{
                    type: {
                        $in: ['project-created', 'download-report', 'comments']
                    }
                }, {
                    type: 'status-changed',
                    status: {
                        $in: ['assessment-complete', 'resolution-complete']
                    }
                }]
            });
        }
	}

	if (req.query.activities === 'all') {
		Activity
			.find(filters)
			.count(function(err, activityCount) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err).message,
						field: errorHandler.getErrorMessage(err).field
					});
				} else {
					res.jsonp({
						'activityCount': activityCount
					});
				}
			});
	} else {
		Activity
			.find(filters)
			.sort('-createdAt')
			.limit(10)
			.skip(skip)
			.populate('postedBy')
			.populate('user')
			.populate('project')
			.populate('company')
			.exec(function(err, activities) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err).message,
						field: errorHandler.getErrorMessage(err).field
					});
				} else {
					res.jsonp(activities);
				}
			});		
	}
};

/**
 * Activity authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.activity.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
