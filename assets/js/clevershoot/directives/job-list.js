clevershoot.directive('jobList', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			$(element).find('#add-job').on('click', function() {
				var jobName = $(element).find('#job-name').val();
				//var hidden = $('<div class="job"><span>'+ jobName +'</span><input type="hidden" name="job" value="'+jobName+'" /></div>')
				// construct btn

				//console.log('JOBNAME : ', jobName)

				$('<div class="job btn btn-primary btn-lg btn-block" data-toggle="tooltip" data-placement="left" title="Cliquez pour supprimer">'+ jobName +'</div>')
					.appendTo($(element).find('#job-list'))
					.on('click', function() {
						scope.removeJob(jobName);
						$(this).remove();
					})
					.tooltip({placement: 'left', container: "#job-list"});

				scope.addJob(jobName);
			});
		}
	};
});