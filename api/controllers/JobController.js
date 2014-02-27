/**
 * JobController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var q = require('q');

module.exports = {


	// TODO -- DEPRE ? --
	add: function(req, res) {

		Job.find().populate('images').exec(function(err, job) {
			if (err) return res.status('500').send('Cannot list jobs.')
			res.json(jobs)
		});
	},

	/*list: function(req, res) {

		Job.create(req.body).done(function(err, job) {
			if (err) return res.status('500').send('Cannot create new job.')
			res.json(job);
		})
	},*/

	// Returns a Job list for the shooting <req.params.shooting>
	list: function(req, res) {
		Job.find({Shoot: req.params}).exec(function(err, jobs) {
			console.log('\n FOUND JOBS ', jobs)
			var output = [];
			jobs.forEach(function(job) {
				if (job.User === req.user.email) output.push(job);
			});
			res.json(output)
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
