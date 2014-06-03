angular.module('caffeina.controller.tests', [])

    .controller('tests', ['$scope', 'leads', function ($scope, leads) {

        $scope.addLead = function () {
            var anyDate = moment("2014-01-01").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD");
            var lead = {
                "date": anyDate,
                "title": "Lead de incarcat prin servicii",
                "contact": {"name": "Florian Cechi", "phone": "7829387232", "email": "asdada@gmail.com", id: 1}
            };
            leads.add(lead);
        };

        $scope.updateLead = function () {

            var anyDate = moment("2014-01-01").add('day', parseInt(Math.random() * 100)).format("YYYY-MM-DD")
                , idLead = $scope.idLead
                ;
            var lead = {
                "date": anyDate,
                "title": "Lead de modificat prin servicii",
                "contact": {"name": "Florian Cechi", "phone": "7829387232", "email": "122323423@gmail.com"}
            };
            leads.update(idLead, lead);
        };

        $scope.removeLead = function () {
            leads.remove(4);
        };

//
//        $scope.getLeadsMonth = function () {
//
//            var month = 1;
//            var l = leads.getAllMonth(2014, 1);
//            console.log(JSON.stringify(l));
//        }
    }]);