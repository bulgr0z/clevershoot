var q = require('q');

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
				if (!user) User._inviteWorker(job.invited, job)
				if (user) Job.update({id: job.id}, {User: user.id}).exec(function(err, data) {
					console.log('updated JOB USER')
				});

			});

		}

		next();
	},

  // Takes an array of jobs id, returns the Jobs
	// @param jobs Array
  // @returns promise
	_findJobs: function(jobs) {

		var query = []
			, $Jobs = q.defer();

		jobs.forEach(function(job) {
			query.push({id: job});
		});

		Job.find(jobs).exec(function(err, data) {
			console.log('Multiple Jobs ?! noice ', err, data);
			$Jobs.resolve(data);
		});

		return $Jobs.promise;
	},

	// Links users to jobs, invites non-registered users
	// @param users Object { <mail@tld> : [<jobid>, <jobid>, ... ] }
	_linkUsers: function(links) {

		var jobList = []
			, userList = []
			, $jobs = q.defer() // promise of a Job list for the links
			, $users = q.defer() // promise of a User list

		// generate the Job & User id lists, they will be requested in parallel
		for (var email in links) {
			userList.push(email)
			links[email].forEach(function(jobid) {
				jobList.push(jobid);
			})
		}

		// get jobs/users
		Job.find().where({id: jobList}).exec(function(err, jobs) {
			$jobs.resolve(jobs);
		});
		User.find().where({email: userList}).exec(function(err, users) {
			$users.resolve(users);
		});

		q.all([$jobs.promise, $users.promise]).then(function(data) {

			var $jobs = data[0]
				, $users = data[1];

			// Add each existing User to its Job
			$users.forEach(function(user) {
				var userJobs = links[user.email]; // lists the jobs for this particular user
				if (userJobs.length) { // we still have jobs to link

					for (var i = 0; i < $jobs.length; i++) { // why u no foreach
						var currentjob = $jobs[i];
						if (userJobs.indexOf(currentjob.id) > -1) {
							user.Jobs.add(currentjob.id)
							user.save(function(err, save) { console.log('Added job for '+save.username); })
							links[user.email].splice(links[user.email].indexOf(currentjob.id), 1)
						}
					}
				}
			});

			// For each Job corresponding to an UNKNOWN USER, mark the Job as requiring an invite (-> invited: <user.email>)
			// The afterUpdate hook will then handle the emailing via User._inviteWorker
			for (var email in links) {
				if (links[email].length) {
					$jobs.forEach(function(job) {
						if (links[email].indexOf(job.id) > -1) {
							job.invited = email;
							job.save(function(err, save) { console.log('Marking job '+save.name+' as requiring invite.'); })
						}
					})
				}
			}

		});

	}

};
