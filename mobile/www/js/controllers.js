angular.module('caffeina.controllers', ['ngCookies'])


// A simple controller that shows a tapped item's data
    .controller('MenuController', ['$scope', '$ionicSideMenuDelegate', 'userService', function ($scope, $ionicSideMenuDelegate, userService) {
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.$on('$firebaseSimpleLogin:login', function (event, user) {
            $scope.user = userService.getUser();
        });


        $scope.$on('$firebaseSimpleLogin:logout', function (event) {

        });

        $scope.logout = function () {
            userService.logout();
            $scope.user = {};
        }
    }])

    .controller('about', ['$scope', 'dataService', 'userService','$firebase', function ($scope, dataService,userService,$firebase) {

        var ref=new Firebase('https://caffeina.firebaseio.com/calendars')

        $scope.messages = $firebase(ref);
        $scope.mesaj = '';
        $scope.nume = '';
        $scope.addMessage = function (e) {
            if (e.keyCode != 13) return;
            $scope.messages.$add({from: $scope.nume, body: $scope.mesaj});
            $scope.mesaj = "";
        };


    }])

    .controller('home', ['$scope', 'CalendarEvents', function ($scope, CalendarEvents) {
        var events = [
            {
                start: new Date(),
                title: 'caffeina1'
            },
            {
                start: '2014/04/28',
                title: 'caffeina1'
            },
            {
                start: '2014/05/15',
                title: 'caffeina1'
            },
            {
                start: new Date('2014/04/10'),
                title: 'caffeina1'
            },
            {
                start: new Date('2014/03/02'),
                title: 'caffeina1'
            }
        ];

        CalendarEvents.setEvents(events);

        $scope.addCalendarEvent = function () {
            var date = new Date();
            date.setDate(events.length);
            events.push({
                start: date,
                title: 'Event #' + events.length
            });
            CalendarEvents.setEvents(events);
        };



            $scope.$on('setDate', function(model,view){
                console.log('setdate');
            })


    }])

    .controller('loginController', ['$scope', 'dataService', 'userService', '$cookieStore', '$location', '$ionicModal', function ($scope, dataService, userService, $cookieStore, $location, $ionicModal) {
        $scope.login = function (type) {
            $scope.auth = userService.login(type, true);
        };


        $scope.user = {};
        $scope.loginType = $cookieStore.get('caffeinaLoginType') || '';
        $scope.isAuto = $cookieStore.get('caffeinaLoginAuto');

        //check cookies for first timers
        (!$scope.loginType && !$scope.isAuto) ? $scope.firstTimeLogin = true : $scope.firstTimeLogin = false;


        //isAuto change
//        $scope.isCheckedChange = function() {
//            $cookieStore.put('caffeinaLoginAuto',!$scope.isAuto);
//        }


        $scope.$on('$firebaseSimpleLogin:login', function (event, user) {
            console.log(user);
            $cookieStore.put('caffeinaLoginType', user.provider);
            $scope.loginType = user.provider;
            $scope.firstTimeLogin = false;
//            $cookieStore.put('caffeinaUser', user);
//            $cookieStore.put('caffeinaLoginAuto', $scope.isAuto);
        })


        $scope.$on('$firebaseSimpleLogin:logout', function (event) {
            $scope.auth = {};
            $scope.loginType = '';

        })


        //ionic modal
        $ionicModal.fromTemplateUrl('templates/signup_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
                $scope.modal = modal;
            });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });


    }])
