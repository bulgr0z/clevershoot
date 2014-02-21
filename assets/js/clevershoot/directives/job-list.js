clevershoot.directive('jobList', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			console.log('LINK JOBLIST ? ', scope)

			$(element).find('#add-job').on('click', function() {
				var jobName = $(element).find('#job-name').val();
				var hidden = $('<div class="job"><span>'+ jobName +'</span><input type="hidden" name="job" value="'+jobName+'" /></div>')
					.appendTo($(element).find('#job-list'))
					.on('click', function() {
						scope.removeJob(jobName);
						$(this).remove();
					});

				scope.addJob(jobName);
			});
		}
	};
});