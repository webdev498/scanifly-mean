'use strict';

exports.prepareContactEmail = function (req, res, next) {

    req.mailData = {
        template : 'templates/contact-us-email',
        variables: {
            firstName      : req.body.firstName,
            lastName       : req.body.lastName,
            email          : req.body.email,
            companyName    : req.body.companyName || 'Not available',
            siteAssessments: req.body.siteAssessments || '',
            subject        : req.body.subject || '',
            message        : req.body.message || 'No message'
        },
        from     : req.body.email,
        subject  : 'Scanifly :: New contact message received!'
    };

    next();

};
   
