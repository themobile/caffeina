angular.module('caffeina.controller.home', [])

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
            , '$ionicSlideBoxDelegate'
            , function ($rootScope, $scope, CalendarEvents, $ionicSideMenuDelegate, $firebase, userService, firebaseRef, firebaseRefUser, ngProgressLite, $state, $timeout,$ionicSlideBoxDelegate) {


            // data for calendar
            $scope.events = [];

            $scope.datePickerControl = {};

            //drives the view current event
            $scope.selectedEvent = {};



            //event broadcasted to datepicker directive to go today
            $scope.goToday = function () {

                //timeout to change month after refresh
                $timeout(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }, 000).then(function () {
                        $scope.$broadcast('gotoday');
                    });

            };


            //slide to event description clicked in event list
            $scope.goto = function (key) {
                console.log(key);
                ngProgressLite.start();
                var leadsRef = firebaseRefUser('/leads/' + key);
                var kk = $firebase(leadsRef);
                kk.$on('loaded', function (data) {
                    $scope.selectedEvent = data;
                    ngProgressLite.done();
                    $ionicSlideBoxDelegate.$getByHandle('calendar_slider').next();
                });
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


//            //stop menu sliding on calendar swipe
//            $ionicSideMenuDelegate.$getByHandle('home_screen').canDragContent(false);

            // calendar loaded data
            $scope.$on('calendar:events', function (model, view) {
                console.log('setdate');
            });

            // Click on event: search and display full event
            $scope.$on('calendar:clickevent', function (event, day) {
                // push in local events for the selected day
                $ionicSlideBoxDelegate.$getByHandle('calendar_slider').next();

                //mark events for the current selected day with property isCurrent
                _.map($scope.events, function (num) {
                     if (num.date == day) {
                         return num.isCurrent=true;
                    } else {
                         return num.isCurrent=false;
                     }
                });

            });

        }]);