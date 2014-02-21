/**
 * ReferenceController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	add: function(req, res) {

		Reference.create(req.body).done(function(err, ref) {
			if (err) return console.log('Cannot add Reference : ', err)
			res.json(ref);
		})
	},

	list: function(req, res) {
		console.log('list refs ?', req.query)
		Reference.find({ Shoot: req.query.shooting }).populate('Images').exec(function(err, refs) {
			if (err) return console.log('Cannot list Reference : ', err)
			console.log(refs);
			res.json(refs)
		})
	}

};
