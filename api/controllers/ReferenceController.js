var q = require('q');

module.exports = {

	add: function(req, res) {

		Reference.create(req.body).done(function(err, ref) {
			if (err) return console.log('Cannot add Reference : ', err)
			res.json(ref);
		})
	},

	// v0.2
	list: function(req, res) {

		var $jobs = q.defer()
			, $refs = q.defer();

		Job.find({ Shoot: req.query.shooting }).exec(function(err, jobs) {
			if (err) return res.status('500').send('Cannot find jobs for '+req.query.shooting+' : <'+err+'>');
			$jobs.resolve(jobs);
		})

		Reference.find({ Shoot: req.query.shooting })
			.populate('Images')
			.sort({ createdAt: 'desc' })
			.exec(function(err, refs) {
				if (err) return res.status('500').send('Cannot find references for '+req.query.shooting+' : <'+err+'>');
				$refs.resolve(refs);
			});

		q.all([$jobs.promise, $refs.promise]).then(function(data) {

			var $jobs = data[0]
				, $refs = data[1]
				, jobCount = 0; // number of "worker" jobs to be toggled to mark an image as "isDone"

			$jobs.forEach(function(job) {
				if (job.role === "worker") jobCount++;
			});

			$refs.forEach(function(ref, r) {
				var imagesDone = 0;
				if (ref.Images && ref.Images.length) {
					ref.Images.forEach(function(image, i) {
						// mark images as "isDone"
						if (image.jobsdone && image.jobsdone.length === jobCount) {
							$refs[r]['Images'][i]['isDone'] = true;
							imagesDone ++;
						}
					});
				}
				if (imagesDone === ref.Images.length) {
					$refs[r]['isDone'] = true;
				}

			});

			res.json($refs);

		});
	}

};
