angular.module('caffeina.directives', ['$ionicGesture'])

//
//    .directive('calendarSwipe', function($ionicGesture, $state) {
//        return {
//            restrict : 'A',
//            link : function(scope, elem, attr) {
//
//                $ionicGesture.on('swipe', function(event) {
//
//                    console.log('Got swiped!');
//                    event.preventDefault();
//                    window.history.back();
//
//                }, elem);
//
//            }
//
//        }
//    })


app.directive('input', function ($parse) {
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function (scope, element, attrs) {
            if (attrs.ngModel && attrs.value) {
                $parse(attrs.ngModel).assign(scope, attrs.value);
            }
        }
    };
});