'use strict';

clevershootControllers.controller('shootConfigCtrl', ['Shoot','Job','$routeParams','$scope','$location',
	function(Shoot, Job, $routeParams, $scope, $location) {

		// defaults
		$scope.form = {};
		$scope.form.role = 'observer';

		var shoot = null
			, jobs = null;

		if ($routeParams.shoot_id) {
			shoot = $scope.shoot = Shoot.get({ id: $routeParams.shoot_id }).query();
			jobs = $scope.jobs = Job.list($routeParams.shoot_id).query();
		}

		$scope.addRole = function() {

			Job.add().query({
				Shoot: $routeParams.shoot_id,
				User: $scope.form.email,
				role: $scope.form.role,
				name: $scope.form.name || 'Observateur'
			}, function(data) {
				$scope.jobs.push(data);
				$scope.configForm.$setPristine();
				$scope.form.email = null;
				$scope.form.name = null;
				$scope.form.role = "observer";
			});

		}

		$scope.filterRoles = function(role) {
			return function(item) {
				//console.log('filter role ', role, 'for ', item)
				return item.role !== 'admin';
			}
		}

		$scope.updateJob = function(email, jobid) {
			console.log('update ', email, ' for ', jobid)
		}

		$scope.deleteJob = function(jobid, deleted) {
			Job.remove(jobid).query(function(removed) {
				if (removed.ok) {
					$scope.jobs.forEach(function(job, i) {
						deleted(); // send callback to the directive
						if (job.id === jobid)
							$scope.jobs.splice(i, 1);
					})
				}
			});
		}

	}
]);