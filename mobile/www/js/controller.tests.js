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
                id: 2,
                date: moment("2014-01-01 10:00").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD HH:mm:ss.SSS"),
                allDay: false,
                tasks: 8,
                type: {name: "wedding", id: 1},
                isBooked: true,
                isTasksGenerated: false,
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
            var types = ['wedding', 'baptizing', 'family session'];
            var job = {
                date: moment("2014-06-01 10:00").add('day', parseInt(Math.random() * 28)).format("YYYY-MM-DD HH:mm:ss.SSS"),
                allDay: false,
                type: types[Math.floor(Math.random() * types.length)],
                typeId: 1, //id-ul template-ului
                isBooked: true,
                isTasksGenerated: false,
                location: "str noua bucuresti",
                notes: "comentariuiu",
                contact: {"name": "Florian Cechi", "phone": "7829387232", "email": "asdada@gmail.com"},
                details: {} // aici punem suplimentar
//                contact: {id:1}
            };
//            console.log('start');
//            console.log(moment().format('mm:ss.sss'));
            dmlservice.setJob(job);
        };

        $scope.year = "2014";
        $scope.month = "6";
        $scope.key = "default template";
        $scope.value = "1";


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


        $scope.addDeviceContact = function () {
//            navigator.contacts.create({"displayName": "Caffeina Test User"});
            console.log(dmlservice.userTemplates);
        };

        $scope.setKey = function () {
            var k = $scope.key
                , v = $scope.value
                ;
            dmlservice.setKey(k, v).then(function (value) {
                v = value;
                console.log(k + ": " + v);
            });
        };

        $scope.getKey = function () {
            var k = $scope.key
                , v
                ;
            dmlservice.getKey(k).then(function (value) {
                v = value;
                console.log(k + ": " + v);
            });
        };

        $scope.delKey = function () {
            var k = $scope.key
                , v
                ;
            dmlservice.delKey(k).then(function (value) {
                v = value;
                console.log(k + ": " + v);
            });
        };

        $scope.getKeys = function () {
            var startMoment = moment()
                ;
            dmlservice.getAllKeys().then(function (res) {
                console.log('ha');
            }).then(function () {
                console.log('duration3: ' + moment().diff(startMoment, 'milliseconds').toString() + ' ms');
            });
        };

        $scope.setFile = function () {
            dmlservice.setFile({
                name: "tanganika",
                link: "www.google.ro",
                fileUrl: "www.google.ro"
            }).then(function (fileId) {
                console.log("file id: " + fileId.toString());
            })
        };

        $scope.getFiles = function () {
            dmlservice.getFiles().then(function (data) {
                return dmlservice.getInventory();
            }).then(function (data) {
                console.log(data);
            });
        };

        $scope.setInventory = function () {
            dmlservice.setInventory({
                name: "tanganika 2",
                serial: "348973457345777777777777777777",
                data: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            }).then(function (inventoryId) {
                console.log("file id: " + inventoryId.toString());
            });
        };

        $scope.getJobTasks = function (jobId) {
            dmlservice.getJobTasks(jobId).then(function (response) {
                _.each(response, function (resp) {
                    console.log(JSON.stringify(resp));
                });
            }, function (error) {
                console.log('*** error ***');
                console.log(error);
            });
        };


    }]);