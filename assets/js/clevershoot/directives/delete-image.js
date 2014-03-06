clevershoot.directive('deleteImage', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			$(element).on('click', function() {
				scope.$parent.removeImage(scope.image)
				//console.log(scope)
			});
		}
	};
});