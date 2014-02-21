/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 * 
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.) 
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg` 
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or 
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  // 
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)

	'post /user/auth/local': {
		controller: 'User',
		action: 'localAuth'
	},


	// REDIRECTIONS POUR LE MODE HTML5 DE ANGULAR (NO SEO)

	/**
	 * -- -- ANGULAR ROUTES
	 */
	'get /shoot/:id': {
		controller: 'Shoot',
		action: 'angularRedirect'
	},

	'get /shoot/:id/config': {
		controller: 'Shoot',
		action: 'angularRedirect'
	},

	'/shoot/job/:id': {
		controller: 'Shoot',
		action: 'angularRedirect'
	},

	'get /shoot/reference/add': {
		controller: 'Shoot',
		action: 'angularRedirect'
	},

	/**
	 * -- -- REST ROUTES
	 */
	'post /reference/:reference/image/upload': {
		controller: 'Image',
		action: 'upload'
	},

	'post /shoot/reference/add': {
		controller: 'Reference',
		action: 'add'
	},

	'post /reference/list': {
		controller: 'Reference',
		action: 'list'
	},

	'post /shoot/add': {
		controller: 'Shoot',
		action: 'add'
	},

	'post /shoot/list': {
		controller: 'Shoot',
		action: 'list'
	},

	'post /job/inviteusers': {
		controller: 'Job',
		action: 'inviteusers'
	},

	'/shoot/get/:id': {
		controller: 'Shoot',
		action: 'get'
	}

  // Custom routes here...


  // If a request to a URL doesn't match any of the custom routes above, it is matched 
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

};
