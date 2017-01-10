'use strict';

var cors = require('cors');
var bodyParser = require('body-parser');

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectDetails = require('../../app/controllers/project-details.server.controller');

	app.use(cors());

	// Project details Routes
	app.route('/project-details')
		.get(projectDetails.list)
		.post(users.requiresLogin, projectDetails.processRoofPlanes, projectDetails.create);

	app.route('/project-details/:projectDetailId')
		.get(projectDetails.read)
		.put(bodyParser.json({ limit: '25mb' }), projectDetails.processRoofPlanes, projectDetails.update)
		.delete(users.requiresLogin, projectDetails.delete);

	// Finish by binding the Project detail middleware
	app.param('projectDetailId', projectDetails.projectDetailByID);
};
