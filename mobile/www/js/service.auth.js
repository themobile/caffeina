angular.module('caffeina.services')

    .factory('userService', ['$firebaseSimpleLogin', 'firebaseRef', 'dmlservice', '$q', function ($firebaseSimpleLogin, firebaseRef, dmlservice, $q) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , userServiceObject = {}
            ;

        userServiceObject._login = function (type, attr) {
            var deferred = $q.defer()
                ;
            user.$login(type, {
                rememberMe: attr.rememberMe,
                access_token: attr.access_token
            }).then(function (result) {
                deferred.resolve(result);
            }, function (error) {
                return user.$login(type).then(function (result) {
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject('login error: ' + JSON.stringify(error));
                });
            });
            return deferred.promise;
        };

        userServiceObject.login = function (type, attr) {
            var deferred = $q.defer();
            userServiceObject._login(type, attr).then(function (response) {
                var userRef = dmlservice._userRootFBRef()
                    ;
                return userRef.update({details: user.user});
            }).then(function () {
                var ref = dmlservice._userRootFBRef()
                    ;
                ref.child('templates').once('value', function (snapshoot) {
                    if (!(snapshoot.val())) {
                        return dmlservice.setInitTemplate();
                    }
                });
            }).then(function () {
                return dmlservice.getUserTemplates();
            }).then(function () {
                return dmlservice.setInitKeys();
            }).then(function () {
                return  dmlservice.getUserSettings();
            }).then(function () {
                deferred.resolve(0);
            }, function (error) {
                deferred.reject({method: "userService/login", error: error});
            });
            return deferred.promise;
        };

        userServiceObject.logout = function () {
            user.$logout();
        };

        userServiceObject.getUser = function () {
            return user.user;
        };

        userServiceObject.getUserId = function () {
            return  user.user ? btoa(user.user.email) : null;
        };

        return userServiceObject;
    }]);


