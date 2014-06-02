angular.module('caffeina.services', [])




    .factory('leads', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'userService', function ($firebase, $firebaseSimpleLogin, firebaseRef, userService) {
        var user = $firebaseSimpleLogin(firebaseRef());
        return {
            add: function (lead) {
                if (user.user && user.user.email) {
                    var leadsRef = firebaseRef('/users/' + btoa(user.user.email) + '/leads/');
                    leadsRef.child('counter').transaction(function (currentValue) {
                        return (currentValue || 0) + 1
                    }, function (err, commited, identity) {
                        var now = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
                            ;
                        if (err) {
                            console.log("EROARE" + JSON.stringify(err));
                        }
                        else {
                            if (commited) {
                                lead.createdAt = now;
                                lead.updatedAt = now;
                                lead.version = 1;
                                lead.isDeleted = false;
                                leadsRef.child(identity.val()).setWithPriority(lead, lead.date);
                            }
                        }
                    });
                } else {
                    console.log("MESAJ DE EROARE CA NU E LOGAT");
                }
            },

            update: function (id, lead) {
                if (user.user && user.user.email) {
                    var leadsRef = firebaseRef('/users/' + btoa(user.user.email) + '/leads/')
                        , now = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
                        ;
                    leadsRef.child(id).once('value', function (dataSnapshoot) {
                        lead.createdAt = dataSnapshoot.val().createdAt;
                        lead.version = dataSnapshoot.val().version + 1;
                        lead.updatedAt = now;
                        lead.isDeleted = false;
                        leadsRef.child(id).setWithPriority(lead, lead.date);
                    });
                } else {
                    console.log("MESAJ DE EROARE CA NU E LOGAT");
                }
            },

            remove: function (id) {
                if (user.user && user.user.email) {
                    var leadsRef = firebaseRef('/users/' + btoa(user.user.email) + '/leads/')
                        , now = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
                        , lead
                        ;
                    leadsRef.child(id).once('value', function (dataSnapshoot) {
                        lead = dataSnapshoot.val();
                        lead.version = -1 * (lead.version + 1);
                        lead.updatedAt = now;
                        lead.isDeleted = true;
                        leadsRef.child(id).setWithPriority(lead, lead.date);
                    });
                } else {
                    console.log("MESAJ DE EROARE CA NU E LOGAT");
                }
            }
        }
    }])


    .factory('userService', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'syncData', function ($firebase, $firebaseSimpleLogin, firebaseRef, syncData) {
        var user = $firebaseSimpleLogin(firebaseRef());
        return {

            login: function (type, remember, userEmail, userPassword) {

                user.$login(type, {
                    rememberMe: false,
                    email: userEmail,
                    password: userPassword
                }).then(function (response) {
                        var userFBRef = firebaseRef('/users/' + btoa(user.user.email))
                            , currentDate = moment().format("YYYY-MM-DD-HH-mm-ss-SSS") + '-in'
                            ;
                        userFBRef.update({details: user.user});
                        userFBRef.child('logs').child(currentDate).update({action: 'login'});
                    });
                return user;

            },

            logout: function () {
                var currentDate = moment().format("YYYY-MM-DD-HH-mm-ss-SSS") + '-out'
                    , logRef = firebaseRef('/users/' + btoa(user.user.email) + '/logs/' + currentDate)
                    ;
                logRef.update({action: 'logout'});
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




//    .factory('userService', ['$firebase', '$firebaseSimpleLogin', 'fireUrl', function ($firebase, $firebaseSimpleLogin, fireUrl) {
//        var root = new Firebase(fireUrl+'/');
//        return {
//            leadAdd: function (newLead) {
//
//            }
//        }
//    }])
;