'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Activity = mongoose.model('Activity'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, activity;

/**
 * Activity routes tests
 */
describe('Activity CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Activity
		user.save(function() {
			activity = {
				name: 'Activity Name'
			};

			done();
		});
	});

	it('should be able to save Activity instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Activity
				agent.post('/activities')
					.send(activity)
					.expect(200)
					.end(function(activitySaveErr, activitySaveRes) {
						// Handle Activity save error
						if (activitySaveErr) done(activitySaveErr);

						// Get a list of Activities
						agent.get('/activities')
							.end(function(activitiesGetErr, activitiesGetRes) {
								// Handle Activity save error
								if (activitiesGetErr) done(activitiesGetErr);

								// Get Activities list
								var activities = activitiesGetRes.body;

								// Set assertions
								(activities[0].user._id).should.equal(userId);
								(activities[0].name).should.match('Activity Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Activity instance if not logged in', function(done) {
		agent.post('/activities')
			.send(activity)
			.expect(401)
			.end(function(activitySaveErr, activitySaveRes) {
				// Call the assertion callback
				done(activitySaveErr);
			});
	});

	it('should not be able to save Activity instance if no name is provided', function(done) {
		// Invalidate name field
		activity.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Activity
				agent.post('/activities')
					.send(activity)
					.expect(400)
					.end(function(activitySaveErr, activitySaveRes) {
						// Set message assertion
						(activitySaveRes.body.message).should.match('Please fill Activity name');
						
						// Handle Activity save error
						done(activitySaveErr);
					});
			});
	});

	it('should be able to update Activity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Activity
				agent.post('/activities')
					.send(activity)
					.expect(200)
					.end(function(activitySaveErr, activitySaveRes) {
						// Handle Activity save error
						if (activitySaveErr) done(activitySaveErr);

						// Update Activity name
						activity.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Activity
						agent.put('/activities/' + activitySaveRes.body._id)
							.send(activity)
							.expect(200)
							.end(function(activityUpdateErr, activityUpdateRes) {
								// Handle Activity update error
								if (activityUpdateErr) done(activityUpdateErr);

								// Set assertions
								(activityUpdateRes.body._id).should.equal(activitySaveRes.body._id);
								(activityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Activities if not signed in', function(done) {
		// Create new Activity model instance
		var activityObj = new Activity(activity);

		// Save the Activity
		activityObj.save(function() {
			// Request Activities
			request(app).get('/activities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Activity if not signed in', function(done) {
		// Create new Activity model instance
		var activityObj = new Activity(activity);

		// Save the Activity
		activityObj.save(function() {
			request(app).get('/activities/' + activityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', activity.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Activity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Activity
				agent.post('/activities')
					.send(activity)
					.expect(200)
					.end(function(activitySaveErr, activitySaveRes) {
						// Handle Activity save error
						if (activitySaveErr) done(activitySaveErr);

						// Delete existing Activity
						agent.delete('/activities/' + activitySaveRes.body._id)
							.send(activity)
							.expect(200)
							.end(function(activityDeleteErr, activityDeleteRes) {
								// Handle Activity error error
								if (activityDeleteErr) done(activityDeleteErr);

								// Set assertions
								(activityDeleteRes.body._id).should.equal(activitySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Activity instance if not signed in', function(done) {
		// Set Activity user 
		activity.user = user;

		// Create new Activity model instance
		var activityObj = new Activity(activity);

		// Save the Activity
		activityObj.save(function() {
			// Try deleting Activity
			request(app).delete('/activities/' + activityObj._id)
			.expect(401)
			.end(function(activityDeleteErr, activityDeleteRes) {
				// Set message assertion
				(activityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Activity error error
				done(activityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Activity.remove().exec();
		done();
	});
});