'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Note Schema
 */
var NoteSchema = new Schema({
	createdAt: {
		type: Date,
		default: Date.now
	},
	note: {
		type: String,
		required: 'Please add a note.'
	},
	projectId: {
		type: Schema.ObjectId
	},
	postedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Note', NoteSchema);
