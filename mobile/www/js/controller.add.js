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
            , function ($rootScope, $scope, $state, dmlservice) {


            $scope.init=function(){

                $scope.newJob={
                    date:new Date(2014,02,02),
                    contact:{
                        name:'daniel',
                        phone:'',
                        email:''
                    },
                    type:'session',
                    id1:5
                }
            }

            $scope.cancel=function(){
                    $state.go('home');
            }


        }]);