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


;