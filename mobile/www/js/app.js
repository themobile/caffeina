// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('caffeina',
    [
        'ionic',
        'ion-google-place',
        'google-maps',
        'datePicker',

        'caffeina.services',
        'caffeina.controllers',
        'caffeina.filters',
        'angularLocalStorage',
        'ngCookies',
        'firebase',
        'calevents',
        'ngProgressLite',
        'caffeina.directives'

//        'ngAutocomplete'
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
            })

            .state('map', {
                url: '/map/:location',
                templateUrl: 'templates/map.html',
                controller: 'map'
            })

            .state('inspiration', {
                url: '/inspiration',
                templateUrl: 'templates/inspiration.html'
            })

            .state('inventory', {
                url: '/inventory',
                templateUrl: 'templates/inventory.html'
            })

            .state('tests', {
                url: '/tests',
                templateUrl: 'templates/tests.html'
            });

        // if none of the above states are matched, use this as the fallback
//        $urlRouterProvider.otherwise('login');

        //pentru a seta ca safe url-urile
//        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);


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
            function (event, toState, toParams, fromState, toStateParams,fromParams) {
                //store previous state
                $rootScope.previousState = fromState;


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
                template: 'I\'m patient like a bee!'
            });
            userService.login(provider, {
                access_token: token,
                rememberMe: rememberMe
            }).then(function () {
                $ionicLoading.hide();
                $state.go('home');
            }, function (error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    template: error,
                    title: 'caffeina is in error',
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