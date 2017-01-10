'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

/**
 * Project detail Schema
 */
var ProjectDetailSchema = new Schema({

    roofPlanes     : {
        type: Array
    },
    droneImages    : {
        topImage: {
            type: Array
        },
        eyeView : {
            type: Array
        }
    },
    model3d        : {
        type   : String,
        default: ''
    },
    additionalFiles: {
        type: Array
    },
    shadeReport    : {
        magDec: {
            type: String,
            trim: true
        },
        roofImage        : {
            type: Array
        },
        roofNotationImage: {
            type: Array
        },
        reporterName     : {
            type: String
        },
        siteAssessorName : {
            type: String
        },
        roofs            : {
            type: Schema.Types.Mixed
        }
    },
    createdAt      : {
        type   : Date,
        default: Date.now
    }
});

mongoose.model('ProjectDetail', ProjectDetailSchema);
