/**
 * Created by daniel on 05/06/14.
 */
angular.module('caffeina.controllers')


    .controller('inventory',
    [
        '$scope'
        , '$state'
        , '$stateParams'
        , 'dmlservice'
        , '$ionicPopup'
        , '$filter'
        , function ($scope, $state, $stateParams, dmlservice, $ionicPopup, $filter) {


        $scope.inAdd = false;

        $scope.getData = function () {
            dmlservice.getInventory()
                .then(function (results) {
                    $scope.inventory = _.sortBy(results, 'date');
                });
        };


        $scope.init = function () {

            $scope.getData();
        };


        $scope.deleteItem = function (item, $index) {
            dmlservice.delInventory(item.id, item.name).then(function (res) {
                $scope.inventory = _.reject($scope.inventory, function (i) {
                    return i.id == item.id;
                });
            })
        };

        $scope.editItem = function (item) {
            //same ADD template for editing.
            //populate newItem with item swiped data
            $scope.newItem = item;
            delete $scope.newItem['$$hashKey'];
            $scope.inAdd = false;
            $scope.showAdd();

        };

        $scope.templateAddEdit = '<input type="text"/>';


        $scope.showAdd = function () {

            var addeditPopup = $ionicPopup.show({
                templateUrl: 'templates/addinventory.html',
                title: $scope.inAdd ? 'add inventory item' : 'edit inventory item',
                subTitle: 'be brief and concise',
                scope: $scope,
                buttons: [
                    {
                        text: 'cancel',
                        type: 'button-clear',
                        onTap: function (e) {

                        }
                    },
                    {
                        text: 'save',
                        type: 'button-clear',
                        onTap: function (e) {
                            dmlservice.setInventory($scope.newItem, $scope.newItem.id)
                                .then(function (res) {
                                    $scope.getData();
                                }, function (error) {
                                    $scope.errorShow(JSON.stringify(error), function () {
                                        $scope.getData()
                                    });
                                });
                        }
                    }
                ]
            });
        };

        $scope.errorShow = function (error, callback) {
            $ionicPopup.alert({
                template: error,
                title: 'Error',
                scope: $scope,
                buttons: [
                    {text: 'Got it!'}
                ]
            }).then(function () {
                callback();
            });
        };

        $scope.$on('inventory:add', function () {
            $scope.inAdd = true;
            $scope.newItem = {
                date: $filter("date")(new Date(), 'yyyy-MM-dd')
            };
            $scope.showAdd();
        });

    }]);