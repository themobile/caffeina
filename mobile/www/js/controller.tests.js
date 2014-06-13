angular.module('caffeina.controllers')

    .controller('tests', ['$scope', 'dmlservice', 'dmll', '$firebase', '$q', '$rootScope', '$timeout', function ($scope, dmlservice, dmll, $firebase, $q, $rootScope, $timeout) {

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


        $scope.promises = [];
        $scope.events = [];


        $scope.$watch('events', function (nv, ov) {
            console.log('events');
        })

        $scope.getTasks = function () {
//            var startAt = moment($scope.year + '-' + $scope.month + '-01').format('YYYY-MM-DD')
//                , endAt = moment($scope.year + '-' + $scope.month + '-01').add('months', 1).add('days', -1).format('YYYY-MM-DD')
//                , taskRef = dmlservice._tasksFBRef()
//                , jobRef = dmlservice._jobsFBRef()
//                , promises = []
//                ;
//            console.log(moment().format('HH:mm:ss SSS'));
//
//            var doQuery = function (task) {
//                var d = $q.defer();
//                jobRef.child(task.jobId).once('value', function (jobSnapshoot) {
//                    task.jobObject = jobSnapshoot.val();
//                    d.resolve(task);
//                }, function (error) {
//                    d.reject(error);
//                });
//                return d.promise;
//            };
//
//            taskRef.startAt(startAt).endAt(endAt).once('value', function (tasksSnapshoot) {
//                _.each(_.values(tasksSnapshoot.val()), (function (task) {
//                    if (task) {
//                        promises.push(doQuery(task));
//                    }
//                }));
//
//                $q.all(promises).then(function(res){
//                    $scope.events=res;
//                    console.log(moment().format('HH:mm:ss SSS'));
//                })
//            });

//
             dmll.getTasks($scope.year, $scope.month)
                .then(function (res) {
                     $scope.events =res;
                });


        };


    }]);