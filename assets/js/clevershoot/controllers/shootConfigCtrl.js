'use strict';

clevershootControllers.controller('shootConfigCtrl', ['Shoot','Job','$routeParams','$scope','$location',
	function(Shoot, Job, $routeParams, $scope, $location) {

		var self = this;

		var shoot = null;
		if ($routeParams.shoot_id)
			shoot = $scope.shoot = Shoot.get({ id: $routeParams.shoot_id }).query();


	}
]);