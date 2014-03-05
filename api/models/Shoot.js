/**
 * Shoot.js
 *
 * Rassemble les paramètres du shooting
 * ex: Liste des jobs attendus sur chaque image, liste des users... (etc)
 *
 */

var q = require('q');

module.exports = {

	attributes: {
		// Privileged user for the shooting (can add/remove jobs, etc..)
		Admin: {
			model: 'user',
			required: true
		},
		// List of jobs to be completed for a shoot's Reference
		Jobs: {
			collection: 'job',
			via: 'Shoot'
		},
		// List of references (each may contain many images) for the shooting
		References: {
			collection: 'reference',
			via: 'Shoot'
		},
		// Users that can "observe" the shooting
		observers: {
			type: 'array'
		},
		// Invited users emails, will be searched on user creation
		invited: {
			type: 'array'
		},
		name: 'string', // shooting's name
		description: 'string' // small descriptive text

	},

	// Adds an array of <observers> to the shooting <shootid>, inviting those that do not have an account
	// @param shootid String
	// @param observers Array [<user@mail.tld>, <user@mail.tld>, ... ]
	_linkObservers: function(shootid, observers) {

		var observersToInvite = observers
			, $users = q.defer()
			, $shoot = q.defer();

		// get a list of users corresponding to <observers>. REGISTERED Users in <observers> will be removed from <observersToInvite>
		// left over emails in <observersToInvite> will be sent an invite to register an account
		User.find({'email': observers }).exec(function(err, users) {
			if (!err) $users.resolve(users);
		});
		// get our shooting
		Shoot.findOne({id: shootid}).exec(function(err, shoot) {
			if (!err) $shoot.resolve(shoot);
		});

		q.all([$users.promise, $shoot.promise]).then(function(data) {

			var $users = data[0]
				, $shoot = data[1];


			$users.forEach(function(user) {
				if (!$shoot.observers.length) $shoot.observers = [];
				observersToInvite.splice(observersToInvite.indexOf(user.email), 1); // exists, has to be removed from the invite list
				$shoot.observers.push(user.id) // link User/Shoot
				$shoot.save(function() {});
			});

			observersToInvite.forEach(function(observer) {
				User._inviteObserver(observer, $shoot);
			});


		})

	}

};
