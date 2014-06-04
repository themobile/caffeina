angular.module('caffeina.services.lead', [])
    .factory('leads', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'userService', 'contacts', '$q', function ($firebase, $firebaseSimpleLogin, firebaseRef, userService, contacts, $q) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , leadsServiceReturn = {}
            ;

        leadsServiceReturn._now = function () {
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
        };

        leadsServiceReturn._leadsFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/leads/');
        };

        leadsServiceReturn._delLead = function (leadId) {
            var leadsRef = leadsServiceReturn._leadsFBRef()
                , promise = $q.defer()
                , now = leadsServiceReturn._now()
                , lead4Del = {}
                , lead
                ;

            leadsRef.child(leadId).once('value', function (leadSnapshoot) {
                lead4Del.updatedAt = now;
                lead4Del.isDeleted = true;
                lead = leadSnapshoot.val();
                if (lead) {

                    if (lead.isDeleted) {
                        //fixme: refuz sa sterg ceva deja sters
                        promise.reject({});
                    } else {
                        lead4Del.date = lead.date;
                        lead4Del.title = lead.title;
                        lead4Del.contactId = lead.contactId;

                        lead4Del.createdAt = lead.createdAt;
                        lead4Del.version = -1 * (lead.version + 1);

                        leadsRef.child(leadId).setWithPriority(lead4Del, lead4Del.date, function () {
                            promise.resolve(leadId);
                        });
                    }
                } else {
                    //fixme: eroare ca n-am gasit lead-ul de sters
                    promise.reject({});
                }
            });
            return promise.promise;
        };

        leadsServiceReturn._setLead = function (lead) {
            var leadsRef = leadsServiceReturn._leadsFBRef()
                , promise = $q.defer()
                , now = leadsServiceReturn._now()
                , newId = 0
                , leadId = (lead || {}).id ? lead.id : 0
                , lead4Set = {}
                , leadFB
                ;

            leadsRef.child(leadId).once('value', function (leadSnapshoot) {

                lead4Set.updatedAt = now;
                lead4Set.isDeleted = false;

                lead4Set.date = lead.date;
                lead4Set.title = lead.title;
                lead4Set.contactId = lead.contactId;

                leadFB = leadSnapshoot.val();

                if (leadFB) {

                    if (leadFB.isDeleted) {
                        //fixme: refuz modificare lead sters
                        promise.reject({})
                    } else {
                        lead4Set.createdAt = leadFB.createdAt;
                        lead4Set.version = leadFB.version + 1;

                        leadsRef.child(leadId).setWithPriority(lead4Set, lead4Set.date, function () {
                            promise.resolve(leadId);
                        });
                    }


                } else {

                    lead4Set.createdAt = now;
                    lead4Set.version = 1;

                    leadsRef.child('counter').transaction(function (currentValue) {
                        return (currentValue || 0) + 1;
                    }, function (err, commited, identity) {
                        if (err) {
                            //fixme: eroare
                            promise.reject({});
                        }
                        else {
                            if (commited) {
                                newId = identity.val();
                                leadsRef.child(newId).setWithPriority(lead4Set, lead4Set.date, function () {
                                    promise.resolve(newId);
                                });
                            }
                        }
                    });
                }
            });
            return promise.promise;
        };

        leadsServiceReturn.setLead = function (lead) {
            if (user.user && user.user.email) {

                contacts._setContact(lead.contact).then(function (contactId) {
                    return leadsServiceReturn._setLead({
                        id: lead.id,
                        contactId: contactId,
                        date: lead.date,
                        title: lead.title
                    });
                }).then(function (leadId) {
                        //fixme: success

                    }, function (error) {
                        //fixme: eroare

                    });
            } else {
                //fixme: erori
                console.log("MESAJ DE EROARE CA NU E LOGAT");
            }
        };

        leadsServiceReturn.delLead = function (leadId) {
            if (user.user && user.user.email) {
                leadsServiceReturn._delLead((leadId || 0));
            } else {
                //fixme: erori
                console.log("MESAJ DE EROARE CA NU E LOGAT");
            }
        };

        return leadsServiceReturn;
    }]);