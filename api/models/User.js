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
		username: "string",
		email: {
			type: "email",
			required: true,
			unique: true,
			primaryKey: true
		},
		password: {
			type: "string",
			required: true
		},
		Jobs: {
			model: 'job'
		},
		Group: {
			model: "group"
		}
	},

	invite: function(email, job) {

		var mandrill = new MandrillApi(sails.config.mandrillApiKey, { version : '1.0', secure: false })
		var templateReady = q.defer();

		handlebars.render(
			path.normalize(__dirname + '/../../views/mail/invite.html'),
			{
				email: email,
				jobName: job.name
			},
			function(err, tpl) {
				templateReady.resolve(tpl)
			}
		)
		templateReady.promise.then(function(template) {

			var message = {
				html : template,
				text : "You need a html compatible email client to view this message.",
				subject : "You've been invited to work on a shooting",
				from_email : "invite@clevershoot.com",
				from_name : 'Clevershoot Team',
				headers: {
					"Reply-To": "noreply@clevershoot.com"
				},
				to: [{
					email: email,
					name: email,
					type: "to"
				}]
			}

			mandrill.call('messages', 'send', {"message": message, "async": false}, function (error, data) {
				console.log("Calling mandrill")
				console.log(error, data)
				if (!error) Job.update({id: job.id}, {emailSent: true}).exec(function(err, job) {
					console.log('updated job !', err, job)
				});
			});

		});
	},

	// Vérifie si le user a été invité dans des shoots, le rajoute
	afterCreate: function(user, next) {
		Job.find({invited: user.email}).exec(function(err, jobs) {
			if (jobs.length) {
				// Si on a des jobs qui listent l'email, le valider en le rajoutant dans le User du Job
				jobs.forEach(function(job) {
					Job.update({id: job.id}, {User: user.id}).exec(function(err, data) {
						console.log('updated job with new user', err, data);
						next();
					})
				})
			} else {
				// sinon rien
				next();
			}
		})
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