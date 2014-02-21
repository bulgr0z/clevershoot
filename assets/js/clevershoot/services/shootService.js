'use strict';

clevershootServices.factory('Shoot', ['$resource',
	function($resource){

		return {

			get: function(params) {

				return $resource('/shoot/get/'+params.id, {}, {
					query: {method:'GET', params:{}, isArray: false}
				})
			},

			list: function() {
				return $resource('/shoot/list/', {}, {
					query: {method:'POST', params:{}, isArray: true}
				})
			},

			add: function(params) {
				return $resource('/shoot/add', {}, {
					query: {method:'POST', params: params}
				})
			}

		}

	}]);