// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('caffeina', ['ionic', 'caffeina.config', 'caffeina.services', 'caffeina.service.auth', 'ngCookies', 'angularLocalStorage', 'caffeina.service.firebase', 'caffeina.controllers', 'caffeina.controller.auth','caffeina.controller.tests', 'caffeina.filters', 'firebase', 'datePicker', 'calevents'])


    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
//    .state('tab', {
//      url: "/tab",
//      abstract: true,
//      templateUrl: "templates/tabs.html"
//    })


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

            .state('tests', {
                url: '/tests',
                templateUrl: 'templates/tests.html'
            });

        // if none of the above states are matched, use this as the fallback
//        $urlRouterProvider.otherwise('login');

    })

    .run(function ($rootScope, $state, userService, storage,$ionicLoading) {



//        $ionicLoading.show({
//            template:'Loading app data...'
//        });

        var rememberMe , provider, token, caffeina_user;

        rememberMe = storage.get('rememberMe');
        caffeina_user = storage.get('caffeina_user');

        if (caffeina_user) {
            provider = caffeina_user.provider;
            token = caffeina_user.accessToken;
        }

        if (rememberMe != true) {
            userService.logout();
            $state.go('login');
        } else {
            userService.login(provider, {
                access_token: token,
                rememberMe: rememberMe
            });
            $state.go('home');
        }
    })
;


// bootstrap the application
var body = document.getElementsByTagName('body')[0];
angular.element(document).ready(function () {
    angular.bootstrap(body, ['caffeina']);

})