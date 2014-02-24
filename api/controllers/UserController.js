/**
 * UserController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');
var formidable = require('formidable');

module.exports = {

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// POST

	create: function(req, res) {

		var body = {
			username: req.body.username || req.body.password,
			password: req.body.password,
			email: req.body.email
		}

		User.create(body).done(function(err, user) {
			if (err) return console.log('cannot create motherfuckin user : ',err);

			// appelle le login de passport pour valider le nouveau user
			// le callback est obligatoire (bug ?)
			req.login(user, function(err) {
				res.redirect('/user/login');
			});

		});
	},

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// GET

	localAuth: function(req, res) {
		if (req.method === "GET") return res.redirect('/user/login');
		// placeholder route / passport local auth
	},

	register: function(req, res) {
		res.view('user/register', { layout: 'layout-noapp' });
	},

	login: function(req, res) {
		if (req.user) return res.redirect('/shoot/');
		res.view('user/login', { layout: 'layout-noapp' });
		//if (req.method === "GET") return res.view();
	},

	find: function(req, res) {
		if (req.query.email && req.query.email.length > 2) { // do not spam mongo
			User.find().where({'email': {startsWith: req.query.email}}).limit(5).exec(function(err, users) {
				if (err) req.status(500).send('Cannot search users : '+err);
				res.json(users);
			});
		} else {
			res.json([]);
		}
	}

};
