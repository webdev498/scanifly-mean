'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({

	name: {
		type: String,
		required: 'Project name required',
		trim: true
	},

	details: {
		type: Schema.ObjectId,
		ref: 'ProjectDetail'
	},

	propertyImage: {
		type: String,
		default: '',
		trim: true
	},

	address : {
		street: {
			type: String,
			required: 'Street required',
			trim: true
		},
		city: {
			type: String,
			required: 'City required',
			trim: true
		},
		state: {
			type: String,
			required: 'State required',
			trim: true
		},
		stateName: {
			type: String,
			trim: true
		},
		zip: {
			type: String,
			required: 'Zip Code required',
			trim: true
		}
	},

	geoLocation: {
		latitude: {
			type: Number,
			required: 'Latitude required',
			trim: true
		},
		longitude: {
			type: Number,
			required: 'Longitude required',
			trim: true
		}
	},

	ownerDetails: {
		firstName: {
			type: String,
			required: 'First Name required',
			trim: true
		},
		lastName: {
			type: String,
			required: 'Last Name required',
			trim: true
		},
		email: {
			type: String,
			required: 'E-Mail required',
			trim: true
		},
		phone: {
			type: String,
			required: 'Phone required',
			trim: true
		}
	},

	propertyDetails: {
		nearTrees: {
			type: Boolean,
			default: false
		},
		nearAirport: {
			type: Boolean,
			default: false
		},
		nearHighVoltage: {
			type: Boolean,
			default: false
		},
		nearHighway: {
			type: Boolean,
			default: false
		}
	},

	map: {
		type: Schema.Types.Mixed
	},

	kWh: {
		month1: {
			type: String,
			trim: true,
			default: ''
		},
		month2: {
			type: String,
			trim: true,
			default: ''
		},
		month3: {
			type: String,
			trim: true,
			default: ''
		},
		month4: {
			type: String,
			trim: true,
			default: ''
		},
		month5: {
			type: String,
			trim: true,
			default: ''
		},
		month6: {
			type: String,
			trim: true,
			default: ''
		},
		month7: {
			type: String,
			trim: true,
			default: ''
		},
		month8: {
			type: String,
			trim: true,
			default: ''
		},
		month9: {
			type: String,
			trim: true,
			default: ''
		},
		month10: {
			type: String,
			trim: true,
			default: ''
		},
		month11: {
			type: String,
			trim: true,
			default: ''
		},
		month12: {
			type: String,
			trim: true,
			default: ''
		},
		annual: {
			type: String,
			trim: true,
			default: ''
		}
	},
	
	selfscan: {
		type: Boolean,
		default: false
	},
	
	submittedDate: {
		type: Date,
		default: Date.now
	},
	
	completeDate: { // Assessment complete || Resolution complete
		type: Date
	},

	submittedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	company: {
		type: Schema.ObjectId,
		ref: 'Company'
	},
	
	scheduledFlight: {
		type: Date
	},
	successfulFlight: {
		type: Date
	},
	uploadComplete: {
		type: Date
	},
	resolutionRequired: {
		type: Date
	},

	status: {
		type: String,
		enum: ['location-submitted', 'flight-scheduled', 'flight-successful', 'upload-complete', 'resolution-required', 'resolution-complete', 'declined', 'approved'],
		trim: true
	},

	isApproved: {
		type: Boolean,
		default: false
	},

	isCompleted: {
		type: Boolean,
		default: false
	}

});

mongoose.model('Project', ProjectSchema);
