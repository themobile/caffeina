// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('caffeina', ['ionic', 'caffeina.services', 'caffeina.config','caffeina.service.firebase','caffeina.controllers','firebase','ngCookies','datePicker','calevents', 'filters'])


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
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('home');

    })

    .run(function ($rootScope, $cookieStore, $location,userService) {

        var loginType = $cookieStore.get('caffeinaLoginType');
        var loginAuto = $cookieStore.get('caffeinaLoginAuto');
        var auth={};

        $location.path('/home');


//      TODO loginauto
//      if (!loginType) {
//            $location.path('/login');
//        } else {
//
//            if (loginAuto) {
//               auth = userService.login(loginType, true);
//
//                // TODO redirect to home
//                $location.path('/chat');
//            } else {
//                $location.path('/login');
//            }
//        }
    });

// bootstrap the application
var body = document.getElementsByTagName('body')[0];
angular.element(document).ready(function () {
    angular.bootstrap(body, ['caffeina']);

})