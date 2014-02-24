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

	listJobs: function() {

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

	angularRedirect: function(req, res) {

		var url = req.url.split('/shoot/')[1];
		res.redirect('/shoot/#/'+url)
	}

};
