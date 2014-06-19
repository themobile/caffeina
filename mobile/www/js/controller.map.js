/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controllers')


    .controller('map',
    [
        '$scope'
        , '$state'
        , '$stateParams'
        , 'dmlservice'
        , '$filter'
        , '$ionicPopup'
        , function ($scope, $state, $stateParams, dmlservice, $filter, $ionicPopup) {


        $scope.location={
            longitude:$stateParams.location.split(',')[0],
            latitude:$stateParams.location.split(',')[1]
        };
        $scope.map={
            center:$scope.location,
            zoom:17,
            draggable:'true'
        };

        $scope.marker={
            coords:$scope.location,
            icon:'img/map-marker.png'
        }


    }]);