angular.module('caffeina.services', [])

    .factory('leads', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'userService', '$q', function ($firebase, $firebaseSimpleLogin, firebaseRef, userService, $q) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , leadsRet = {}
            ;

        leadsRet._now = function () {
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
        };

        leadsRet._leadsFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/leads/');
        };

        leadsRet._contactFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/contacts/');
        };

        leadsRet._addContact = function (contact) {
            var contactRef = this._contactFBRef()
                , newContact = {}
                , now = leadsRet._now()
                , newId = 0
                , promise = $q.defer()
                ;
            contactRef.child('counter').transaction(function (currValue) {
                return (currValue || 0) + 1;
            }, function (err, commited, identity) {
                if (err) {
                    //fixme: eroare
                    promise.reject({});
                } else {
                    if (commited) {

                        newId = identity.val();

                        newContact.name = contact.name;
                        newContact.phone = contact.phone;
                        newContact.email = contact.email;

                        newContact.cratedAt = now;
                        newContact.updatedAt = now;
                        newContact.version = 1;
                        newContact.isDeleted = false;

                        contactRef.child(newId).setWithPriority(newContact, newContact.name, function () {
                            promise.resolve(newId);
                        });

                    } else {
                        //fixme: eroare
                        promise.reject({});
                    }
                }
            });
            return promise.promise;
        };

        leadsRet._addLead = function (lead) {
            var leadsRef = this._leadsFBRef()
                , promise = $q.defer()
                , now = leadsRet._now()
                , newId = 0
                ;
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

                        lead.createdAt = now;
                        lead.updatedAt = now;
                        lead.version = 1;
                        lead.isDeleted = false;

                        leadsRef.child(identity.val()).setWithPriority(lead, lead.date, function () {
                            promise.resolve(newId);
                        });
                    }
                }
            });
            return promise.promise;
        };


        leadsRet.add = function (lead) {
            if (user.user && user.user.email) {
                var leadsRef = this._leadsFBRef()
                    , contactRef = this._contactFBRef()
                    , contactId
                    , leadToSave = {}
                    ;

                contactId = lead.contact ? lead.contact.id ? lead.contact.id : 0 : 0;

                contactRef.child(contactId).once('value', function (contactSnapshoot) {
                    if (contactSnapshoot.val()) {
                        leadsRet._addLead({
                            contactId: contactId,
                            date: lead.date,
                            title: lead.title
                        });
                    } else {
                        leadsRet._addContact(lead.contact).then(function (contactAdded) {
                            return leadsRet._addLead({
                                contactId: contactAdded,
                                date: lead.date,
                                title: lead.title
                            });
                        }).then(function (hihi) {
                                console.log(" AM adaugat lead-ul ");
                            }, function (error) {

                            });
                    }
                });

            } else {
                //fixme: erori
                console.log("MESAJ DE EROARE CA NU E LOGAT");
            }
        };


        return leadsRet;
        // public
//            update: function (id, lead) {
//                if (user.user && user.user.email) {
//                    var leadsRef = this._leadsFBRef()
//                        , now = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
//                        ;
//                    leadsRef.child(id).once('value', function (dataSnapshoot) {
//                        if (dataSnapshoot.val()) {
//                            lead.createdAt = dataSnapshoot.val().createdAt;
//                            lead.version = dataSnapshoot.val().version + 1;
//                            lead.updatedAt = now;
//                            lead.isDeleted = false;
//                            leadsRef.child(id).setWithPriority(lead, lead.date);
//                        } else {
//                            //fixme: erori
//                            console.log("MESAJ DE EROARE ca LEAD-ul ASTA NU EXISTA");
//                        }
//                    });
//                } else {
//                    //fixme: erori
//                    console.log("MESAJ DE EROARE CA NU E LOGAT");
//                }
//            },
//
//            remove: function (id) {
//                if (user.user && user.user.email) {
//                    var leadsRef = firebaseRef('/users/' + btoa(user.user.email) + '/leads/')
//                        , now = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
//                        , lead
//                        ;
//                    leadsRef.child(id).once('value', function (dataSnapshoot) {
//                        lead = dataSnapshoot.val();
//                        lead.version = -1 * (lead.version + 1);
//                        lead.updatedAt = now;
//                        lead.isDeleted = true;
//                        leadsRef.child(id).setWithPriority(lead, lead.date);
//                    });
//                } else {
//                    console.log("MESAJ DE EROARE CA NU E LOGAT");
//                }
//            }
//        }
    }])


;