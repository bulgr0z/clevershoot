/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt')
	, MandrillApi = require('mailchimp').MandrillAPI
	, handlebars = require('express3-handlebars').create()
	, q = require('q')
	, path = require('path')


module.exports = {

	attributes: {
		username: 'string', // self exp
		// Primary key, we cannot register two users with the same email
		email: {
			type: 'email',
			required: true,
			unique: true,
			primaryKey: true
		},
		password: { // self exp
			type: 'string',
			required: true
		},
		// All the Jobs authorized to the user, regardless of the Shooting
		Jobs: {
			collection: 'job',
			via: 'User'
		},
		Group: { // unused
			model: 'group'
		}
	},

	emailTemplates: {
		worker: {
			template: path.normalize(__dirname + '/../../views/mail/inviteWorker.html'),
			message: {
				text : "You need a html compatible email client to view this message.",
				subject : "You've been invited to work on a shooting",
				from_email : "invite@clevershoot.com",
				from_name : 'Clevershoot Team',
				headers: {
					"Reply-To": "noreply@clevershoot.com"
				}
			}
		},
		observer: {
			template: path.normalize(__dirname + '/../../views/mail/inviteObserver.html'),
			message: {
				text : "You need a html compatible email client to view this message.",
				subject : "You've been invited to observe a shooting",
				from_email : "invite@clevershoot.com",
				from_name : 'Clevershoot Team',
				headers: {
					"Reply-To": "noreply@clevershoot.com"
				}
			}
		}
	},

	_inviteObserver: function(email, shoot) {

		var mandrill = new MandrillApi(sails.config.mandrillApiKey, { version : '1.0', secure: false })
		var templateReady = q.defer();

		handlebars.render(
			User.emailTemplates.observer.template,
			{ email: email, name: shoot.name },
			function(err, tpl) { templateReady.resolve(tpl) }
		)

		templateReady.promise.then(function(template) {

			var message = User.emailTemplates.observer.message;
					message.html = template;
					message.to = [{ email: email, name: email, type: "to" }];

			mandrill.call('messages', 'send', {"message": message, "async": false}, function (error, data) {
				console.log("Calling mandrill for Observer")
				console.log(error, data)
				Shoot.findOne({id: shoot.id}).exec(function(err, shoot) {
					if (!shoot.invited) shoot.invited = [];
					if (shoot.invited.indexOf(email) > -1) return console.log('Cannot invite a user twice.');
					if (shoot.invited.indexOf(email) < 0) {
						shoot.invited.push(email);
						shoot.save(function() { console.log('saved shoot invite') });
					}
				});
			});

		});
	},

	_inviteWorker: function(email, job) {

		var mandrill = new MandrillApi(sails.config.mandrillApiKey, { version : '1.0', secure: false })
		var templateReady = q.defer();

		handlebars.render(
			User.emailTemplates.worker.template,
			{ email: email, name: job.name },
			function(err, tpl) { templateReady.resolve(tpl) }
		)

		templateReady.promise.then(function(template) {

			var message = User.emailTemplates.worker.message;
					message.html = template;
					message.to = [{ email: email, name: email, type: "to" }];

			mandrill.call('messages', 'send', {"message": message, "async": false}, function (error, data) {
				console.log("Calling mandrill for Worker")
				console.log(error, data)
				if (!error) Job.update({id: job.id}, {emailSent: true}).exec(function(err, job) {
					console.log('updated job !', err, job)
				});
			});

		});
	},

	// Checks if the newly added user is awaiting any roles in the application (both Observer or Worker),
	// if any found, they will be properly linked to our user
	// @param user Object userModel
	// @param next Function
	afterCreate: function(user, next) {

		var $shoots = q.defer()
			, $jobs = q.defer();

		// Find all SHOOTINGS where our user is referenced as an "Observer"
		Shoot.find({ invited: { 'contains' : user.email }}).exec(function(err, shoots) {
			$shoots.resolve(shoots)
		});
		// Find all JOBS awaiting our user's registration
		Job.find({invited: user.email}).exec(function(err, jobs) {
			$jobs.resolve(jobs)
		});

		q.all([$shoots.promise, $jobs.promise]).then(function(data) {
			var $shoots = data[0]
				, $jobs = data[1];

			// remove the user from the "invited" list and add him to the Users list
			if ($shoots.length) {

				$shoots.forEach(function(shoot) {
					if (!shoot.observers || !shoot.observers.length) shoot.observers = [];
					shoot.invited.splice(shoot.invited.indexOf(user.email), 1);
					shoot.observers.push(user.email);
					shoot.save(function() { console.log('saved a user ', arguments) });
				});
			}

			// register the job
			if ($jobs.length) {
				$jobs.forEach(function(job) {
					Job.update({id: job.id}, {User: user.id}).exec(function(err, data) {
						console.log('updated job with new user', err, data);
					})
				})
			}

			next();

		});

	},

	// bcrypt the user's password before insert
	beforeCreate: function(values, next) {

		bcrypt.hash(values.password, 10, function(err, hash) {
			if(err) return next(err);
			values.password = hash;
			next();
		});
	},

	compare: function(plaintext, hash, next) {

		bcrypt.compare(plaintext, hash, function(err, res) {
			if(err || !res) return next(err, false);
			return next(null, true);
		});
	}

};