clevershoot.directive('addObserver', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			$(element).on('click', function() {
				var list = $(this).siblings('.well#observer-list');
				list.css('display', 'block');

				list.find('#add-observer').on('click', function() {

					var val = list.find('#observer-email').val();
					scope.observers.push(val);

					$('<div class="btn btn-primary btn-lg btn-block" data-toggle="tooltip" data-placement="left" title="Cliquez pour supprimer">'+val+'</div>')
						.appendTo(list)
						.on('click', function() {
							var me = val;
							scope.observers.splice(scope.observers.indexOf(me), 1);
							$(this).remove();
						})
						.tooltip({placement: 'left'});
				});

			});
		}
	};
});