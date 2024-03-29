/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controllers')


    .controller('loading',
    [
        '$scope'
        , '$state'
        , '$stateParams'
        , 'dmlservice'
        , '$ionicModal'
        , '$timeout'

        , function ($scope, $state, $stateParams, dmlservice, $ionicModal, $timeout) {


        $ionicModal.fromTemplateUrl('templates/loadingModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });


        $scope.init = function () {

        };


    }]);