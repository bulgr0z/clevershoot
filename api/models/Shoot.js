/**
 * Shoot.js
 *
 * Rassemble les paramètres du shooting
 * ex: Liste des jobs attendus sur chaque image, liste des users... (etc)
 *
 */

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
		Users: {
			collection: 'user',
			via: 'Shoots'
		},
		name: 'string', // shooting's name
		description: 'string' // small descriptive text

	}

};
