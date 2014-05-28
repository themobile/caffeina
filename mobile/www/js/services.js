angular.module('caffeina.services', [])


    .constant('fireUrl', 'https://caffeina.firebaseio.com')

    .factory('dataService', ['$firebase', '$firebaseSimpleLogin', 'fireUrl', function ($firebase, $firebaseSimpleLogin, fireUrl) {

        var ref = new Firebase(fireUrl);


        return {
            getFirebase: function () {
                return $firebase(ref);
            },
            getFireauth: function () {
                var auth = $firebaseSimpleLogin(ref, function (error, user) {
                    console.log(error);
                });
                return auth;

            }
        }

    }])


    .factory('userService', ['$firebase', '$firebaseSimpleLogin', 'fireUrl', function ($firebase, $firebaseSimpleLogin, fireUrl) {
        var ref = new Firebase(fireUrl);
        var user = $firebaseSimpleLogin(ref);
        return {

            login: function (type, remember, userEmail, userPassword) {
                return user.$login(type, {
                    rememberMe: remember,
//                    scope: 'email,user_likes',
                    email: userEmail,
                    password: userPassword
                })

            },

            logout: function () {
                user.$logout();

            },

            getUser: function () {
                return user.user;

            },

            signUp: function (userEmail) {
                var newUsr = userEmail.replace(/\./g, ',');
                var caffData = $firebase(new Firebase('https://caffeina.firebaseio.com/' + 'users/' + newUsr));
                caffData.email = userEmail;
                caffData.$save();
            }


        }

    }])


//    .factory('userService', ['$firebase', '$firebaseSimpleLogin', 'fireUrl', function ($firebase, $firebaseSimpleLogin, fireUrl) {
//        var root = new Firebase(fireUrl+'/');
//        return {
//            leadAdd: function (newLead) {
//
//            }
//        }
//    }])
;