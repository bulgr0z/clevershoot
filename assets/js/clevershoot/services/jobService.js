'use strict';

clevershootServices.factory('Job', ['$resource',
	function($resource){

		return {

			add: function(params) {
				return $resource('/job/add', {}, {
					query: {method:'POST', params: params}
				})
			},

			list: function(shoot_id) {
				return $resource('/job/list/'+shoot_id, {}, {
					query: {method:'POST', isArray:true}
				})
			},

			inviteusers: function(params) {
				return $resource('/job/inviteusers', {}, {
					query: {method:'POST', params: params}
				})
			},

			update: function(email, jobid) {
				return $resource('/job/update', {}, {
					query: {method:'POST', params: {email: email, job: jobid}}
				})
			},

			remove: function(jobid) {
				return $resource('/job/remove', {}, {
					query: {method:'POST', params: {job: jobid}}
				})
			}

		}

	}]);