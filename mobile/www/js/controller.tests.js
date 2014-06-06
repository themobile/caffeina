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

        $scope.setPrimaryTemplate = function () {
            dmlservice.setPrimaryTemplate([
                {
                    name: 'wedding',
                    tasks: [
                        {
                            name: 'engagement session',
                            shift: -60,
                            isMain: false,
                            alert: -1
                        },
                        {
                            name: 'civil ceremony',
                            shift: -1,
                            isMain: false,
                            alert: -1
                        },
                        {
                            name: 'preparations',
                            shift: 0,
                            isMain: false,
                            alert: -1
                        },
                        {
                            name: 'ceremony',
                            shift: 0,
                            isMain: false,
                            alert: -1
                        },
                        {
                            name: 'party',
                            shift: 0,
                            isMain: true,
                            alert: -1
                        },
                        {
                            name: 'trash the dress',
                            shift: 10,
                            isMain: false,
                            alert: -1
                        }
                    ]
                },
                {
                    name: 'baptizing',
                    tasks: [
                        {
                            name: 'family session',
                            shift: -1,
                            isMain: false,
                            alert: -1
                        },
                        {
                            name: 'preparations',
                            shift: 0,
                            isMain: false,
                            alert: -1
                        },
                        {
                            name: 'ceremony',
                            shift: 0,
                            isMain: false,
                            alert: -1
                        },
                        {
                            name: 'party',
                            shift: 0,
                            isMain: true,
                            alert: -1
                        }
                    ]
                },
                {
                    name: 'family session',
                    tasks: [
                        {
                            name: 'session',
                            shift: 0,
                            isMain: true,
                            alert: -1
                        }
                    ]
                }
            ])
        };


    }]);