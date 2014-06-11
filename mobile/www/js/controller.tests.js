angular.module('caffeina.controller.tests', [])

    .controller('tests', ['$scope', 'dmlservice', function ($scope, dmlservice) {

        $scope.addLead = function () {
            var anyDate = moment("2014-01-01").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD");
            var lead = {
                "date": anyDate,
                "type": "Studio",
                "contact": {"name": "Florian Cechi", "phone": "7829387232", "email": "asdada@gmail.com", id1: 1}
            };
            dmlservice.setLead(lead);
        };

        $scope.updateLead = function () {

            var anyDate = moment("2014-01-01").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD")
                , idLead = $scope.idLead
                ;
            var lead = {
                "id": idLead,
                "date": anyDate,
                "type": "Session",
                "contact": {id: 4}
            };
            dmlservice.setLead(lead);
        };

        $scope.removeLead = function () {
            dmlservice.delLead($scope.idLead);
        };

        $scope.setInitTemplate = function () {
            dmlservice.setInitTemplate()
        };

        $scope.getRootTemplate = function () {
            var unarray = dmlservice.getRootTemplate()
                ;
        };


    }]);