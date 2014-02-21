'use strict';

clevershootControllers.controller('shootConfigCtrl', ['Shoot','Job','$routeParams','$scope','$location',
	function(Shoot, Job, $routeParams, $scope, $location) {

		var self = this;

		var shoot = null;
		if ($routeParams.shoot_id)
			shoot = $scope.shoot = Shoot.get({ id: $routeParams.shoot_id }).query(function(err, data) {
				console.log('got ?', err, data)
			});

		$scope.saveConfig = function() {

			Job.inviteusers().query(shoot.Jobs, function(data) {
				console.log('push data', data, $scope)
				/*$scope.shoot = data
				$location.path('/'+ data.id + '/config');*/
				// todo associate jobs emails
			});

		}

		$scope.hasConfig = function() {


			console.log('has config ?', shoot, $routeParams)
			console.log('has config CONFIG CONRTOLLER')

			if (shoot && shoot.id && shoot.Jobs.length) return true;
			return false;

		}
	}
]);