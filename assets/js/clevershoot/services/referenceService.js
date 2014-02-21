'use strict';

clevershootServices.factory('Reference', ['$resource',
	function($resource){

		return {

			get: function(shooting) {
				console.log('shooting ? ', shooting)
				return $resource('/reference/list', {}, {
					query: {method:'POST', params: shooting, isArray:true}
				})
			},

			add: function(params) {
				return $resource('/reference/add', {}, {
					query: {method:'POST', params: params}
				})
			}

		}

	}]);