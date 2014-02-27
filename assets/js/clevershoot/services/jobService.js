'use strict';

clevershootServices.factory('Job', ['$resource',
	function($resource){

		return {

			get: function() {
				return $resource('/job/list', {}, {
					query: {method:'GET', params:{}, isArray:true}
				})
			},

			add: function(params) {
				return $resource('/job/add', {}, {
					query: {method:'POST', params: params}
				})
			},

			list: function(params) {
				return $resource('/job/list/'+params, {}, {
					query: {method:'POST', isArray:true}
				})
			},

			inviteusers: function(params) {
				return $resource('/job/inviteusers', {}, {
					query: {method:'POST', params: params}
				})
			}

		}

	}]);