/**
 * JobController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var q = require('q');

module.exports = {

	// v0.2
	add: function(req, res) {

		// Devrait checker si le user est bien admin

		if (!req.body.Shoot || !req.body.User) return res.status('500').send('Cannot create empty job.')

		Job.create({
			Shoot: req.body.Shoot,
			User: req.body.User,
			role: req.body.role,
			name: req.body.name
		}).exec(function(err, job) {
			if (err) return res.status('500').send('Cannot create job <'+err+'>');
			res.json(job);
		});

	},

	// v0.2
	// Returns a Job list for the shooting <req.params.shooting>
	list: function(req, res) {

		console.log('shoot ? ', req.params)

		Job.find({Shoot: req.params.shooting}).exec(function(err, jobs) {
			console.log('\n FOUND JOBS ', jobs)
			res.json(jobs)
		});
	},

	// Mettre a jour les invitations des users, un job afterUpdate se charge de faire les
	// checks/add/mails
	inviteusers: function(req, res) {
		var users = [];
		req.body.forEach(function(job) {
			Job.update({id: job.id}, {invited: job.user}).exec(function(err, updatedjob) {
				if (err) return res.status('500').send('Cannot update job.')
				return res.status('200').send();
			})
		})

	},

	addJob: function(type) {


	}

};
