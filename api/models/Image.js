/**
 * Image.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		Reference: {
			model: 'Reference'
		},
		User: {
			model: 'User'
		},
		jobsdone: { // Les ids des jobs sont ajoutés dans l'array quand ils sont effectués
			type: 'array'
		},

		/*Jobs: {  // To kill ?
			collection: 'Job',
			via: 'Image'
		},*/

		url: 'string'

	}

};
