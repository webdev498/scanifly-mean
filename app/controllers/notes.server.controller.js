'use strict';

/**
 * Module dependencies.
 */
var mongoose     = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	config       = require('../../config/config'),
	utilsController    = require('./utils.server.controller'),
    projectsController = require('./projects.server.controller'),
	Note         = mongoose.model('Note'),
		Activity = mongoose.model('Activity'),
	_ = require('lodash');

/**
 * Create a Note
 */
exports.create = function(req, res) {
    var note      = new Note(req.body);
    note.postedBy = req.user;
    req.body._id  = req.body.projectId;

    projectsController.getProjectByID(req.body.projectId, function(project) {
        note.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err).message,
                    field: errorHandler.getErrorMessage(err).field
                });
            } else {

                (new Activity({
                    type: 'comments',
                    postedBy: req.user,
                    project: req.body.projectId,
                    company: project.company
                })).save();

                var newNote = {
                    note: note.note,
                    createdAt: note.createdAt,
                    postedBy: {
                        name: req.user.name
                    }
                };

                utilsController.getRelevantUsersPerProject(req, req.body, function(users) {
                    for (var elementId in users) {
                        utilsController.sendNoteEmail(res, users[elementId].userEmail, users[elementId].variables);
                    }
                });

                res.jsonp(newNote);
            }
        });
    });
};

/**
 * Show the current Note
 */
exports.read = function(req, res) {
	res.jsonp(req.note);
};

/**
 * Update a Note
 */
exports.update = function(req, res) {
	var note = req.note ;

	note = _.extend(note , req.body);

	note.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err).message,
				field: errorHandler.getErrorMessage(err).field
			});
		} else {
			res.jsonp(note);
		}
	});
};

/**
 * Delete an Note
 */
exports.delete = function(req, res) {
	var note = req.note ;

	note.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err).message,
				field: errorHandler.getErrorMessage(err).field
			});
		} else {
			res.jsonp(note);
		}
	});
};

/**
 * List of Notes
 */
exports.list = function(req, res) {

	var filters   = {};
	
	if (mongoose.Types.ObjectId.isValid(req.query.projectId)) {
		filters = {
			projectId: mongoose.Types.ObjectId(req.query.projectId)
		};

		Note
			.find(filters)
			.sort('-createdAt')
			.populate('postedBy')
			.exec(function(err, notes) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err).message,
					field: errorHandler.getErrorMessage(err).field
				});
			} else {
				res.jsonp(notes);
			}
		});
	}
};

/**
 * Note middleware
 */
exports.noteByID = function(req, res, next, id) { 
	Note.findById(id).populate('user', 'name').exec(function(err, note) {
		if (err) return next(err);
		if (! note) return next(new Error('Failed to load Note ' + id));
		req.note = note ;
		next();
	});
};

/**
 * Note authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.note.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
