angular.module('caffeina.controllers')

    .controller('tests', ['$scope', 'dmlservice', '$firebase', '$q', '$rootScope', '$timeout', function ($scope, dmlservice, $firebase, $q, $rootScope, $timeout) {

//        $scope.addLead = function () {
//            var anyDate = moment("2014-01-01").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD");
//            var lead = {
//                "date": anyDate,
//                "type": "Studio",
//                "contact": {"name": "Florian Cechi", "phone": "7829387232", "email": "asdada@gmail.com", id1: 1}
//            };
//            dmlservice.setLead(lead);
//        };

//        $scope.updateLead = function () {
//
//            var anyDate = moment("2014-01-01").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD")
//                , idLead = $scope.idLead
//                ;
//            var lead = {
//                "id": idLead,
//                "date": anyDate,
//                "type": "Session",
//                "contact": {id: 4}
//            };
//            dmlservice.setLead(lead);
//        };
//
//        $scope.removeLead = function () {
//            dmlservice.delLead($scope.idLead);
//        };

        $scope.setTemplate = function () {
            dmlservice.setInitTemplate()
        };

        $scope.delJob = function () {
            dmlservice.delJob(1);
        };

        $scope.updJob = function () {
            var job = {
                id: 1,
                date: moment("2014-01-01 10:00").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD HH:mm:ss.SSS"),
                allDay: false,
                tasks: "60,61,62,63,64,65",
                type: "wedding",
                typeId: 1,
                isBooked: true,
                isTasksGenerated: true,
                location: "str noua bucuresti2",
                notes: "comentariuiu",
                contact: {"name": "Florian Cechi", "phone": "7829387232", "email": "asdada@gmail.com"}
//                contact: {id:1}
            };
//            console.log('start');
//            console.log(moment().format('mm:ss.sss'));
            dmlservice.setJob(job);
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


        $scope.promises = [];
        $scope.events = [];


        $scope.$watch('events', function (nv, ov) {
            console.log('events');
        });

        $scope.getTasks = function () {
            var startMoment = moment()
                ;
            dmlservice.getTasks($scope.year, $scope.month).then(function (res) {
                $scope.events = _.sortBy(res, 'date');
            }).then(function () {
                console.log('duration3: ' + moment().diff(startMoment, 'milliseconds').toString() + ' ms');
            });
        };


        $scope.addDeviceContact = function() {
            navigator.contacts.create({"displayName": "Caffeina Test User"});
        }


    }]);