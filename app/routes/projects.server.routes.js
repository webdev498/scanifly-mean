'use strict';

module.exports = function (app) {
    var users    = require('../../app/controllers/users.server.controller');
    var projects = require('../../app/controllers/projects.server.controller');

    // Projects Routes
    app.route('/projects')
        .get(users.requiresLogin, projects.list)
        .post(users.requiresLogin, projects.create);

    app.route('/projects/:projectId')
        .get(users.requiresLogin, projects.read)
        .put(users.requiresLogin, projects.update)
        .delete(users.requiresLogin, projects.delete);

    // Finish by binding the Project middleware
    app.param('projectId', projects.projectByID);
};
