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
            //delete hashkey from location object otherwise firebase is complaining
            if ($scope.newJob.details) if ($scope.newJob.details.location) delete $scope.newJob.details.location['$$hashKey'];

            //set this to be considered
            if ($scope.newJob.type.autoBooked) $scope.newJob.isBooked=true;


            //read time
            var time=$scope.newJob.time.split(':');
            var hours=time[0];
            var minutes=time[1];

            delete $scope.newJob['time'];
            $scope.newJob.date=moment($scope.newJob.date).add(parseInt(hours),'hour').add(parseInt(minutes),'minutes').toISOString();


            dmlservice.setJob($scope.newJob).then(function (jobId) {
                $state.transitionTo('home');
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