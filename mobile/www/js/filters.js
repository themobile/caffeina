angular.module('caffeina.filters', [])


    .filter('next3futureEvents', function () {
        return function (inputDateRange) {
            var z=new Date();
            return _.filter(inputDateRange, function(num){
                return moment(num.start).isAfter(z);
            });
        }
    });