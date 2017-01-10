'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
	postedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	company: {
		type: Schema.ObjectId,
		ref: 'Company'
	},
	// this is not used anymore
	actionName: {
		type: String		
	},
	type: {
		type: String,
		default: '',
		enum: ['comments', 'project-created', 'project-updated', 'project-data-updated', 'status-changed', 'resolution-changed', 'user-created', 'user-deleted', 'user-activated', 'project-declined', 'company-created', 'flight-rescheduled', 'download-report', 'site-assessment-acknowledged']
	},
	status: {
		type: String,
		enum: ['location-submitted', 'flight-scheduled', 'flight-successful', 'upload-complete', 'resolution-required', 'resolution-complete'],
		trim: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Activity', ActivitySchema);
