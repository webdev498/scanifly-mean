'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var configuration = require('../../app/controllers/configuration.server.controller');
    
    app.route('/configuration/:resource')
        .get(users.requiresLogin, configuration.read);

    app.param('resource', configuration.getResourceName);

};
