/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controller.add', [])


    .controller('addlead',
        [
            '$rootScope'
            , '$scope'
            , 'userService'
            , '$firebaseSimpleLogin'
            , 'storage'
            , '$state'
            , '$ionicLoading'
            , 'dmlservice'
            , function ($rootScope, $scope, userService, $firebaseSimpleLogin, storage, $state, $ionicLoading, dmlservice) {




            $scope.newLead={
                date:new Date(),
                contact:{
                    name:'',
                    phone:'',
                    email:''
                },
                title:'',
                id1:5
            }



            $scope.cancel=function(){
                if ($rootScope.$previousState.name){
                $state.go($rootScope.$previousState);
                } else {
                    $state.go('home');
                }
            }

            $scope.addLead = function () {
                $scope.newLead.date=moment($scope.newLead.date).format("YYYY-MM-DD");
                leads.setLead($scope.newLead);
            }

        }]);