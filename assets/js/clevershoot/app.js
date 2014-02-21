'use strict';

var clevershootControllers = angular.module('clevershootControllers', [])
var clevershootServices = angular.module('clevershootServices', ['ngResource']);

//var clevershootProviders = angular.module('clevershootProviders', ['ngResource']);

var clevershoot = angular.module('clevershoot', [
	'ngRoute',
	'clevershootControllers',
	/*'clevershootProviders'*/
	'clevershootServices'
]);

clevershoot.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);

		$routeProvider.
			when('/', {
				controller: 'homeCtrl',
				templateUrl: '/templates/home/index.html'
			}).
			when('/add', {
				controller: 'shootCtrl',
				templateUrl: '/templates/shoot/add.html'
			}).
			when('/:shoot_id', {
				controller: 'shootCtrl',
				templateUrl: '/templates/shoot/index.html'
			}).
			when('/:shoot_id/config', {
				controller: 'shootConfigCtrl',
				templateUrl: '/templates/shoot/add.html'
			}).
			when('/reference/add', {
				controller: 'referenceCtrl',
				templateUrl: '/templates/reference/add.html'
			}).
			when('/reference/:id', {
				controller: 'referenceCtrl',
				templateUrl: '/templates/job/index.html'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);