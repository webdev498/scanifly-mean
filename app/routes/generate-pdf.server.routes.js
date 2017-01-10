'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var projects = require('../../app/controllers/projects.server.controller');
    var pdf = require('../../app/controllers/generate-pdf.server.controller');

    // Notes Routes
    app.route('/generate-pdf/:projectId')
        .get(pdf.generatePdfFromProject);

    app.route('/generate-shade-report-pdf/:projectId')
        .get(pdf.generateShadeReportPdf);


    app.param('projectId', projects.projectByID);
};
