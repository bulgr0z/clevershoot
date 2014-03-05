clevershoot.directive('jobConfigForm', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			$(element).find('select').on('change', function() {
				if ($(this).children('option:selected').val() == 'worker' )
					$(element).find('#work-name').removeClass('hidden');
			});

			// reset
			$(element).find('button').on('click', function() {
				$(element).find('select option').eq(0).prop('selected', true)
				$(element).find('#work-name').addClass('hidden');

				//$(element).find('#job-user').val('')
				//$(element).find('#job-name').val('')
			});

		}
	};
});