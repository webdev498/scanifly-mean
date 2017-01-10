'use strict';

module.exports = function(app) {
	var users     = require('../../app/controllers/users.server.controller'),
	    companies = require('../../app/controllers/companies.management.server.controller');

	app.route('/companies')
		.get(users.requiresLogin, companies.list)
        .put(users.requiresLogin, companies.update);
        
    app.route('/companies/:companyId')
        .delete(users.requiresLogin, companies.delete);

    // Finish by binding the Project middleware
    app.param('companyId', companies.companyByID);

};
