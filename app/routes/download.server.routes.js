'use strict';

module.exports = function (app) {
    var users    = require('../../app/controllers/users.server.controller');
    var projects = require('../../app/controllers/projects.server.controller');
    var download = require('../../app/controllers/download.server.controller');

    // Notes Routes
    app.route('/download/:projectId')
        .get(download.getZip);

    app.route('/download-shade-report/:projectId')
        .get(download.getShadeReportZip);

    app.param('projectId', projects.projectByID);
};
