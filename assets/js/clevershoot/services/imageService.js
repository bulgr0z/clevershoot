'use strict';

clevershootServices.factory('Image', ['$resource',
	function($resource){

		return {

			get: function() {
				return $resource('/image/list', {}, {
					query: {method:'GET', params:{}, isArray:true}
				})
			},

			add: function(params) {
				return $resource('/image/add', {}, {
					query: {method:'POST', params: params}
				})
			},

			toggleJob: function(params) {
				return $resource('/image/job', {}, {
					query: {method:'POST', params: params}
				})
			}

		}

	}]
);