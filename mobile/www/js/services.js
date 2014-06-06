angular.module('caffeina.services', [])

    .factory('dmlservice', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'userService', '$q', function ($firebase, $firebaseSimpleLogin, firebaseRef, userService, $q) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , dmlService = {}
            ;

        dmlService._now = function () {
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
        };

        dmlService._add = function (fbRef, objToAdd, objPriority) {
            var now = dmlService._now()
                , newId = 0
                , promise = $q.defer()
                ;

            objToAdd.createdAt = now;
            objToAdd.updatedAt = now;
            objToAdd.version = 1;
            objToAdd.isDeleted = false;

            fbRef.child('counter').transaction(function (currValue) {
                return (currValue || 0) + 1;
            }, function (err, commited, identity) {
                if (err) {
                    promise.reject('Counter error');
                } else {
                    if (commited) {
                        newId = identity.val();
                        fbRef.child(newId).setWithPriority(objToAdd, objPriority, function () {
                            promise.resolve(newId);
                        });
                    } else {
                        promise.reject('Counter error (not commited)');
                    }
                }
            });
            return promise.promise;
        };

        dmlService._upd = function (fbRef, objToUpd, objId, objPriority) {
            var now = dmlService._now()
                , promise = $q.defer()
                ;
            fbRef.child(objId).once('value', function (objSnapshoot) {
                var dataSnapshoot = objSnapshoot.val()
                    ;
                if (dataSnapshoot) {
                    if (dataSnapshoot.isDeleted) {
                        promise.reject('_upd error: object is deleted')
                    } else {
                        objToUpd.createdAt = dataSnapshoot.createdAt ? dataSnapshoot.createdAt : now;
                        objToUpd.updatedAt = now;
                        objToUpd.version = (dataSnapshoot.version || 0) + 1;
                        objToUpd.isDeleted = false;
                        fbRef.child(objId).setWithPriority(objToUpd, objPriority, function () {
                            promise.resolve(objId);
                        });
                    }
                } else {
                    dmlService._add(fbRef, objToUpd, objPriority).then(function (newId) {
                        promise.resolve(newId);
                    }, function (error) {
                        promise.reject('_upd error: _add error');
                    })
                }
            });
            return promise.promise;
        };

        dmlService._del = function (fbRef, objId) {
            var now = dmlService._now()
                , promise = $q.defer()
                ;
            fbRef.child(objId).once('value', function (objSnapshoot) {
                var dataSnapshoot = objSnapshoot.val()
                    ;
                if (dataSnapshoot) {
                    if (dataSnapshoot.isDeleted) {
                        promise.reject('_del error: object already deleted');
                    } else {
                        dataSnapshoot.createdAt = dataSnapshoot.createdAt ? dataSnapshoot.createdAt : now;
                        dataSnapshoot.updatedAt = now;
                        dataSnapshoot.version = -((dataSnapshoot.version || 0) + 1);
                        dataSnapshoot.isDeleted = true;
                        fbRef.child(objId).setWithPriority(dataSnapshoot, dataSnapshoot.priority, function () {
                            promise.resolve(objId);
                        })
                    }
                } else {
                    promise.reject('_del error: object not found');
                }
            });
            return promise.promise;
        };

        dmlService._leadsFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/leads/');
        };

        dmlService._contactFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/contacts/');
        };

        dmlService.getContact = function (contact) {
            var promise = $q.defer()
                , contactId = (contact || {}).id ? contact.id : 0
                , contactRef = dmlService._contactFBRef()
                , newContact = {}
                ;
            contactRef.child(contactId).once('value', function (contactSnapshoot) {
                if (contactSnapshoot.val()) {
                    promise.resolve(contactId);
                } else {
                    newContact.name = contact.name ? contact.name : 'unknown';
                    if (contact.phone) newContact.phone = contact.phone;
                    if (contact.email) newContact.email = contact.email;
                    if (contact.details) newContact.details = contact.details;
                    dmlService._add(contactRef, newContact, newContact.name).then(function (newId) {
                        promise.resolve(newId);
                    });
                }
            });
            return promise.promise;
        };

        dmlService.setLead = function (lead) {
            var leadRef = dmlService._leadsFBRef()
                , newLead = {}
                ;
            if (user.user && user.user.email) {
                if (!(lead.contact)) {
                    lead.contact = {name: 'unknown'}
                }
                dmlService.getContact(lead.contact).then(function (contactId) {
                        newLead.contactId = contactId;
                        newLead.date = lead.date;
                        newLead.type = lead.type;
                        if (lead.details) newLead.details = lead.details;
                        if (lead.id) {
                            return dmlService._upd(leadRef, newLead, lead.id, lead.date);
                        } else {
                            return dmlService._add(leadRef, newLead, lead.date);
                        }
                    }
                ).then(function (leadId) {
                        //fixme: succes
                    }, function (error) {
                        //fixme: error
                    })
            }
            else {
                //fixme:
                console.log('setLead error: user not loged in');
            }
        };

        dmlService.delLead = function (leadId) {
            var leadRef = dmlService._leadsFBRef()
                ;
            if (user.user && user.user.email) {
                dmlService._del(leadRef, (leadId || 0));
            } else {
                //fixme: erori
                console.log('setLead error: user not loged in');
            }
        };

        return dmlService;
    }])
;