/**
 * JobController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var q = require('q');

module.exports = {

	add: function(req, res) {

		Job.find().populate('images').exec(function(err, job) {
			if (err) return console.log('Cannot list Jobs : ', err)
			console.log(jobs);
			res.json(jobs)
		});
	},

	list: function(req, res) {

		Job.create(req.body).done(function(err, job) {
			if (err) return console.log('Cannot add Job : ', err)
			res.json(job);
		})
	},

	// Mettre a jour les invitations des users, un job afterUpdate se charge de faire les
	// checks/add/mails
	inviteusers: function(req, res) {
		var users = [];
		req.body.forEach(function(job) {
			Job.update({id: job.id}, {invited: job.user}).exec(function(err, updatedjob) {
				console.log('updated job !', updatedjob, err)
			})
		})

	}

};
