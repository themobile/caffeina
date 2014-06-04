angular.module('caffeina.services.contact', [])

    .factory('contacts', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'userService', '$q', function ($firebase, $firebaseSimpleLogin, firebaseRef, userService, $q) {
        var user = $firebaseSimpleLogin(firebaseRef())
            , contactRet = {}
            ;

        contactRet._now = function () {
            return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
        };

        contactRet._contactFBRef = function () {
            return firebaseRef('/users/' + btoa(user.user.email) + '/contacts/');
        };

        contactRet._setContact = function (contact) {
            var contactRef = contactRet._contactFBRef()
                , newContact = {}
                , now = contactRet._now()
                , newId = 0
                , promise = $q.defer()
                , contactId = (contact || {}).id ? contact.id : 0
                ;

            contactRef.child(contactId).once('value', function (contactSnapshoot) {
                if (contactSnapshoot.val()) {
                    promise.resolve(contactId);
                } else {
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
                }
            });
            return promise.promise;
        };

        return contactRet;
    }]);