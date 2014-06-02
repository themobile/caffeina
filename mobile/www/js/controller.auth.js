angular.module('caffeina.controller.auth', [])


    .controller('loginController', ['$rootScope', '$scope', 'userService', '$firebaseSimpleLogin', 'storage', '$state', '$ionicLoading', function ($rootScope, $scope, userService, $firebaseSimpleLogin, storage, $state, $ionicLoading) {

        $ionicLoading.hide();

        var caffeina_user = storage.get('caffeina_user'),
            access_token;

        $scope.attr = {};
        if (caffeina_user) {
            access_token = caffeina_user.accessToken;
        }
        $scope.provider = storage.get('provider');
        $scope.rememberMe = storage.get('rememberMe');


        if ($scope.rememberMe & access_token) {

            $scope.attr = {
                rememberMe: $scope.rememberMe,
                access_token: access_token
            };
        } else {
            $scope.attr = {};
        }
        $scope.login = function (provider) {
            userService.login(provider, $scope.attr);
        }


        //TODO in settings to delete default provider

        $rootScope.$on('$firebaseSimpleLogin:login', function (user) {
            var user = userService.getUser();

            storage.set('rememberMe', $scope.rememberMe);
            storage.set('caffeina_user', user);
            storage.set('provider', user.provider);
            $state.go('home');
        })
    }

    ]);