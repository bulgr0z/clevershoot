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
					if (scope.$parent.reference.Images && scope.$parent.reference.Images.length) {
						scope.$parent.reference.Images.unshift(img); // update scope
					} else {
						scope.$parent.reference.Images = [img]
					}
					scope.$apply();
					$(element).find('.dz-preview').remove();
				}
			});
		}
	};
});