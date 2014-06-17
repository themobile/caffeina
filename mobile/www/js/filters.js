angular.module('caffeina.filters', [])


    .filter('next3futureEvents', function () {
        return function (inputDateRange) {
            var z = new Date();
            return _.filter(inputDateRange, function (num) {
                return moment(num.start).isAfter(z);
            });
        }
    })


    .filter('firstletters', function () {

        return function (inputName) {
            var fl = inputName.match(/\b(\w)/g).join('');
            return fl;
        }

    })


    .filter('groupRows', function () {
        /**
         * splits an array into groups of the given size
         * e.g. ([1, 2, 3, 4, 5], 2) -> [[1, 2], [3, 4], [5]]
         */
        return function (array, groupSize) {

            return _.groupBy(array, function (val, index) {
                return Math.floor(index / groupSize);
            });
        };

    });