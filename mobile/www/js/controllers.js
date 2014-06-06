angular.module('caffeina.controllers', [])


// A simple controller that shows a tapped item's data
    .controller('MenuController',
        [
            '$rootScope'
            , '$scope'
            , '$ionicSideMenuDelegate'
            , 'userService'
            , 'storage'
            , '$state'
            , '$ionicActionSheet'
            , function ($rootScope, $scope, $ionicSideMenuDelegate, userService, storage, $state, $ionicActionSheet) {

//            $scope.isInAdd = true;

            $scope.toggleLeft = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.$on('$firebaseSimpleLogin:login', function (event, user) {
                $scope.user = userService.getUser();
            });


            $scope.$on('$firebaseSimpleLogin:logout', function (event) {
                $scope.user = {};
            });

            $scope.logout = function () {
                userService.logout();
                storage.set('rememberMe', null);
                storage.remove('caffeina_user');
                $state.go('login')
            }


            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    (toState.name == 'addlead') ? $scope.isInAdd = true : $scope.isInAdd = false;


                })


            $scope.add = function () {
                $ionicActionSheet.show({
                    buttons: [
                        {text: 'thing <strong>to do</strong>'},
                        {text: 'inquiry'},
                        {text: 'job'}
                    ],
                    titleText: 'what do you want to add?',
                    buttonClicked: function (index) {
                        if (index == 1) {
                            $state.go('addlead');
                            return true;
                        }
                    }
                })
            }
        }])

    .controller('about', ['$scope', '$ionicSideMenuDelegate', 'userService', '$firebase', function ($scope, $ionicSideMenuDelegate, userService, $firebase) {

        var userEmail = userService.getUser().username;
        var ref = new Firebase('https://caffeina.firebaseio.com/messages/' + userEmail.replace(/\./g, ''));
        $ionicSideMenuDelegate.$getByHandle('home_screen').canDragContent(true);

        $scope.messages = $firebase(ref);
        $scope.mesaj = '';
        $scope.nume = '';
        $scope.addMessage = function (e) {
            if (e.keyCode != 13) return;
            $scope.messages.$add({from: $scope.nume, body: $scope.mesaj});
            $scope.mesaj = "";
        };

    }])


    .controller('sortable', ['$scope', '$ionicSideMenuDelegate', function ($scope, $ionicSideMenuDelegate) {
//        $scope.data = {
//            showDelete: false,
//            showReorder:false
//        };
        $ionicSideMenuDelegate.$getByHandle('home_screen').canDragContent(true);

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
            { id: 1 },
            { id: 2 },
            { id: 3 }

        ];

    }])

    .controller('taskdetails', ['$http', '$scope', '$state', '$stateParams', '$firebase', 'firebaseRefUser', 'ngProgressLite', 'userService', function ($http, $scope, $state, $stateParams, $firebase, firebaseRefUser, ngProgressLite, userService) {
        $scope.taskId = $stateParams.taskId;
        $scope.taskdetails = '';
        $scope.loadData = function () {
            ngProgressLite.start();
            var leadsRef = firebaseRefUser('/leads/' + $scope.taskId);
            var kk = $firebase(leadsRef);
            kk.$on('loaded', function (data) {
                $scope.taskdetails = data;
                ngProgressLite.done();
            });
        };
        $scope.loadData();


        //google maps autocomplete
        $scope.googleResults = '';
        $scope.googleResultsOptions = {

        };
        $scope.googleResultsDetails = '';
        $scope.result='';


    }])


    .controller('isconnected', ['$scope', '$ionicBackdrop', function ($scope, $ionicBackdrop) {
        //variable to control overlay if not connected

        $scope.isConnected = true;
        $scope.$on('isConnected', function (event, value) {
            $scope.isConnected=value;
//            $scope.isConnected=false;

        });

    }])


    .controller('home',
        [
            '$rootScope'
            , '$scope'
            , 'CalendarEvents'
            , '$ionicSideMenuDelegate'
            , '$firebase'
            , 'userService'
            , 'firebaseRef'
            , 'firebaseRefUser'
            , 'ngProgressLite'
            , '$state'
            , '$timeout'
            , function ($rootScope, $scope, CalendarEvents, $ionicSideMenuDelegate, $firebase, userService, firebaseRef, firebaseRefUser, ngProgressLite, $state, $timeout) {


            // data for calendar
            $scope.events = [];

            $scope.datePickerControl = {};

            //drives the list with events for a selected day
            $scope.monthEvents = [];


            //signal that events were loaded from month change not from login event
            $scope.monthEventsLoaded = false;


            $scope.notfirsttime = false;

            //event broadcasted to datepicker directive to go today
            $scope.goToday = function () {

                //timeout to change month after refresh
                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 000).then(function () {
                        $scope.$broadcast('gotoday');
                    });

            };


            //goto task clicked in event list
            $scope.goto = function (key) {
                console.log(key);
                $state.transitionTo('task', {taskId: key});
            }


            //load monthly data based on date
            $scope.loadData = function (month) {
//


                ngProgressLite.start();

                var startAt = moment(month, 'MMMM').startOf('month').format('YYYY-MM-DD');
                var endAt = moment(month, 'MMMM').endOf('month').format('YYYY-MM-DD');
                var leadsRef = firebaseRefUser('/leads/').startAt(startAt).endAt(endAt);
                var kk = $firebase(leadsRef);
                kk.$on('loaded', function (data) {
                    var keys = _.keys(data);
                    var actualdata = _.values(data);
                    var intermed = _.map(actualdata, function (num, key) {
                        return num.keia = keys[key]
                    })
                    $scope.events = actualdata;
                    CalendarEvents.setEvents($scope.events);
                    ngProgressLite.done();

                    //timeout to avoid ugly events dom reposition --> class change in calendar to fade-in-not-out
                    $timeout(function () {
                        $scope.notfirsttime = true;
                    }, 100);
                });
            };


            // on firebase login
            $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
                if (!$scope.monthEventsLoaded) {
                    $scope.loadData(moment().format('MMMM'));
                }

            });

            // on firebase logout
            $rootScope.$on('$firebaseSimpleLogin:error', function (error) {
//            console.log('home controller login error');
//            console.log(error);
            });


            //change data on month change
            $scope.$on('calendar:changeMonth', function (event, date) {

                //empty list of events
                $scope.monthEvents = [];


                //load data from firebase for current month
                if (userService.getUser()) {
                    $scope.loadData(date);
                    $scope.monthEventsLoaded = true;
                }


            });


            //empty event list on view change event emitted from directive
            $scope.$on('viewchanged', function () {
                $scope.monthEvents = [];

            });


            //stop menu sliding on calendar swipe
            $ionicSideMenuDelegate.$getByHandle('home_screen').canDragContent(false);

            // calendar loaded data
            $scope.$on('calendar:events', function (model, view) {
                console.log('setdate');
            });

            // Click on event: search and display full event
            $scope.$on('calendar:clickevent', function (event, day) {
                // push in local events for the selected day
                $scope.monthEvents = [];
                $scope.monthEvents = (_.filter($scope.events, function (num) {
                    return num.date == day
                }));

            });

        }])



