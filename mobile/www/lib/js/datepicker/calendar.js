var Module = angular.module('calevents', []);

/**
 * This is default events provider. You can implement your own and
 * pass it's name to the <calendar event-service> attribute.
 * Data structure is for calendarEventService.setEvents is:
 * [
 *  { start: Date or timestamp,
      title: 'test'
 *      // anything else you want to render
 *  },
 *  // repeat
 * ]
 */
Module.provider('CalendarEvents', function () {
    var calendarEvents = {};
    return {
        $get: function ($rootScope) {
            return {
                setEvents: function (events) {
                    calendarEvents = {};
                    for (var i = 0; i < events.length; i++) {
                        //
                        var date = new Date(events[i].date).toDateString();
                        if (!(date in calendarEvents)) {
                            calendarEvents[date] = [];
                        }
                        calendarEvents[date].push(events[i]);
                    }
                    $rootScope.$broadcast('calendar:events', events);
                },
                hasEvent: function (date) {
                    return (new Date(date).toDateString() in calendarEvents);
                },
                getEvents: function (date) {
                    var date = new Date(date).toDateString();
                    return calendarEvents[date];
                }
            }
        }
    }
});


Module.directive('calendarEvent', function () {
    return {
        restrict: 'E',
//        scope: {
//            event: '='
//        },
        scope:true,
        templateUrl: 'templates/datepicker/event.html',
        link: function (scope, elem, attrs) {

            //find out event types for each day in order to construct class for event color on calendar
            //attrs.event comes with double quoting (??!)
            var dat=moment(attrs.event.replace(/"/g,"")).format('YYYY-MM-DD');
            var eventType= _.pluck(_.pluck(scope.getEvents(dat),'jobObject'),'type');
                console.log('date:'+dat+' type: '+eventType[0]);
            scope.eventType=eventType[0];
        }

    }
});

Module.directive('calendar', ['$animate','$timeout',function ($animate,$timeout) {
    return {
        restrict: 'E',
        scope: true,
        template: function (element, attrs) {
            return [
                '<div date-picker '
                , (attrs.eventService ? 'event-service="' + attrs.eventService + '"' : '')
                , (attrs.view ? 'view="' + attrs.view + '" ' : 'view="date"')
                , (attrs.template ? 'template="' + attrs.template + '" ' : '')
                , 'min-view="', (attrs.minView || 'date'), '"></div>'
            ].join('');
        },
        link: function (scope,element,attrs) {
            scope.views = ['year', 'month', 'date'];
            scope.view = 'date';



        }
    };
}]);