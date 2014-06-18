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
        , function ($scope, $state, $stateParams, dmlservice, $filter) {



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
                isBooked:false
            };

            $scope.userTemplates = dmlservice.userTemplates;

            $scope.alarms = [
                {id: 1, name: '1h'},
                {id: 2, name: '2h'},
                {id: 3, name: '4h'},
                {id: 4, name: '12h'},
                {id: 5, name: '24h'},
                {id: 6, name: '1 day'},
                {id: 7, name: '2 day'}
            ];
        };


        $scope.$on('newJob:save', function () {

            $scope.newJob.typeName= $scope.newJob.type.name;
            dmlservice.setJob($scope.newJob);

        });


    }]);