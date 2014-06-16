angular.module('caffeina.controllers')

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
        , 'dmlservice'
        , '$state'
        , '$timeout'
        , '$ionicSlideBoxDelegate'
        , function ($rootScope, $scope, CalendarEvents, $ionicSideMenuDelegate, $firebase, userService, firebaseRef, firebaseRefUser, ngProgressLite, dmlservice, $state, $timeout, $ionicSlideBoxDelegate) {


        // data for calendar
        $scope.events = [];

        $scope.datePickerControl = {};


        $scope.currentMonth='';
        //drives the view current event
        $scope.selectedEvent = {};

        $scope.init = function () {

        }

        //event broadcasted to datepicker directive to go today
        $scope.goToday = function () {
            //timeout to change month after refresh
            $timeout(function () {
                $scope.$broadcast('scroll.refreshComplete');
            }, 000).then(function () {
                $scope.$broadcast('gotoday');
            });
        };


        //TODO de pus buton
        //slide to event description clicked in event list
        $scope.viewTask = function (id) {
            console.log(id);
            ngProgressLite.start();


            $scope.selectedEvent=_.find($scope.events, function(event){
                return event.id == id;

            });

            _.map($scope.events, function (num) {
                //change selectedEvent if id or date
                if (num.id==$scope.selectedEvent.id || moment(num.date).isSame($scope.selectedEvent.date)) {
                    return num.isCurrent = true;
                } else {
                    return num.isCurrent = false;
                }
            });

                ngProgressLite.done();
                $ionicSlideBoxDelegate.$getByHandle('calendar_slider').slide(2);
        }

        //load monthly data based on date
        $scope.loadData = function (year,month) {
            ngProgressLite.start();

            var startMoment = moment();
            dmlservice.getTasks(year,month).then(function (res) {
                $scope.events = _.sortBy(res, 'date');
                CalendarEvents.setEvents($scope.events);
                ngProgressLite.done();

            }).then(function () {
                console.log('duration3: ' + moment().diff(startMoment, 'milliseconds').toString() + ' ms');
            });

        };


        // on firebase login
        $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
            if (!$scope.monthEventsLoaded) {
                $scope.loadData(moment().format('YYYY'),moment().format('MM'));
            }
        });

        // on firebase logout
        $rootScope.$on('$firebaseSimpleLogin:error', function (error) {
//            console.log('home controller login error');
//            console.log(error);
        });


        //change data on month change
        $scope.$on('calendar:changeMonth', function (event, date) {

            //set current month
            $scope.currentMonth=moment(date).format('MMMM, YYYY');

            //empty list of events
            $scope.monthEvents = [];
            //load data from firebase for current month
            if (userService.getUser()) {
                $scope.loadData(moment(date).format('YYYY'),moment(date).format('MM'));
                $scope.monthEventsLoaded = true;
            }
            $scope.selectedEvent={};

        });

        //empty event list on view change event emitted from directive
        $scope.$on('viewchanged', function () {
            $scope.monthEvents = [];

        });


        // calendar loaded data
        $scope.$on('calendar:events', function (model, view) {
            console.log('setdate');
        });

        // Click on event: search and display list of day events underlined in whole month
        $scope.$on('calendar:clickevent', function (event, day) {
            var i = [];

            //mark events for the current selected day with property isCurrent
            _.map($scope.events, function (num) {
                if (moment(num.date).format('YYYY-MM-DD') == day) {
                    i.push(num);
                    return num.isCurrent = true;
                } else {
                    return num.isCurrent = false;
                }
            });

            if (i.length == 1) {
                $scope.viewTask(i[0].id);
            }

            if (i.length >= 2) {
                // push in local events for the selected day
                $ionicSlideBoxDelegate.$getByHandle('calendar_slider').next();
            }


        });

    }]);