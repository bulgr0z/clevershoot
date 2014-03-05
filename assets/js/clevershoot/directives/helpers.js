clevershoot.directive('toggleOpen', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			$(element).on('click', function() {
				if (!$(this).hasClass('panel-success')) return;

				if ($(this).hasClass('open')) {
					$(this).removeClass('open')
				} else {
					$(this).addClass('open')
				}
			})

		}
	};
});