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
					query: {method:'POST', params:{}}
				})
			},

			add: function(params) {
				return $resource('/shoot/add', {}, {
					query: {method:'POST', params: params}
				})
			},

			// Sauvegarde les roles des utilisateurs sur un shoot (job, observeur, etc...)
			addRoles: function(id, roles){
				return $resource('/shoot/updateroles/'+id, {}, {
					query: {method:'POST', params: roles, isArray: true}
				})
			}

		}

	}]);