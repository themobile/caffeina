/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controllers')


    .controller('addjob',
    [
        '$scope'
        , '$state'
        , '$stateParams'
        , 'dmlservice'
        , '$filter'
        , '$ionicPopup'
        , function ($scope, $state, $stateParams, dmlservice, $filter, $ionicPopup) {


        $scope.init = function () {

            $stateParams.date != '' ? $scope.passedDate = new Date(decodeURIComponent($stateParams.date)) : $scope.passedDate = new Date();

            $scope.newJob = {
                date: $filter("date")($scope.passedDate, 'yyyy-MM-dd'),
                time: '10:00',
                contact: {
                    name: '', phone: '', email: ''
                },
                type: 'session',
                price: '',
                isBooked: false,
                isTasksGenerated: false
            };
            $scope.userTemplates = dmlservice.userTemplates;
            $scope.alarms = dmlservice.userSettings.alerts;

        };

        $scope.$on('newJob:save', function () {
            dmlservice.setJob($scope.newJob).then(function (jobId) {
                $state.go('home');
            }, function (error) {
                $scope.myPopupShow(error);
            });
        });

        $scope.myPopupShow = function (error) {
            $ionicPopup.alert({
                template: error,
                title: 'Error',
                scope: $scope,
                buttons: [
                    {text: 'Got it!'}
                ]
            });
        };
    }]);