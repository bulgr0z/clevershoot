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
				if (!user) User.invite(job.invited, job)
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
	// @param users Array [{ <mail@tld> : <jobid> }]
	// @returns ???
	_linkUsers: function(links) {
		console.log('Linking users ', links);

		var jobList = []
			, userList = []
			, linkHash = {}
			, $jobs = q.defer() // promise of a Job list for the links
			, $users = q.defer() // promise of a User list
		// build hashes, arrays
		links.forEach(function(user) {
			for(var email in user) break;
			jobList.push(user[email]);
			userList.push(email);
			linkHash[user[email]] = email;
		});
		// get jobs/users
		Job.find().where({id: jobList}).exec(function(err, jobs) {
			$jobs.resolve(jobs);
		});
		User.find().where({email: userList}).exec(function(err, users) {
			$users.resolve(users);
		});

		q.all([$jobs.promise, $users.promise]).then(function(data) {
			console.log('Wut ? Git all ? noice ', data)

			// Une fois ca en place, il faut indexOf les users trouvés de ceux demandés
			// pour lancer les invits appropriées (depuis un mandrill.js de config ?)
			// Linker les présents aux jobs, ajouter un "invited" aux autres, toussa
			//
			// --> Vérifier si "invited" est bien un array ! Il faut pouvoir rejoindre
			// tous les shoots en meme temps lors de la première co
		});

		console.log('Job list ', joblist)

	}

};
