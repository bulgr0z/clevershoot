clevershoot.directive('tooltip', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			$(element).tooltip({
				placement: 'left',
				container: '#job-list'
			})
		}
	};
});