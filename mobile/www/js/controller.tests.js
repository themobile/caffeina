angular.module('caffeina.controller.tests', [])
    .controller('tests', ['$scope', 'leads',function ($scope,leads ) {

        $scope.addLead = function () {

            var lead = {
                "date": "2014-07-20",
                "title": "Lead de incarcat prin servicii",
                "contact": {"name": "Florian Cechi", "phone": "7829387232", "email": "asdada@gmail.com"}
            }
            leads.add(lead);
        }


        $scope.updateLead = function () {

            var lead = {
                "date": "2015-05-01",
                "title": "Lead de modificat prin servicii",
                "contact": {"name": "Florian Cechi", "phone": "7829387232", "email": "122323423@gmail.com"}
            }
            leads.update(lead, '-JO7GKm4-BIRsHI4ev9is');
        }


        $scope.removeLead = function () {

            leads.remove('-JO7GKm4-BIRsHI4ev9is');
        }


        $scope.getLeadsMonth = function () {

            var month = 1;
            var l = leads.getAllMonth(2014, 1);


            console.log(JSON.stringify(l));

        }
    }])
;