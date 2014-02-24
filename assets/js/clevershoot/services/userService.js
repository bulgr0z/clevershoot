'use strict';

clevershootServices.factory('User', ['$resource',
	function($resource){

		return {

			find: function(params) {
				return $resource('/user/find', {}, {
					query: {method:'POST', params:params, isArray:true}
				});
			}

		}

	}]);