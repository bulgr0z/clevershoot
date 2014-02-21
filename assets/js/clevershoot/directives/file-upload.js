clevershoot.directive('fileUpload', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			console.log('LINK ? ', scope, element);
			//$(element).children('form.dropzone')
			$(element).dropzone({
				url: "/reference/"+scope.$parent.reference.id+"/image/upload",
				success: function(dz, img) {
					scope.image = img; // update scope
					scope.$parent.reference.Images.unshift(img); // update scope
					scope.$apply();
					$(element).find('.dz-preview').remove();
				}
			});
		}
	};
});