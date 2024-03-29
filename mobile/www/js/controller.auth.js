angular.module('caffeina.controllers')


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


        if ($scope.rememberMe && access_token) {

            $scope.attr = {
                rememberMe: $scope.rememberMe,
                access_token: access_token
            };
        } else {
            $scope.attr = {};
        }
        $scope.login = function (provider) {
            $ionicLoading.show({
                template: 'I\'m patient like a bee!'
            });
            userService.login(provider, $scope.attr).then(function () {
                $ionicLoading.hide();
                $state.go('home');
            }, function (error) {
                $scope.myPopupShow(error);
            });
        };

        $scope.myPopupShow = function (error) {
            $ionicPopup.alert({
                template: error,
                title: 'Error',
                scope: $scope,
                buttons: [
                    {text: 'Got it!'}
                ]
            });
        };


        $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
            storage.set('rememberMe', $scope.rememberMe);
            storage.set('caffeina_user', user);
            storage.set('provider', user.provider);
            $state.go('home');
        })
    }

    ]);