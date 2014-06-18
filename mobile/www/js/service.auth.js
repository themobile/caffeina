angular.module('caffeina.services')

    .factory('userService', ['$firebaseSimpleLogin', 'firebaseRef', 'dmlservice','$q', function ($firebaseSimpleLogin, firebaseRef, dmlservice,$q) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , userServiceObject = {}
            ;

        userServiceObject.login = function (type, attr) {
            var deferred=$q.defer();
            user.$login(type, {
                rememberMe: attr.rememberMe,
//                rememberMe: false,
                access_token: attr.access_token
//                    email: attr.email,
//                    password: attr.password
            }).then(function (response) {
                var userDetails = firebaseRef('/users/' + btoa(user.user.email));
                return userDetails.update({details: user.user});
            }).then(function () {
                var ref = dmlservice._userRootFBRef()
                    ;
                ref.child('templates').once('value', function (snapshoot) {
                    var tmpl = snapshoot.val()
                        ;
                    if (!(tmpl)) {
                        return dmlservice.setInitTemplate();
                    }
                });
            }).then(function () {
                return dmlservice.getUserTemplates();
            }).then(function () {
                deferred.resolve();
                return dmlservice.setInitKeys([
                    {key: "template", value: "1"},
                    {key: "color", value: "#000000"},
                    {key: "email", value: "Da"}
                ]);

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


