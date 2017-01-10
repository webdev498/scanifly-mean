'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    crypto   = require('crypto');

/**
 * Company Schema
 */
var CompanySchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ''
    },
    softwareDetails: {
        software: {
            type: String,
            trim: true
        },
        softwareYear: {
            type   : Number,
            trim   : true
        },
        sketchupYear: {
            type   : Number,
            trim   : true
        },
        otherCadSoftware: {
            type   : String,
            trim   : true
        }
    },
    updated: {
        type: Date
    },
    created: {
        type   : Date,
        default: Date.now
    }
});

mongoose.model('Company', CompanySchema);
