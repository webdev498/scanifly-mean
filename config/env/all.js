'use strict';

module.exports = {
    db               : process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/scanifly',
    app              : {
        title      : 'Scanifly',
        description: 'Solar Companies, Scanifly, Drones, Flights, 3d Reports',
        keywords   : 'Solar Companies'
    },
    baseUrl          : process.env.BASE_URL || '',
    port             : process.env.PORT || 3000,
    pdfCrowd         : {
        'name': process.env.PDFCROWD_NAME || '',
        'key' : process.env.PDFCROWD_KEY || ''
    },
    s3               : {
        AWSSecretKeyId    : process.env.AWS_SECRET_KEY_ID || '',
        AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        bucket            : process.env.S3_BUCKET || ''
    },
    mailer           : {
        to     : process.env.MAILER_TO   || 'd.kobozev@scanifly.com',
        from   : process.env.MAILER_FROM || 'd.kobozev@scanifly.com',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
            auth   : {
                user: 'd.kobozev@scanifly.com',
                pass: 'Scanit1913'
            }
        }
    },
    prerenderToken   : process.env.PRERENDER_TOKEN || '',
    templateEngine   : 'swig',
    sessionSecret    : 'MEscanANfly',
    sessionCollection: 'sessions'
};
