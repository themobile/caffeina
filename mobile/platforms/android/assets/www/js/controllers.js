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



            // set isInAdd if state is addlead
            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    (toState.name == 'addlead') ? $scope.isInAdd = true : $scope.isInAdd = false;
                })


            $scope.cancel = function () {
                if ($rootScope.$previousState.name) {
                    $state.go($rootScope.$previousState);
                } else {
                    $state.go('home');
                }
            }

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
                            $state.transitionTo('addlead');
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
        $scope.result = '';


    }])


    .controller('isconnected', ['$scope', '$ionicBackdrop', function ($scope, $ionicBackdrop) {
        //variable to control overlay if not connected

        $scope.isConnected = true;
        $scope.$on('isConnected', function (event, value) {
            $scope.isConnected = value;
//            $scope.isConnected=false;

        });

    }])






