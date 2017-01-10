'use strict';

var config = require('../../config/config'),
    crypto = require('./crypto.server.controller.js');

exports.read = function (req, res) {
    res.jsonp(req.resourceConfiguration);
};

var signS3Policy = function () {

    var bucket    = config.s3.bucket;
    var bucketUrl = 'https://' + config.s3.bucket + '.s3.amazonaws.com/';
    var AWSSecretKeyId     = config.s3.AWSSecretKeyId;
    var AWSSecretAccessKey = config.s3.AWSSecretAccessKey;

    var POLICY_JSON = {
        'expiration': '2020-12-01T12:00:00.000Z',
        'conditions': [
            {'bucket': bucket},
            ['starts-with', '$key', ''],
            {'acl': 'public-read'},
            ['starts-with', '$Content-Type', '']
        ]
    };

    var policyBase64 = new Buffer(JSON.stringify(POLICY_JSON)).toString('base64');
    var signature = crypto.b64_hmac_sha1(AWSSecretAccessKey, policyBase64) + '=';

    return {
        AWSAccessKeyId: AWSSecretKeyId,
        policy        : policyBase64,
        signature     : signature,
        bucketUrl     : bucketUrl,
        bucketName    : bucket
    };
};

exports.getResourceName = function (req, res, next, resource) {

    switch (resource) {
        case 's3' :
            req.resourceConfiguration = signS3Policy();
            break;

        default :

            req.resourceConfiguration = config[resource] || {};
            break;
    }

    next();
};


