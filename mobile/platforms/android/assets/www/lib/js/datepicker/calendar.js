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
        scope: {
            event: '='
        },
        templateUrl: 'templates/datepicker/event.html',
        link: function (scope, elem, attrs) {
            console.log(event);
            elem.bind('click',function(event){
                console.log('clicked');
            })
        }

    }
});

Module.directive('calendar', function () {
    return {
        restrict: 'E',
        scope: true,
        template: function (element, attrs) {
            return ['<div date-picker ', (attrs.eventService ? 'event-service="' + attrs.eventService + '"' : ''), (attrs.view ? 'view="' + attrs.view + '" ' : 'view="date"'), (attrs.template ? 'template="' + attrs.template + '" ' : ''),
                'min-view="', (attrs.minView || 'date'), '"></div>'].join('');
        },
        link: function (scope) {
            scope.views = ['year', 'month', 'date'];
            scope.view = 'date';
        }
    };
});