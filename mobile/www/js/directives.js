angular.module('caffeina.directives', [])



    .directive('input', function ($parse) {
        return {
            restrict: 'E',
            require: '?ngModel',
            link: function (scope, element, attrs) {
                if (attrs.ngModel && attrs.value) {
                    $parse(attrs.ngModel).assign(scope, attrs.value);
                }
            }
        };
    })


    .directive('detectGestures', function ($ionicGesture) {
        return {
            restrict: 'A',

            link: function (scope, elem, attrs) {
                var gestureType = attrs.gestureType;

                switch (gestureType) {
                    case 'swipe':
                        $ionicGesture.on('swipe', scope.reportEvent, elem);
                        break;
                    case 'swiperight':
                        $ionicGesture.on('swiperight', scope.reportEvent, elem);
                        break;
                    case 'swipeleft':
                        $ionicGesture.on('swipeleft', scope.reportEvent, elem);
                        break;
                    case 'doubletap':
                        $ionicGesture.on('doubletap', scope.reportEvent, elem);
                        break;
                    case 'tap':
                        $ionicGesture.on('tap', scope.reportEvent, elem);
                        break;
                }

            }
        }
    });