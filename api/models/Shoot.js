/**
 * Shoot.js
 *
 * Rassemble les paramètres du shooting
 * ex: Liste des jobs attendus sur chaque image, liste des users... (etc)
 *
 */

module.exports = {

	attributes: {
		Admin: {
			model: 'user',
			required: true
		},
		Jobs: {
			collection: 'job',
			via: 'Shoot'
		},
		References: {
			collection: 'reference',
			via: 'Shoot'
		},
		/*Users: {
			collection: 'user',
			via: 'Shoots',
			dominant: true
		},*/
		name: 'string',
		description: 'string'

	}

};
