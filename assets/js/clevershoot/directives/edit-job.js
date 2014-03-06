clevershoot.directive('editJob', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			$(element).on('click', function() {

				console.log(scope)

				$(this).tooltip('destroy');
				$(this).removeClass('btn-primary btn-default').addClass('btn-default');

				var container = $('<div class="job-edit"></div>');
				var input = $('<div class="col-lg-6">' +
												'<div class="input-group">' +
													'<input type="email" placeholder="Adresse email" value="'+scope.job.User+'" class="form-control">' +
													'<span class="input-group-btn">' +
													'</span>' +
												'</div>' +
											'</div>').appendTo(container);

				var btnAccept = $('<button class="btn btn-success" type="button">Valider</button>').appendTo(input.find('.input-group-btn'));
				var btnDiscard = $('<a class="btn btn-danger">Supprimer</a>').appendTo(container);

				btnAccept.on('click', function() {
					var email = input.find('input').val();
					scope.$parent.updateJob(email, scope.job.id);
					//console.log('update '+email+' on '+scope.job.name)
				});

				btnDiscard.on('click', function() {
					var email = input.find('input').val();
					scope.$parent.deleteJob(scope.job.id, function() {
						console.log('callback');
						container.remove();
					});
				});

				$(this).replaceWith(container);

			});
		}
	};
});