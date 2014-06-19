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
        $scope.isFirstLoaded = true;

        $scope.currentMonthYear = '';

        //drives the view current event
        $scope.selectedEvent = {};

        $scope.templates = [];


        $scope.init = function () {

        };


        $scope.golocation=function(coords){
            var newCoords=coords.A+','+coords.k;
            $state.go('map',{location:newCoords});
        }

        $scope.viewTask = function (id) {
            ngProgressLite.start();

            $scope.selectedEvent = _.find($scope.events, function (event) {
                return event.id == id;
            });



            _.map($scope.events, function (num) {
                //change selectedEvent if id or date
                if (num.id == $scope.selectedEvent.id || moment(num.date).isSame($scope.selectedEvent.date)) {
                    return num.isCurrent = true;
                } else {
                    return num.isCurrent = false;
                }
            });

            ngProgressLite.done();
            $ionicSlideBoxDelegate.$getByHandle('calendar_slider').slide(2);
        }

        //load monthly data based on date
        $scope.loadData = function (year, month) {
            ngProgressLite.start();

            //empty list of events
            //FIXME not working (when bad connection changing months don't trigger right away empty)
            $scope.monthEvents = [];
            $scope.selectedEvent = {};

            dmlservice.getTasks(year, month).then(function (res) {
                $scope.events = _.sortBy(res, 'date');
                CalendarEvents.setEvents($scope.events);
                ngProgressLite.done();
            })
        };


        $scope.$on('calendar:holddate', function (e, innerhtml) {
            var selectedDay = parseInt(innerhtml);
            var addDate;
            //if it's a possible month day
            if (selectedDay > 0 && selectedDay < 32) {
                addDate = moment($scope.currentMonthYear).date(selectedDay).format('YYYY/MM/DD');

//                $state.go('addjob/'+encodeURIComponent(addDate));
                $state.go('addjob', {'date': encodeURIComponent(addDate)});
            }
        });


        // on firebase login
        $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
            if ($scope.isFirstLoaded) {
                $scope.loadData(moment().format('YYYY'), moment().format('MM'));
            }
        });

        // on firebase logout
        $rootScope.$on('$firebaseSimpleLogin:error', function (error) {
//            console.log('home controller login error');
//            console.log(error);
        });


        //change data on month change
        $scope.$on('calendar:changeMonth', function (event, date) {

            //set current month and year
            $scope.currentMonthYear = new Date(date);

            //load data from firebase for current month
            if (userService.getUser()) {
                $scope.loadData(moment(date).format('YYYY'), moment(date).format('MM'));
            }

        });

        //empty event list on view change event emitted from directive
        $scope.$on('viewchanged', function () {
//            $scope.monthEvents = [];

        });


        //emits on 3rd slide (task view) to signal menu change (kinda weird)
        $scope.sliderchanged = function (index) {
            if (index == 2 && $scope.selectedEvent.date) {
                $scope.$emit('isInView', true);
            } else {
                $scope.$emit('isInView', false);
            }
        }


        // calendar loaded data
        $scope.$on('calendar:events', function (model, view) {
            $scope.isFirstLoaded = false;
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


            // directly view the event
            if (i.length == 1)  $scope.viewTask(i[0].id);

            // push in local events for the selected day
            if (i.length >= 2) $ionicSlideBoxDelegate.$getByHandle('calendar_slider').next();


        });

    }]);