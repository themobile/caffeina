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

    .controller('about', ['$scope', 'userService', '$firebase', function ($scope, userService, $firebase) {

        var userEmail = userService.getUser().username;

        var ref = new Firebase('https://caffeina.firebaseio.com/calendars/' + userEmail.replace(/\./g, ''));

        $scope.messages = $firebase(ref);
        $scope.mesaj = '';
        $scope.nume = '';
        $scope.addMessage = function (e) {
            if (e.keyCode != 13) return;
            $scope.messages.$add({from: $scope.nume, body: $scope.mesaj});
            $scope.mesaj = "";
        };

        $scope.translateX = 1;


    }])


    .controller('sortable', ['$scope', '$ionicPopup', function ($scope, $ionicPopup) {
//        $scope.data = {
//            showDelete: false,
//            showReorder:false
//        };

        $scope.edit = function (item) {
            alert('Edit Item: ' + item.id);
        };
        $scope.share = function (item) {
            alert('Share Item: ' + item.id);
        };

        $scope.moveItem = function (item, fromIndex, toIndex) {
            $scope.items.splice(fromIndex, 1);
            $scope.items.splice(toIndex, 0, item);
        };

        $scope.onItemDelete = function (item) {
            $scope.items.splice($scope.items.indexOf(item), 1);
        };

        $scope.items = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 10 }
        ];

    }])

    .controller('home', ['$scope', 'CalendarEvents', '$firebase','firebaseRef','leads', function ($scope,CalendarEvents, $firebase,firebaseRef,leads) {
        $scope.events = [];
//        var events = [
//            {
//                start: new Date(),
//                title: 'caffeina0'
//            },
//            {
//                start: '2014/04/28',
//                title: 'caffeina2'
//            },
//            {
//                start: '2014/06/28',
//                title: 'caffeinaAfter'
//            },
//            {
//                start: '2014/08/15',
//                title: 'caffeina3'
//            },
//            {
//                start: new Date('2014/09/10'),
//                title: 'caffeina4'
//            },
//            {
//                start: new Date('2014/09/02'),
//                title: 'caffeina5'
//            }
//        ];


        var tst=firebaseRef('/users/Y2hpbmRlYS5kYW5pZWxAZ21haWwuY29t/leads/');
        var limi=tst.startAt(moment().valueOf("2014-05-01"));

        $firebase(limi).$bind($scope,"eventuri").then(function(){
            $scope.events= _.values($scope.eventuri);
            CalendarEvents.setEvents($scope.events);
        });

        $scope.addCalendarEvent = function () {
            var date = new Date();
            date.setDate($scope.events.length);
            $scope.events.push({
                start: date,
                title: 'Event #' + $scope.events.length
            });
            CalendarEvents.setEvents($scope.events);
        };


        $scope.$on('calendar:events', function (model, view) {
            console.log('setdate');
        });



        $scope.addLead=function() {

            var lead={
                "date":"2014-10-02",
                "title":"Lead de incarcat prin servicii",
                "contact":{"name":"Florian Cechi","phone":"7829387232","email":"asdada@gmail.com"}
            }

            leads.add(lead);


        }



    }])

    .controller('loginController', ['$scope', 'userService', '$cookieStore', '$location', '$ionicModal', function ($scope, userService, $cookieStore, $location, $ionicModal) {
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
            $cookieStore.put('caffeinaLoginType', user.provider);
            $scope.loginType = user.provider;
            $scope.firstTimeLogin = false;
//            $cookieStore.put('caffeinaUser', user);
//            $cookieStore.put('caffeinaLoginAuto', $scope.isAuto);
        });


        $scope.$on('$firebaseSimpleLogin:logout', function (event) {
            $scope.auth = {};
            $scope.loginType = '';

        });


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


    }]);


//    .controller('DemoCtrl', function ($scope, $famous) {
//        var GenericSync = $famous['famous/inputs/GenericSync'];
//        var Transitionable = $famous['famous/transitions/Transitionable']
//        var EventHandler = $famous['famous/core/EventHandler']
//
//        var colors = [
//            '#869B40',
//            '#C2B02E',
//            '#629286',
//            '#B58963',
//            '#9E9B8C'
//        ];
//
//        var strings = [
//            'famo.us',
//            'angular',
//            'javascript',
//            'web',
//            'wow',
//            'such',
//            'great'
//        ];
//
//        var ELEMENTS = 150;
//        var START_HUE = 320;
//        var HUE_RANGE = 100;
//        var SATURATION = 50;
//        var LIGHTNESS = 50;
//        var getHSL = function(index){
//            var hue = (START_HUE + (HUE_RANGE * (index / ELEMENTS)));
//            return "hsl(" +
//                hue + "," +
//                SATURATION + "%,"+
//                LIGHTNESS + "%)";
//        }
//
//        $scope.surfs = _.map(_.range(ELEMENTS), function(i){
//            return {
//                content: _.sample(strings),
//                bgColor: getHSL(i)
//            }
//        });
//
//        setInterval(function(){
//            for(var i = 0; i < ELEMENTS; i++){
//                $scope.surfs[i].content = _.sample(strings);
//            }
//            if(!$scope.$$phase)
//                $scope.$apply();
//        }, 500);
//
//        $scope.enginePipe = new EventHandler();
//    });
