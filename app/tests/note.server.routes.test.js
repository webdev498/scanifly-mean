'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Note = mongoose.model('Note'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, note;

/**
 * Note routes tests
 */
describe('Note CRUD tests', function() {
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

		// Save a user to the test db and create new Note
		user.save(function() {
			note = {
				name: 'Note Name'
			};

			done();
		});
	});

	it('should be able to save Note instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Note
				agent.post('/notes')
					.send(note)
					.expect(200)
					.end(function(noteSaveErr, noteSaveRes) {
						// Handle Note save error
						if (noteSaveErr) done(noteSaveErr);

						// Get a list of Notes
						agent.get('/notes')
							.end(function(notesGetErr, notesGetRes) {
								// Handle Note save error
								if (notesGetErr) done(notesGetErr);

								// Get Notes list
								var notes = notesGetRes.body;

								// Set assertions
								(notes[0].user._id).should.equal(userId);
								(notes[0].name).should.match('Note Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Note instance if not logged in', function(done) {
		agent.post('/notes')
			.send(note)
			.expect(401)
			.end(function(noteSaveErr, noteSaveRes) {
				// Call the assertion callback
				done(noteSaveErr);
			});
	});

	it('should not be able to save Note instance if no name is provided', function(done) {
		// Invalidate name field
		note.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Note
				agent.post('/notes')
					.send(note)
					.expect(400)
					.end(function(noteSaveErr, noteSaveRes) {
						// Set message assertion
						(noteSaveRes.body.message).should.match('Please fill Note name');
						
						// Handle Note save error
						done(noteSaveErr);
					});
			});
	});

	it('should be able to update Note instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Note
				agent.post('/notes')
					.send(note)
					.expect(200)
					.end(function(noteSaveErr, noteSaveRes) {
						// Handle Note save error
						if (noteSaveErr) done(noteSaveErr);

						// Update Note name
						note.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Note
						agent.put('/notes/' + noteSaveRes.body._id)
							.send(note)
							.expect(200)
							.end(function(noteUpdateErr, noteUpdateRes) {
								// Handle Note update error
								if (noteUpdateErr) done(noteUpdateErr);

								// Set assertions
								(noteUpdateRes.body._id).should.equal(noteSaveRes.body._id);
								(noteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Notes if not signed in', function(done) {
		// Create new Note model instance
		var noteObj = new Note(note);

		// Save the Note
		noteObj.save(function() {
			// Request Notes
			request(app).get('/notes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Note if not signed in', function(done) {
		// Create new Note model instance
		var noteObj = new Note(note);

		// Save the Note
		noteObj.save(function() {
			request(app).get('/notes/' + noteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', note.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Note instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Note
				agent.post('/notes')
					.send(note)
					.expect(200)
					.end(function(noteSaveErr, noteSaveRes) {
						// Handle Note save error
						if (noteSaveErr) done(noteSaveErr);

						// Delete existing Note
						agent.delete('/notes/' + noteSaveRes.body._id)
							.send(note)
							.expect(200)
							.end(function(noteDeleteErr, noteDeleteRes) {
								// Handle Note error error
								if (noteDeleteErr) done(noteDeleteErr);

								// Set assertions
								(noteDeleteRes.body._id).should.equal(noteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Note instance if not signed in', function(done) {
		// Set Note user 
		note.user = user;

		// Create new Note model instance
		var noteObj = new Note(note);

		// Save the Note
		noteObj.save(function() {
			// Try deleting Note
			request(app).delete('/notes/' + noteObj._id)
			.expect(401)
			.end(function(noteDeleteErr, noteDeleteRes) {
				// Set message assertion
				(noteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Note error error
				done(noteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Note.remove().exec();
		done();
	});
});