angular.module('caffeina.controllers')

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

        $scope.setTemplate = function () {
            dmlservice.setInitTemplate()
        };

        $scope.addJob = function () {
            var job = {
                date: moment("2014-01-01 10:00").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD HH:mm:ss.SSS"),
                allDay: false,
                type: "wedding",
                typeId: 1,
                isBooked: true,
                isTasksGenerated: false,
                location: "str noua bucuresti",
                notes: "comentariuiu",
                contact: {"name": "Florian Cechi", "phone": "7829387232", "email": "asdada@gmail.com"}
//                contact: {id:1}
            };
//            console.log('start');
//            console.log(moment().format('mm:ss.sss'));
            dmlservice.setJob(job);
        };

        $scope.year = "2014";
        $scope.month = "3";

        $scope.getTasks = function () {
            dmlservice.getOut($scope.year, $scope.month).then(function (ee) {
                console.log('veveveve');
            });
        };


    }]);