'use strict';

clevershootControllers.controller('imageCtrl', ['Image','$routeParams','$scope',
	function(Image, $routeParams, $scope) {

		// l'image est dans $parent.$parent ?? surement un pb de markup
		$scope.image = $scope.$parent.$parent.image; // wut ?

		$scope.isJobDone = function(jobid) {

			var img = $scope.image;
			if (img.jobsdone && img.jobsdone.indexOf(jobid) > -1) return true;
			return false;
		}

		$scope.toggleJob = function(job, image) {

			Image.toggleJob({job: job, image: image}).query({}, function(img) {
				$scope.image = img;
			});
		}

		$scope.filterByRole = function(jobName) {
			return function(item) {
				return item.role === jobName
			}
		}

	}
]);