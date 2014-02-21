'use strict';

clevershootControllers.controller('imageCtrl', ['Image','$routeParams','$scope',
	function(Image, $routeParams, $scope) {

		// l'image est dans $parent.$parent ?? surement un pb de markup
		$scope.image = $scope.$parent.$parent.image; // wut ?

		$scope.isJobDone = function(jobName) {
			var img = $scope.image;
			if (img.jobsdone && img.jobsdone.indexOf(jobName) > -1) return true;
			return false;
		}

		$scope.toggleJob = function(jobName, image) {
			Image.toggleJob({job: jobName, id: image}).query({}, function(img) {
				$scope.image = img;
				//console.log("DONE IMG", data)
			});
		}


		this.list = function() {

		}

	}
]);