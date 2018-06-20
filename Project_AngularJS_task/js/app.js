	// create the module and name it app
	var app = angular.module('app', ['ngRoute']);

	// configure our routes
	app.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			.when('/edit/:userId', {
				templateUrl : 'pages/editUser.html',
				controller  : 'editUserController'
			});
	});

	app.controller('mainController', function($scope, $location, userService) {
        if (!$scope.users) {
            $scope.users = [];
            userService.getAllUsers().then(function (response) {
                $scope.users = response.data.users;
            });
        }

        $scope.editUserBtn = function(user){
            $location.path( '/edit/' + user.id );
		};

        $scope.deleteUser = function (user) {
            userService.deleteUser(user, $scope.users);
        }
	});

	app.controller('editUserController', function($scope, $routeParams, userService) {
        var userId = $routeParams.userId;

		$scope.user = null;
		userService.getAllUsers().then(function(response) {
            response.data.users.forEach(currentUser => {
                if(currentUser.id == userId){
                    $scope.user = currentUser;
                }
            })
        });

        $scope.editUser = function (user) {
            userService.editUser($scope.user);

            for(var i=0; i<$scope.users.length; i++){
                if($scope.users[i].id == user.id){
                    $scope.users[i] = user;
                }
            }
        }
	});


    app.service('userService', function ($http, $location) {
        getAllUsers = function(){
            var usersUrl = "users.json";
            return $http.get(usersUrl);
        };

        getUser = function(userId){
            // var req = {
            //     method: 'GET',
            //     url: 'user',
            //     params: {
            //         userId: userId
            //     }
            // };
            //
            // return $http(req);
        };

        editUser = function(user){
            var req = {
                method: 'PUT',
                url: 'edit',
                data: user
            };

            $location.path('/');

            $http(req)
                .then(function (response) {

                })
        };

        deleteUser = function (user, allUsers) {
            var req = {
                method: 'DELETE',
                url: 'delete',
                params: {
                    userId: user.id
                }
            };

            var index = allUsers.indexOf(user);
            if (index > -1) {
                allUsers.splice(index, 1);
            }

            $http(req)
                .then(function (response) {

                })
        };

        return {
            getAllUsers: getAllUsers,
            getUser: getUser,
            editUser: editUser,
            deleteUser: deleteUser
        }
    })