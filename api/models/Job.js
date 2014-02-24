/**
 * Job.js
 *
 */

module.exports = {

	attributes: {
		name: 'string',
		finished: 'boolean',
		User: { // devrait s'appeller Worker, user travaillant sur le job
			model: 'user'
		},
		Shoot: {
			model: 'shoot'
		},
		Image: { // to kill ?
			model: 'Image'
		},
		emailSent: {
			type: 'boolean',
			defaultsTo: false
		},
		invited: 'string' // user invité pour le job, en attende de confirmation
	},

	// Après la maj d'un job, checker si un User est référencé. Sinon,
	// et si on a un user en "invited", envoyer un mail d'invit si "emailSent" != true
	afterUpdate: function(job, next) {
		if (!job.User && job.invited && !job.emailSent) {

			// Do we have a user corresponding to the "invited" string
			User.findOne({email: job.invited}).exec(function(err, user) {
				if (err) return console.log('Error checking user invite : ', err)
				if (!user) User.invite(job.invited, job)
				if (user) Job.update({id: job.id}, {User: user.id}).exec(function(err, data) {
					console.log('updated JOB USER')
				});

			});

		}

		next();
	}

};
