angular.module('caffeina.services')

// a simple utility to create references to Firebase paths
    .factory('firebaseRef', ['Firebase', 'fburl', function (Firebase, fburl) {
        /**
         * @function
         * @name firebaseRef
         * @param {String|Array...} path
         * @return a Firebase instance
         */
        return function (path) {
            return new Firebase(pathRef([fburl].concat(Array.prototype.slice.call(arguments))));
        }


    }])

    // a simple utility to create references to Firebase paths
    .factory('firebaseRefUser', ['Firebase', 'fburl','userService', function (Firebase, fburl,userService) {
        /**
         * @function
         * @name firebaseRef
         * @param {String|Array...} path
         * @return a Firebase instance
         */
        return function (path) {
            return new Firebase(pathRef([fburl+'/users/'+userService.getUserId()].concat(Array.prototype.slice.call(arguments))));
        }
    }])


    // a simple utility to create $firebase objects from angularFire
    .service('syncData', ['$firebase', 'firebaseRef', function ($firebase, firebaseRef) {
        /**
         * @function
         * @name syncData
         * @param {String|Array...} path
         * @param {int} [limit]
         * @return a Firebase instance
         */
        return function (path, limit, startAt, endAt) {
            var ref = firebaseRef(path);
            limit && (ref = ref.limit(limit));

            return $firebase(ref);
        }
    }]);

function pathRef(args) {
    for (var i = 0; i < args.length; i++) {
        if (typeof(args[i]) === 'object') {
            args[i] = pathRef(args[i]);
        }
    }
    return args.join('/');
}