angular.module('caffeina.services')

    .factory('userService', ['$firebaseSimpleLogin', 'firebaseRef', 'dmlservice', function ($firebaseSimpleLogin, firebaseRef, dmlservice) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , userServiceObject = {}
            ;

        userServiceObject.login = function (type, attr) {

            user.$login(type, {
                rememberMe: attr.rememberMe,
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
                });
            return user;
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


