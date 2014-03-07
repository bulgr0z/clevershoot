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

	// v0.2
	update: function(req, res) {

		var $shoot = q.defer()
			, $job = q.defer();

		Job.findOne({id: req.query.job}).exec(function(err, job) {
			if (err || !job.id) return res.status('500').send('Cannot find a job to update <'+err+'>');
			$job.resolve(job);


			Shoot.findOne({id: job.Shoot}).exec(function(err, shoot) {
				if (err || !shoot.id) return res.status('500').send('Cannot find a shooting for this job <'+err+'>');
				$shoot.resolve(shoot);
			});
		});

		q.all([$shoot.promise, $job.promise]).then(function(data) {
			$shoot = data[0];
			$job = data[1];

			if ($shoot.Admin !== req.user.email)
				return res.status('500').send('Not enough privileges');

			Job.update({id: req.query.job}, {User: req.query.email}).exec(function(err, job) {
				if (err || !job.length) res.status('500').send('Cannot update job <'+err+'>');
				res.json(job[0]);
			});

		});

	},

	// v0.2
	remove: function(req, res) {

		var $shoot = q.defer()
			, $job = q.defer()
			, $images = q.defer();

		Job.findOne({id: req.query.job}).exec(function(err, job) {
			if (err || !job.id) return res.status('500').send('Cannot find a job to remove <'+err+'>');
			$job.resolve(job);

			Shoot.findOne({id: job.Shoot}).exec(function(err, shoot) {
				if (err || !shoot.id) return res.status('500').send('Cannot find a shooting for this job <'+err+'>');
				$shoot.resolve(shoot);
			});

			Image.find({Shoot: job.Shoot}).exec(function(err, images) {
				if (err || !images.length) return res.status('500').send('Cannot find images for this job <'+err+'>');
				$images.resolve(images);
			})

		});

		q.all([$shoot.promise, $job.promise, $images.promise]).then(function(data) {
			$shoot = data[0]
			$job = data[1]
			$images = data[2];

			if ($shoot.Admin !== req.user.email)
				return res.status('500').send('Not enough privileges');

			// delete this job in the images if it was already marked as "done"
			$images.forEach(function(image) {
				if (image.jobsdone && image.jobsdone.length) {
					image.jobsdone.splice(image.jobsdone.indexOf($job.id), 1);
					image.save(function(err, image) {console.log('Removed a job for ', image)});
				}
			});

			$job.destroy(function(err) {
				if (err) return res.status('500').send('Cannot delete job <'+err+'>');
				res.json({ok: true});
			});

		})

	}

};
