angular.module('caffeina.service.auth', [])


    .factory('userService', ['$firebaseSimpleLogin', 'firebaseRef', function ($firebaseSimpleLogin, firebaseRef) {
        var user = $firebaseSimpleLogin(firebaseRef());
        return {

            login: function (type, attr) {

                user.$login(type, {
                    rememberMe: attr.rememberMe,
                    access_token: attr.access_token
//                    email: attr.email,
//                    password: attr.password
                }).then(function (response) {
                        var userDetails = firebaseRef('/users/' + btoa(user.user.email));
                        userDetails.update({details: user.user});
                    })
                return user;

            },

            logout: function () {
                user.$logout();

            },

            getUser: function () {
                return user.user;

            },

            getUserId: function () {
                return  user.user ? btoa(user.user.email) : null;
            }

        }

    }])


