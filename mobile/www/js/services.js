angular.module('caffeina.services', [])


    .constant('fireUrl', 'https://caffeina.firebaseio.com')


    .factory('leads', ['$firebase', 'firebaseRef', 'userService', function ($firebase, firebaseRef, userService) {


        return {

//            get: function () {
//
//            },
//
//            getAllMonth: function (year, month) {
//                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/');
//                var startDate = moment(year.toString() + '-' + month.toString() + '-01').format('YYYY-MM-DD');
//                var endDate = moment(startDate).add('month', 1).add('day', -1).format('YYYY-MM-DD');
////                var leadsMonth=leadsRef.startAt(moment().valueOf(startDate)).endAt(moment().valueOf(endDate));
//                var leadsMonth = leadsRef.startAt(startDate).endAt(endDate);
//                leadsMonth.once('value', function(dataSnapShot){
//                    console.log('asdas');
//                })
//            },
//
//            add: function (lead) {
//                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/');
//                leadsRef.push(lead).setPriority(lead.date);
//            },
//
//            update: function (lead, leadId) {
//                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/' + leadId);
//                leadsRef.update(lead);
//                leadsRef.setPriority(lead.date);
//            },
//
//            remove: function (leadId) {
//                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/' + leadId).remove();
//            }
//


        }


    }])


    .factory('userService', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'syncData', function ($firebase, $firebaseSimpleLogin, firebaseRef, syncData) {
//        var ref = new firebaseRef;
        var user = $firebaseSimpleLogin(firebaseRef());
        return {

            login: function (type, remember, userEmail, userPassword) {

                user.$login(type, {
                    rememberMe: false,
                    email: userEmail,
                    password: userPassword
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




//    .factory('userService', ['$firebase', '$firebaseSimpleLogin', 'fireUrl', function ($firebase, $firebaseSimpleLogin, fireUrl) {
//        var root = new Firebase(fireUrl+'/');
//        return {
//            leadAdd: function (newLead) {
//
//            }
//        }
//    }])
;