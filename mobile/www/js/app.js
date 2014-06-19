// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('caffeina',
    [
        'ionic',
        'datePicker',
        'caffeina.services',
        'caffeina.controllers',
        'caffeina.filters',
        'angularLocalStorage',
        'ngCookies',
        'firebase',
        'calevents',
        'ngProgressLite',
        'ngAutocomplete'
    ])


    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html'
            })

            .state('chat', {
                url: '/chat',
                templateUrl: 'templates/chat.html'
            })

            .state('sortable', {
                url: '/sortable',
                templateUrl: 'templates/sortable.html'
            })

            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html'
            })

            .state('addjob', {
                url: '/addjob/:date',
                templateUrl: 'templates/addjob.html'
//                ,
//                controller:'addjob'

            })

            .state('tests', {
                url: '/tests',
                templateUrl: 'templates/tests.html'
            });

        // if none of the above states are matched, use this as the fallback
//        $urlRouterProvider.otherwise('login');

    })

    .run(function ($rootScope, $state, userService, storage, Firebase, $ionicLoading, $ionicPopup) {
        var rememberMe , provider, token, caffeina_user, presenceRef;

        rememberMe = storage.get('rememberMe');
        caffeina_user = storage.get('caffeina_user');


        presenceRef = new Firebase('https://caffeina.firebaseio.com/.info/connected');
        presenceRef.on('value', function (snap) {
            if (snap.val() === true) {
                $rootScope.$broadcast('isConnected', true);
            } else {
                $rootScope.$broadcast('isConnected', false);
            }
        });


        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                //store previous state
                $rootScope.$previousState = fromState;
            });

        if (caffeina_user) {
            provider = caffeina_user.provider;
            token = caffeina_user.accessToken;
        }


        if (rememberMe != true) {
            userService.logout();
            $state.go('login');
        } else {

            //if autologin
            $ionicLoading.show({
                template: 'Be patient grasshopper!'
            });
            userService.login(provider, {
                access_token: token,
                rememberMe: rememberMe
            }).then(function () {
                $ionicLoading.hide();
                $state.go('home');
            }, function (error) {
                $ionicPopup.alert({
                    template: error,
                    title: 'Error',
                    scope: $rootScope,
                    buttons: [
                        {text: 'Got it!'}
                    ]
                });
            });


        }
    })
;


// bootstrap the application
var body = document.getElementsByTagName('body')[0];
angular.element(document).ready(function () {
    angular.bootstrap(body, ['caffeina']);

});