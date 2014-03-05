'use strict';

clevershootControllers.controller('jobCtrl', ['Job', 'Shoot', 'User', '$routeParams','$scope','$location',
	function(Job, Shoot, User, $routeParams, $scope, $location) {

		var shoot = null
			, jobs = null
			, self = this;
		$scope.observers = []; // Users "observing" the shooting

		// On demande un shoot en particulier
		if ($routeParams.shoot_id) {
			shoot = $scope.shoot = Shoot.get({ id: $routeParams.shoot_id }).query(function(data) {
				console.log(data)
			});
			//jobs = $scope.shoot.Jobs;
		}

		$scope.saveRoles = function() {

			//$scope.$apply();

			console.log('save jobs !', shoot.Jobs, $scope.observers)
			var roles = []
			// Roles are built following :
			// [ {<user.email> : <job.id>}, // has a job on the shooting
			//   {<user.email> : null } ] // is an observer for the shooting
			shoot.Jobs.forEach(function($job) {
				var hash = {};
						hash[$job.user] = $job.id
				roles.push(hash);
			});
			$scope.observers.forEach(function(observer) {
				var hash = {};
						hash[observer] = null;
				roles.push(hash);
			})

			// push to the server
			Shoot.addRoles(shoot.id, roles).query(function(data) {
				console.log('Roles updated !')
			})

		}

		$scope.findUser = function(query) {
			return User.find({email: query}).query();
		};

		$scope.addObserver = function() {
			console.log('add observer ')
		};

		// Tester si l'utilisateur est inscrit a des shoots
		$scope.hasShoot = function() {
			if (shoot) return true;
			return false;
		};


	}
]);