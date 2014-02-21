var path = require('path')
	, fs = require('fs');

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

		fs.mkdir(uploadFolder, 0755, function() {
			// copy the file
			var sourceFolder = fs.createReadStream(req.files.file.path);
			var destFolder = fs.createWriteStream(uploadFolder +'/'+req.files.file.originalFilename);
			var publicFolder = '/public/uploads/'+ req.params.reference +'/'+req.files.file.originalFilename;

			sourceFolder.pipe(destFolder)
			sourceFolder.on('end', function() {
				// clean temp data
				fs.unlink(req.files.file.path);
				// Get a promise for the corresponding Reference
				var myRef = Reference.findOne({
					id: req.params.reference
				}).populate('Images');

				// create a new Image model
				Image.create({
					Reference: req.params.reference,
					User: req.user.id,
					url: publicFolder
				}).done(function(err, img) {

					// link the image to the reference
					myRef.done(function(err, ref) {
						ref.Images.add(img.id);
						ref.save(function(err, ref) {
							if (err) console.log('Cannot associate Image with Reference')
							res.json(img); // send back clean data to Angular
						})
					});

					if (err) return res.send(500); // error, send 500
				});

			})
			// error handling
			sourceFolder.on('error', function(err) {
				console.log('File upload error', err);
				fs.unlink(req.files.file.path);
			})

		});

	},

	// toggle un job sur l'image
	job: function(req, res) {
		Image.findOne({
			id: req.query.id
		}).done(function(err, img) {
			if (err) return console.log('Cannot apply job to img : ', err)
			if (img.jobsdone && (img.jobsdone.indexOf(req.query.job) > -1)) {
				// le job existe, le killer
				img.jobsdone.splice(img.jobsdone.indexOf(req.query.job), 1);
			} else {
				// le job n'existe pas, l'ajouter
				if (!img.jobsdone) img.jobsdone = [];
				img.jobsdone.push(req.query.job);
			}
			img.save(function(err, img) {
				res.json(img);
			})
		});
	}

};