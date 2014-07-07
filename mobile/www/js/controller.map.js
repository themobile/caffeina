/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controllers')


    .controller('map',
    [
        '$scope'
        , '$state'
        , '$stateParams'
        , '$timeout'
        , function ($scope, $state, $stateParams, $timeout) {

        $scope.location = {
            longitude: $stateParams.location.split(',')[0],
            latitude: $stateParams.location.split(',')[1]
        };

        $scope.map = {
            center: $scope.location,
            zoom: 17,
            draggable: 'true',
            options:{
                streetViewControl:false,
                panControl:false,
                maxZoom:20,
                minZoom:3
            }
        };

        $scope.marker = {
            longitude: $stateParams.location.split(',')[0],
            latitude: $stateParams.location.split(',')[1],
            icon: 'img/map-marker.png',
            showWindow:false,
            title:'Marker 2',
            options:{

            }
        };




        $scope.init=function(){
            $timeout(function () {


            },1000);


        };




    }]);