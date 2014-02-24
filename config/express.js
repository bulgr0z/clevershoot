/**
 * Configure advanced options for the Express server inside of Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.express = {


	// The middleware function used for parsing the HTTP request body.
	// (this most commonly comes up in the context of file uploads)
	//
	// Defaults to a slightly modified version of `express.bodyParser`, i.e.:
	// If the Connect `bodyParser` doesn't understand the HTTP body request 
	// data, Sails runs it again with an artificial header, forcing it to try
	// and parse the request body as JSON.  (this allows JSON to be used as your
	// request data without the need to specify a 'Content-type: application/json'
	// header)
	// 
	// If you want to change any of that, you can override the bodyParser with
	// your own custom middleware:
	// bodyParser: function customBodyParser (options) { ... },
	// 
	// Or you can always revert back to the vanilla parser built-in to Connect/Express:
	// bodyParser: require('express').bodyParser,
	// 
	// Or to disable the body parser completely:
	// bodyParser: false,
	// (useful for streaming file uploads-- to disk or S3 or wherever you like)
	//
	// WARNING
	// ======================================================================
	// Multipart bodyParser (i.e. express.multipart() ) will be removed
	// in Connect 3 / Express 4.
	// [Why?](https://github.com/senchalabs/connect/wiki/Connect-3.0)
	//
	// The multipart component of this parser will be replaced
	// in a subsequent version of Sails (after v0.10, probably v0.11) with:
	// [file-parser](https://github.com/mikermcneil/file-parser)
	// (or something comparable)
	// 
	// If you understand the risks of using the multipart bodyParser,
	// and would like to disable the warning log messages, uncomment:
	// silenceMultipartWarning: true,
	// ======================================================================


	// Cookie parser middleware to use
	//			(or false to disable)
	//
	// Defaults to `express.cookieParser`
	//
	// Example override:
	// cookieParser: (function customMethodOverride (req, res, next) {})(),

	// HTTP method override middleware
	//			(or false to disable)
	//
	// This option allows artificial query params to be passed to trick 
	// Sails into thinking a different HTTP verb was used.
	// Useful when supporting an API for user-agents which don't allow 
	// PUT or DELETE requests
	//
	// Defaults to `express.methodOverride`
	//
	// Example override:
	// methodOverride: (function customMethodOverride (req, res, next) {})()


	// Voir https://github.com/balderdashy/sails-docs/blob/master/reference/Configuration.md
	// Injecte un middleware pour express (ici, passport)
	customMiddleware: function(app) {

		var passport = require('passport')
			, LocalStrategy = require('passport-local').Strategy

		app.configure(function() {
			// Gérer le "remember me" du login. Les sessions ont un TTL de 30 jours par défaut.
			// Si le champ rememberme n'est pas présent, la session sera invalidée pour se quitter
			// a la fermeture du browser client
			app.use(function(req, res, next) {
				if (req.method === "POST" && req.url === '/user/auth/local') {
					if (req.body && !req.body.rememberme) {
						req.session.cookie.expires = false;
					}
				}
				next();
			});
			app.use(passport.initialize()); // init passport
			app.use(passport.session()); // init sessions
		});

		// Declarer une nouvelle strategy pour passport (Local)
		// passport attend dans le corps de la reponse les champs "email" / "password"
		// S'ils sont présents, déclenche le cb d'auth, sinon denied
		// La strategie sera utilisée par la policy <passportLocalAuth>
		//
		// La strategy et les session/cookies renvoient un objet user a la chaine express.
		// On peut alors acceder a req.user depuis tous les controllers
		passport.use(new LocalStrategy({
				usernameField: 'email',
				passwordField: 'password'
			},
			function(username, password, done) {
				// on les champs user/pass, on peut checker le user dans mongo
				User.findOne({
					email: username
				}).exec(function (err, user) {

					if (user) {
						User.compare(password, user.password, function(err, success) {

							if (err) return done(err, false, { message: 'An error occured.' });
							if (!success) return done(null, false, { message: 'Incorrect credentials.' });
							return done(null, user);

						});
					}
				});
			}
		));

		// ---
		// ICI, ON POURRAIT DECLARER D'AUTRES STRATEGIES, EX; TWITTER/FACEBOOK
		// ---

		// Mettre en place la serialization vers cookie/session
		passport.serializeUser(function(user, done) {
			return done(null, user.id);
		});

		// deserializer le user
		passport.deserializeUser(function(id, done) {
			User.findOne({
				id: id
			}).exec(function (err, user) {
				if (!user) return done(err, false);
				return done(err, user);
			});

		});

	}

};





/**
 * HTTP Flat-File Cache
 * 
 * These settings are for Express' static middleware- the part that serves
 * flat-files like images, css, client-side templates, favicons, etc.
 *
 * In Sails, this affects the files in your app's `assets` directory.
 * By default, Sails uses your project's Gruntfile to compile/copy those 
 * assets to `.tmp/public`, where they're accessible to Express.
 *
 * The HTTP static cache is only active in a 'production' environment, 
 * since that's the only time Express will cache flat-files.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.cache = {

	// The number of seconds to cache files being served from disk
	// (only works in production mode)
	maxAge: 2592000000
};
