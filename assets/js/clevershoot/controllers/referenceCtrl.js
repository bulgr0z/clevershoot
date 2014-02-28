'use strict';

clevershootControllers.controller('referenceCtrl', ['Reference','Shoot', 'Job', '$routeParams','$scope','$location',
	function(Reference, Shoot, Job, $routeParams, $scope, $location) {

		var self = this;
		var references = $scope.references = Reference.get({ shooting: $routeParams.shoot_id}).query();
		var shoot = $scope.shoot = Shoot.get({ id: $routeParams.shoot_id }).query();
		var userjobs = $scope.userjobs = Job.list($routeParams.shoot_id).query();

		// les data du controller image proviennent de là pour
		// etre partagées entre X instances d'un imageCtrl
		$scope.images = {};

		// default form data
		var addForm = {
			reference: "0"
		}

		$scope.add = function() {

			addForm = $scope.form;
			addForm.Shoot = $routeParams.shoot_id;

			Reference.add().query($scope.form, function(data) {
				$scope.references.unshift(data);
			});

		}

		$scope.isCompleted = function(reference) {

			if (reference.Images.length) {

				var isRefComplete = true; // did i complete all of my jobs for all of the images

				reference.Images.forEach(function(image) {
					if (!userjobs.length) return;
					userjobs.forEach(function(job) {
						if (image.jobsdone && image.jobsdone.indexOf(job.name) < 0) isRefComplete = false;
					});
				});

				return isRefComplete ? "panel-success closed" : "panel-default";

			}
		}

		this.list = function() {

		}

	}
]);