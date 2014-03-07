var path = require('path')
	, fs = require('fs')
	, q = require('q');

module.exports = {

	/**
	 * Receives an image for a given Reference, store it in /public/uploads/<Reference_id>/<filename>.<ext>
	 * For a successful upload/copy, will generate a Image model for the new pic and link it to its Reference parent.
	 *
	 * @param req
	 * @param res
	 */
	upload: function(req, res) {

		var uploadFolder = path.normalize(__dirname + '/../../assets/public/uploads/'+ req.params.reference);
		var tmpSymlinkFolder = path.normalize(__dirname + '/../../.tmp/public/public/uploads/'+ req.params.reference);
		var ext = req.files.file.originalFilename.split('.');
				ext = ext.slice((ext.length - 1), ext.length);
		var filename = (new Date().getTime()).toString(16)+'.'+ext;

		fs.mkdir(uploadFolder, 0755, function() {
			// copy the file
			var sourceFolder = fs.createReadStream(req.files.file.path);
			var destFolder = fs.createWriteStream(uploadFolder +'/'+filename);
			var publicFolder = '/public/uploads/'+ req.params.reference +'/'+filename;

			sourceFolder.pipe(destFolder)
			destFolder.on('finish', function() {

				// clean temp data
				fs.unlink(req.files.file.path);
				// ugly : we need a symlink to bypass grunt assets compilation to from /assets to /.tmp
				// otherwise the image may not be instantly visible to the user
				var isDir = fs.existsSync(tmpSymlinkFolder)
				if (!isDir) fs.mkdirSync(tmpSymlinkFolder, 0755)
				fs.symlinkSync(uploadFolder+'/'+filename, tmpSymlinkFolder+'/'+filename);

				// Get a promise for the corresponding Reference
				var myRef = Reference.findOne({
					id: req.params.reference
				}).populate('Images').done(function(err, ref) {
					// create a new Image model
					Image.create({
						Reference: req.params.reference,
						Shoot: ref.Shoot,
						User: req.user.email,
						url: publicFolder
					}).done(function(err, img) {

						// link the image to the reference
						ref.Images.add(img.id);
						ref.save(function(err, ref) {
							if (err) console.log('Cannot associate Image with Reference')
							res.json(img); // send back clean data to Angular
						})

						if (err) return res.send(500); // error, send 500
					});
				});

			})
			// error handling
			sourceFolder.on('error', function(err) {
				console.log('File upload error', err);
				fs.unlink(req.files.file.path);
			})

		});

	},

	// v0.2
	remove: function(req, res) {

		var $img = q.defer()
			, $shoot = q.defer();

		Image.findOne({
			id: req.query.image
		}).done(function(err, image) {
			if (err || !image) return res.status('500').send('Cannot find image '+req.query.image+' : <'+err+'>');
			console.log('Image ', image)
			$img.resolve(image);
			Shoot.findOne({
				id: image.Shoot
			}).done(function(err, shoot) {
				if (err || !shoot) return res.status('500').send('Cannot find shoot '+image.Shoot+' : <'+err+'>');
				$shoot.resolve(shoot);
			})
		});

		q.all([$img.promise, $shoot.promise]).then(function(data) {
			$img = data[0];
			$shoot = data[1];

			if ($shoot.Admin !== req.user.email)
				return res.status('500').send('Not enough privileges');

			$img.destroy(function(err) {
				if (err) return res.status('500').send('Could not remove image.');
				res.json({ok: true});
			})

		});

	},

	// v0.2
	// Toggles completion of a job on the image
	job: function(req, res) {

		var $job = q.defer()
			, $img = q.defer()
			, $shoot = q.defer();

		Job.findOne({
			id: req.query.job
		}).done(function(err, job) {
			if (err) return res.status('500').send('Cannot find job '+req.query.job+' : <'+err+'>');
			$job.resolve(job);
		});

		Image.findOne({
			id: req.query.image
		}).done(function(err, img) {
			if (err) return res.status('500').send('Cannot find image '+req.query.image+' : <'+err+'>');
			$img.resolve(img);
		});

		q.all([$job.promise, $img.promise]).then(function(data) {
			var $job = data[0]
				, $img = data[1];

			Shoot.findOne({id:$job.Shoot}).exec(function(err, $shoot) {

				//console.log('JOB TOGGLE ', $job.user)

				if ($job.User !== req.user.email && $shoot.Admin !== req.user.email)
					return res.status('500').send('Not enough privileges to toggle '+$img.id);

				if ($img.jobsdone && ($img.jobsdone.indexOf($job.id) > -1)) {
					// le job existe, le killer
					$img.jobsdone.splice($img.jobsdone.indexOf($job.id), 1);
				} else {
					// le job n'existe pas, l'ajouter
					if (!$img.jobsdone) $img.jobsdone = [];
					$img.jobsdone.push($job.id);
				}
				$img.save(function(err, img) {
					res.json(img);
				});
			});

		});

	}

};