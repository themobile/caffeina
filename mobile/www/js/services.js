angular.module('caffeina.services', [])


    .constant('fireUrl', 'https://caffeina.firebaseio.com')


    .factory('leads', ['$firebase', 'firebaseRef', 'userService', function ($firebase, firebaseRef, userService) {


        return {

            get: function () {

            },

            getAllMonth: function (year, month) {
                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/');
                var startDate = moment(year.toString() + '-' + month.toString() + '-01').format('YYYY-MM-DD');
                var endDate = moment(startDate).add('month', 1).add('day', -1).format('YYYY-MM-DD');
//                var leadsMonth=leadsRef.startAt(moment().valueOf(startDate)).endAt(moment().valueOf(endDate));
                var leadsMonth = leadsRef.startAt(startDate).endAt(endDate);
                return leadsMonth;
            },

            add: function (lead) {
                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/');
                leadsRef.push(lead).setPriority(lead.date);
            },

            update: function (lead, leadId) {
                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/' + leadId);
                leadsRef.update(lead);
                leadsRef.setPriority(lead.date);
            },

            remove: function (leadId) {
                var leadsRef = firebaseRef('/users/' + userService.getUserId() + '/leads/' + leadId).remove();
            }



        }


    }])


    .factory('userService', ['$firebase', '$firebaseSimpleLogin', 'firebaseRef', 'syncData', function ($firebase, $firebaseSimpleLogin, firebaseRef, syncData) {
//        var ref = new firebaseRef;
        var user = $firebaseSimpleLogin(firebaseRef());
        return {

            login: function (type, remember, userEmail, userPassword) {

                user.$login(type, {
                    rememberMe: remember,
//                    scope: 'email,user_likes',
                    email: userEmail,
                    password: userPassword
                }).then(function (response) {

                        var ev = [
                            {'title': 'start 2014-03-06 este start evenimentului', 'start': '2014-03-06'},
                            {'title': 'start 2014-03-21 este start evenimentului', 'start': '2014-03-21'},
                            {'title': 'start 2014-01-04 este start evenimentului', 'start': '2014-01-04'},
                            {'title': 'start 2014-02-08 este start evenimentului', 'start': '2014-02-08'},
                            {'title': 'start 2014-02-20 este start evenimentului', 'start': '2014-02-20'},
                            {'title': 'start 2014-01-04 este start evenimentului', 'start': '2014-01-04'},
                            {'title': 'start 2014-02-21 este start evenimentului', 'start': '2014-02-21'},
                            {'title': 'start 2014-02-28 este start evenimentului', 'start': '2014-02-28'},
                            {'title': 'start 2014-01-19 este start evenimentului', 'start': '2014-01-19'},
                            {'title': 'start 2014-01-12 este start evenimentului', 'start': '2014-01-12'},
                            {'title': 'start 2014-02-23 este start evenimentului', 'start': '2014-02-23'},
                            {'title': 'start 2014-03-27 este start evenimentului', 'start': '2014-03-27'},
                            {'title': 'start 2014-03-11 este start evenimentului', 'start': '2014-03-11'},
                            {'title': 'start 2014-02-22 este start evenimentului', 'start': '2014-02-22'},
                            {'title': 'start 2014-01-13 este start evenimentului', 'start': '2014-01-13'},
                            {'title': 'start 2014-01-02 este start evenimentului', 'start': '2014-01-02'},
                            {'title': 'start 2014-01-27 este start evenimentului', 'start': '2014-01-27'},
                            {'title': 'start 2014-03-19 este start evenimentului', 'start': '2014-03-19'},
                            {'title': 'start 2014-01-16 este start evenimentului', 'start': '2014-01-16'},
                            {'title': 'start 2014-01-28 este start evenimentului', 'start': '2014-01-28'},
                            {'title': 'start 2014-02-20 este start evenimentului', 'start': '2014-02-20'},
                            {'title': 'start 2014-03-24 este start evenimentului', 'start': '2014-03-24'},
                            {'title': 'start 2014-01-20 este start evenimentului', 'start': '2014-01-20'},
                            {'title': 'start 2014-01-10 este start evenimentului', 'start': '2014-01-10'},
                            {'title': 'start 2014-03-28 este start evenimentului', 'start': '2014-03-28'},
                            {'title': 'start 2014-01-24 este start evenimentului', 'start': '2014-01-24'},
                            {'title': 'start 2014-03-12 este start evenimentului', 'start': '2014-03-12'},
                            {'title': 'start 2014-02-15 este start evenimentului', 'start': '2014-02-15'},
                            {'title': 'start 2014-02-26 este start evenimentului', 'start': '2014-02-26'},
                            {'title': 'start 2014-01-04 este start evenimentului', 'start': '2014-01-04'}
                        ];
                        var caffData = firebaseRef('/users/' + btoa(user.user.email));
//                        _.each(ev, function(elem){
//                            var k=caffData.child('leads').push(elem);
//                            k.setPriority(moment().valueOf(elem.start));
//                        })

                        caffData.update({details: user.user});


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