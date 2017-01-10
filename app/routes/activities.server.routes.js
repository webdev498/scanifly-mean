'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var activities = require('../../app/controllers/activities.server.controller');

	// Activities Routes
	app.route('/activities')
		.get(activities.list);

};
