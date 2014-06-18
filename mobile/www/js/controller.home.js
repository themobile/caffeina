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


        //solution for two columns inside ng-repeat. LEAVE IT HERE FOR LATER
        $scope.range = function () {
            var range = [];
            for (var i = 0; i < $scope.events.length; i = i + 2)
                range.push(i);
            return range;
        };


        $scope.templates = [];
        $scope.init = function () {

        };


        //TODO de pus buton
        //slide to event description clicked in event list
        $scope.viewTask = function (id) {
            console.log(id);
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


            var loadBulkTasks = function (res) {
                $scope.templates = dmlservice.userTemplates;
                $scope.events = _.map(_.sortBy(res, 'date'), function (event) {
                    var tmp = _.where($scope.templates, {'name': event.jobObject.type})[0];
                    event.color = tmp.color;
                    event.icon = tmp.icon;
//                    event.date=new Date(event.date);
                    return event;
                });
                CalendarEvents.setEvents($scope.events);
                ngProgressLite.done();

            };


            dmlservice.getTasks(year, month).then(function (res) {
                if (dmlservice.userTemplates.length) {
                    loadBulkTasks(res);
                } else {
                    dmlservice.getUserTemplates().then(function () {
                        loadBulkTasks(res);
                    });
                }
            })
        };


        $scope.$on('calendar:holddate', function (e, innerhtml) {
            var selectedDay=parseInt(innerhtml);
            var addDate;
            //if it's a possible month day
            if (selectedDay > 0 && selectedDay < 32) {
                addDate=moment($scope.currentMonthYear).date(selectedDay).format('YYYY/MM/DD');

//                $state.go('addjob/'+encodeURIComponent(addDate));
                $state.go('addjob',{'date':encodeURIComponent(addDate)});
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

            if (i.length == 1) {
                $scope.viewTask(i[0].id);
            }

            if (i.length >= 2) {
                // push in local events for the selected day
                $ionicSlideBoxDelegate.$getByHandle('calendar_slider').next();
            }

        });

    }]);