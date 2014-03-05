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

	// v0.2
	// Handles the creation of new shooting with its name, description and Jobs list.
	// Jobs are created here at the same time, but actions (invite, etc..) will be handled
	// by their specific hooks in models/Job
	add: function(req, res) {

		Shoot.create({
			name: req.body.name,
			Admin: req.user.email
		}).done(function(err, shoot) {

			if (err) res.send(500, { error: 'Cannot create new shooting <'+err+'>' })

			// add admin job fot this shooting
			Job.create({
				name: 'admin',
				role: 'admin',
				User: req.user.email,
				Shoot: shoot.id
			}).exec(function(err, data) {
				if (err) res.send(500, { error: 'Cannot create admin job for '+shoot.id+' <'+err+'>' })
				res.json(shoot);
			});

		});
	},

	update: function(req, res) {
		console.log('update ?')
	},

	// v0.2
	// TODO Associations
	// TODO Only admin user should be able to see the full Jobs list
	// Finds every shooting the current registered user can see
	// @returns Array [ { ... , Jobs: [ {...} ] } ]
	list: function(req, res) {

		var $shoots = q.defer();

		// List every worker role for this user
		Job.find({User: req.user.email}).exec(function(err, jobs) {
			if (err) return res.status('500').send('Cannot find jobs for '+req.user.email+' : <'+err+'>');
			var ids = [];
			jobs.forEach(function(job) { ids.push(job.Shoot); })
			Shoot.find({id: ids}).populate('Jobs').exec(function(err, shoots) {
				if (err) return res.status('500').send('Cannot find '+req.user.email+' shootings : <'+err+'>');
				if (!err) $shoots.resolve(shoots)
			});
		});

		$shoots.promise.then(function(shoots) {
			// Without proper associations, we need to manually remove
			// every Job not belonging to the current user.
			shoots.forEach(function(shoot, s) {
				shoot.Jobs.forEach(function(job, j) {
					if (job.User !== req.user.email)
						delete shoots[s]['Jobs'][j]
				});
			})
			res.json(shoots);
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

	},

	angularRedirect: function(req, res) {

		var url = req.url.split('/shoot/')[1];
		res.redirect('/shoot/#/'+url)
	}

};
