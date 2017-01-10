'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var notes = require('../../app/controllers/notes.server.controller');

	// Notes Routes
	app.route('/notes')
		.get(notes.list)
		.post(users.requiresLogin, notes.create);

	app.route('/notes/:noteId')
		.get(notes.read)
		.put(users.requiresLogin, notes.hasAuthorization, notes.update)
		.delete(users.requiresLogin, notes.hasAuthorization, notes.delete);

	// Finish by binding the Note middleware
	app.param('noteId', notes.noteByID);
};
