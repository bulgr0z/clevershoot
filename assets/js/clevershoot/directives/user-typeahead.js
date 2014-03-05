clevershoot.directive('userTypeahead', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			$(element).typeahead({}, {
				name: 'users',
				displayKey: 'email',
				source: function(query, process) {
					scope.findUser(query).$promise.then(function(data) {
						process(data);
					});
				},
				templates: {
					suggestion: function(value) {
						return '<strong>'+value.username+'</strong> &lt;'+value.email+'&gt;';
					}
				}
			}).on('typeahead:selected', function(e, user) {
					console.log('SELECTED', user.id, $(this).val())
					scope.job.user = $(this).val()
			});

		}
	};
});