/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controllers')


    .controller('addjob',
    [
        '$rootScope'
        , '$scope'
        , '$state'
        , 'dmlservice'
        , '$filter'
        , function ($rootScope, $scope, $state, dmlservice,$filter) {

        $scope.init = function () {
            $scope.newJob = {
                date: $filter("date")(Date.now(), 'yyyy-MM-dd'),
                time: '10:00',
                contact: {
                    name: 'daniel',
                    phone: '',
                    email: ''
                },
                type: 'session',
                price:''
            };

            $scope.userTemplates = dmlservice.userTemplates;


        };

        $scope.cancel = function () {
            $state.go('home');
        }


    }]);