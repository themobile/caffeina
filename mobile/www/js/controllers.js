angular.module('caffeina.controllers', [])


// A simple controller that shows a tapped item's data
    .controller('MenuController', ['$scope', '$ionicSideMenuDelegate', 'userService', 'storage', '$state', function ($scope, $ionicSideMenuDelegate, userService, storage, $state) {
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

    .controller('home', ['$rootScope', '$scope', 'CalendarEvents', '$ionicSideMenuDelegate', '$firebase', 'userService', 'firebaseRef', 'firebaseRefUser', '$ionicLoading', function ($rootScope, $scope, CalendarEvents, $ionicSideMenuDelegate, $firebase, userService, firebaseRef, firebaseRefUser, $ionicLoading) {
        $scope.events = [];
        $scope.datePickerControl = {};


        $scope.goToday2 = function () {
            $scope.$broadcast('gotoday');
            $scope.$broadcast('scroll.refreshComplete');

        };

        //drives the list with events for a selected day
        $scope.monthEvents = [];

        //load monthly data based on date
        $scope.loadData = function (month) {
            $ionicLoading.show({
                template: 'Loading app data...'
            });

            var startAt = moment(month, 'MMMM').startOf('month').format('YYYY-MM-DD');
            var endAt = moment(month, 'MMMM').endOf('month').format('YYYY-MM-DD');
            var leadsRef = firebaseRefUser('/leads/').startAt(startAt).endAt(endAt);
            var kk = $firebase(leadsRef);
            kk.$on('loaded', function (data) {
                $scope.events = _.values(data);
                CalendarEvents.setEvents($scope.events);
                $ionicLoading.hide();

            });
        };

        $scope.init = function () {
            //testing
//            var fred=new Firebase('https://caffeina.firebaseio.com/users/Y2hpbmRlYS5kYW5pZWxAZ21haWwuY29t/leads')
//            fred.on('value',function(dataSnapshot){
//                var fredsnap=dataSnapshot;
//
//
//                fredsnap.forEach(function(child){
//
//                    var add='https://caffeina.firebaseio.com/users/Y2hpbmRlYS5kYW5pZWxAZ21haWwuY29t/leads/'+child.name();
//                    var kk=new Firebase(add);
//                    kk.setPriority(child.val().date);
//
//                })
//            })
        };


        // on firebase login
        $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
            $scope.loadData(moment().format('MMMM'));

        });

        // on firebase logout
        $rootScope.$on('$firebaseSimpleLogin:error', function (error) {
            console.log(error);
        });


        //change data on month change
        $scope.$on('calendar:changeMonth', function (event, date) {
            $scope.monthEvents = [];
            $scope.loadData(date);
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

        // hide loading screen and load current month
        $ionicLoading.hide();

    }])



