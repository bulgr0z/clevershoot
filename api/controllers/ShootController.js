/**
 * ShootController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var q = require('q');

module.exports = {

	index: function(req, res) {
		res.view();
	},

	// Handles the creation of new shooting with its name, description and Jobs list.
	// Jobs are created here at the same time, but actions (invite, etc..) will be handled
	// by their specific hooks in models/Job
	add: function(req, res) {

		var jobs = req.body.jobs;
		var $jobs = [];

		console.log("body ", req.body, req.body.jobs)

		Shoot.create({
			name: req.body.name,
			Admin: req.user.id
		}).done(function(err, shoot) {

			// do we have any jobs for this Shoot ? (hint: we should)
			if (jobs.length) {
				jobs.forEach(function(job) {
					$jobs.push(Job.create({
						name: job
					}));
				})

				q.all($jobs).then(function(jobs) {
					// link our jobs to the Shoot
					for (var job in jobs) {
						shoot.Jobs.add(jobs[job].id)
					}
					// save the associations & redirect to provide a fully populated Shoot object
					shoot.save(function(err) {
						if (err) return console.log('Error updating Shoot model : ', err)
						res.redirect('/shoot/get/'+shoot.id);
					})
				})

			}
		});
	},

	update: function(req, res) {
		console.log('update ?')
	},

	// Trouver tous les shoots auquel participe le user via les jobs auxquels il est enregistré
	// @returns Object { <shootid> : [ { userjob: Job || null } ] }
	list: function(req, res) {

		var $jobs = q.defer()
			, $shoots = q.defer();

		// List every worker role for this user
		Job.find({User: req.user.email}).populate('Shoot').exec(function(err, jobs) {
			if (!err) $jobs.resolve(jobs)
		});
		// List every observer role for this user
		Shoot.find({observers: {contains: req.user.email}}).exec(function(err, shoots) {
			if (!err) $shoots.resolve(shoots)
		});

		q.all([$jobs.promise, $shoots.promise]).then(function(data) {

			var $jobs = data[0]
				, $shoots = data[1]
				, shootings = {}; // response obj

			$shoots.forEach(function(shoot) {
				if (!shootings[shoot.id]) shootings[shoot.id] = [];
				shoot = shoot.toObject();
				shoot.userjob = null;
				shootings[shoot.id].push(shoot);
			});

			$jobs.forEach(function(job) {
				if (!shootings[job.Shoot.id]) shootings[job.Shoot.id] = [];

				var cleanShoot = job.Shoot.toObject();
				var cleanJob = job.toObject();
				delete cleanJob.Shoot;

				cleanShoot.userjob = cleanJob;
				shootings[job.Shoot.id].push(cleanShoot);

			});

			console.log('shootings : ', shootings)

			res.json(shootings)

		});

	},

	addJob: function(req, res) {

		console.log('devrait pas utiliser addJob')

		/*Job.create({
			name: req.body.name,
			user: req.user.id
		}).done(function(err, job) {
			console.log('add job')
		})*/
	},

	get: function(req, res) {

		console.log('list shoot,', req.params.id)

		Shoot.find({
			id: req.params.id
		}).populate('Jobs').exec(function(err, myShoot) {
			if (err) return console.log('Error, cannot get Shoot ', err)
			res.json(myShoot[0]);
		})
	},

	updateRoles: function(req, res) {

		var roles = req.query;

		// To match users with their roles, we need to separate workers from observers
		var workers = {}
			, observers = [];

		for (var role in roles) {
			var $role = JSON.parse(roles[role]); // thx angular...

			for (var email in $role) {
				// no job id is linked for the user, he is an observer
				if ($role[email] === null) {
					observers.push(email);
				} else {
					if (!workers[email]) workers[email] = [];
					workers[email].push($role[email]);
				}
			}
		}

		Job._linkUsers(workers);
		Shoot._linkObservers(req.params.shoot, observers);

		console.log("Workers : ", workers, "Observers : ", observers);
	},

	angularRedirect: function(req, res) {

		var url = req.url.split('/shoot/')[1];
		res.redirect('/shoot/#/'+url)
	}

};
