'use strict';

clevershootControllers.controller('shootCtrl', ['Shoot','$routeParams','$scope','$location',
	function(Shoot, $routeParams, $scope, $location) {

		var shoot = null
			, shoots = null
			, self = this;
		// On demande un shoot en particulier
		if ($routeParams.shoot_id)
			shoot = $scope.shoot = Shoot.get({ id: $routeParams.shoot_id }).query();
		// Lister tous les shoots autorisés pour le user
		shoots = $scope.shoots = Shoot.list().query();

		// Tester si l'utilisateur est inscrit a des shoots
		$scope.hasShoots = function() {
			if (shoots && shoots.length) return true;
			return false;
		};
		// Le shoot demandé existe-t-il ?
		$scope.isShoot = function() {
			if (shoot) return true;
			return false;
		}
		$scope.hasConfig = function() {
			if (shoot && shoot.id && shoot.Jobs.length) return true;
			return false;
		}

		var addForm = {
			name: ""
		}
		var jobs = [];

		// TODO -- DEPRECATED ?
		$scope.add = function(form) {

			var addForm = $scope.shoot;
			addForm.jobs = jobs;

			Shoot.add().query(addForm, function(data) {
				console.log("DATA ? ", data);
				$scope.shoot = data
				$location.path('/'+ data.id + '/config');
				// todo associate jobs emails
			});
		}

		$scope.addJob = function(jobName) {
			jobs.push(jobName)
		}

		$scope.removeJob = function(jobName) {
			jobs.splice(jobs.indexOf(jobName), 1)
		}

	}
]);