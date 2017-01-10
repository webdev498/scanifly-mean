'use strict';

module.exports = function (app) {
    var contactUs = require('../controllers/contact-us.server.controller');
    var utils     = require('../controllers/utils.server.controller');

    app.route('/contact-us')
        .post(contactUs.prepareContactEmail, utils.sendEmail);
};
