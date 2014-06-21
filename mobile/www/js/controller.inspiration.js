/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controllers')


    .controller('inspiration',
    [
        '$scope'
        , '$state'
        , '$stateParams'
        , 'dmlservice'
        , '$ionicModal'
        , '$sce'
        , '$timeout'

        , function ($scope, $state, $stateParams, dmlservice, $ionicModal, $sce,$timeout) {


        $scope.init = function () {
            dmlservice.getFiles()
                .then(function (results) {
                    $scope.inspirations = results;
                });
        };


        $scope.next = function () {
            if ($scope.inspirations[$scope.imageIndex + 1]) {
                $scope.imageIndex++;
                $scope.imageSrc = $sce.trustAsResourceUrl($scope.inspirations[$scope.imageIndex].fileUrl);
                $scope.author = $scope.inspirations[$scope.imageIndex].name;
                $scope.link = $scope.inspirations[$scope.imageIndex].link;
                console.log($scope.imageIndex);

            }
        };
        $scope.prev = function () {
            if ($scope.inspirations[$scope.imageIndex - 1]) {
                $scope.imageIndex--;
                $scope.imageSrc = $sce.trustAsResourceUrl($scope.inspirations[$scope.imageIndex].fileUrl);
                $scope.author = $scope.inspirations[$scope.imageIndex].name;
                $scope.link = $scope.inspirations[$scope.imageIndex].link;
                console.log($scope.imageIndex);
            }
        };


        $scope.reportEvent = function (event) {
            console.log('Reporting : ' + event.gesture.direction);
            if (event.gesture.direction == 'right') {
                $scope.prev();
            }
            if (event.gesture.direction == 'left') {
                $scope.next();
            }

        };


        $ionicModal.fromTemplateUrl('templates/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();

        };

        $scope.closemdl = function (ev) {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        $scope.$on('modal.shown', function () {
            console.log('Modal is shown!');
        });


        $scope.showImage = function (inspiration, index) {
            $scope.imageSrc = inspiration.fileUrl;
            $scope.author = inspiration.name;
            $scope.link = inspiration.link;
            $scope.imageIndex = index;
            $scope.openModal();
        }


    }]);