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

			// do we have any jobs for this Shoot ? (protip: we should)
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
	list: function(req, res) {
		Job.find({User: req.user.id}).populate('Shoot').exec(function(err, jobs) {
			if (err) console.log('Cannot list jobs : ', err);
			res.json(jobs)
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

		/**
		 * Pas bon, devrait préparer une requete plus propre,
		 * avec d'un coté les workers et de l'autre les observers.
		 * Le tout pas dans une boucle de la mort, mais bien groupé comme il faut
		 *
		 * Chaque job appartient à un user
		 * Les jobs sont référencés dans le shoot
		 * Les observers sont simples "users" du shoot
		 *
		 */

		//var $jobs = Job._findJobs();

		var roles = req.query;

		console.log("QUERY ?",typeof req.query)

		// To match users with their roles, we need to separate workers from observers
		var workers = []
			, observers = [];

		for (var role in roles) {
			var $role = JSON.parse(roles[role]);
			console.log($role, typeof $role)
			for (var email in $role) {
				// no job id is linked for the user, he is an observer
				if ($role[email] === null) {
					observers.push(email);
				} else {
					workers.push($role);
				}
			}
		}

		Job._linkUsers(workers);

		console.log("Workers : ", workers, "Observers : ", observers);

		/*for (var role in roles) {
			var $role = roles[role];
			console.log($role)
			for (var user in $role) {
				// observer
				if ($role[user] === null) {

				} else {
				// worker
					Job.find({id: $role[user]}).exec(function(err, data) {
						console.log('Finding job for ', user);
						console.log("Job : ", err, data);
					})
				}
			}
		}*/

		//console.log('UPDATE ROLES', req.body, req.query);
	},

	angularRedirect: function(req, res) {

		var url = req.url.split('/shoot/')[1];
		res.redirect('/shoot/#/'+url)
	}

};
