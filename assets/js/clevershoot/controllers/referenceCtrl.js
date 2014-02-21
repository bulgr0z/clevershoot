'use strict';

clevershootControllers.controller('referenceCtrl', ['Reference','Shoot','$routeParams','$scope','$location',
	function(Reference, Shoot, $routeParams, $scope, $location) {

		var self = this;
		var references = $scope.references = Reference.get({ shooting: $routeParams.shoot_id}).query();
		var shoot = $scope.shoot = Shoot.get({ id: $routeParams.shoot_id }).query();

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

		this.list = function() {

			Reference.get().query({}, function() {

			});

		}

	}
]);