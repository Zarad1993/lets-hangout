(function () {
	'use strict';

	angular
		.module('lets-hangout')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$state', '$scope', '$ionicPopup', '$timeout', 'store', 'Users', 'Group'];

	function HomeController($state, $scope, $ionicPopup, $timeout, store, Users, Group) {

		// Getting Groups and displaying them
		$scope.group = {};
		
		$scope.data = [];

		$scope.user = {};

		$scope.showMsg = false;

		setInterval( function() {
			if (store.get('Initialized') && !store.get('userProfile')) {
				$state.go('login');
			}
		}, 1000);

		$scope.$on('$ionicView.enter', function (viewInfo, state) {
			if (store.get('userProfile')) {
				$scope.user = store.get('userProfile');
				$scope.data = {};
				$timeout( function() { init(); }, 500);
			}
		});

		function login() {
			$state.go('login');
		}

		// groups Information
		var init = function () {
			if (store.get('userProfile')) {
				$scope.showMsg = false;
				$scope.data.groups = [];
				Group.allGroupsByAdmin(store.get('userProfile').userId)
				.then(function (groups) {
					if (groups.length === 0) {
						$scope.showMsg = true;
					}
					$scope.data.groups = groups;
				})
				.catch(function (err) {
					console.log(err);
				});
			}
		};

		// create new Group
		$scope.createGroup = function () {
			if (store.get('userProfile')) {
				// An elaborate, custom popup
				var myPopup = $ionicPopup.show({
					template: '<input type="text" ng-model="group.groupName">',
					title: 'Enter Group Name',
					scope: $scope,
					buttons: [
						{
							text: 'Cancel',
							onTap: function(e) {
								$scope.group.groupName = '';
							}
						},
						{
							text: 'Create',
							onTap: function(e) {
								return $scope.group.groupName;
							}
						}
					]
				});

				myPopup.then(function(res) {
					if (res) {
						Group.newGroup(res, store.get('userProfile').userId)
						.then(function (data) {
							$scope.data.groups = [];
							$timeout( function() { init(); }, 1500);
						})
						.catch(function (err) {
							console.log(err);
						});
					}
				});
			}
		};
	}
} ());