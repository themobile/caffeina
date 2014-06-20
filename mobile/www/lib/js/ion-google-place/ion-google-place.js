angular.module('ion-google-place', [])
    .directive('ionGooglePlace', [
        '$ionicTemplateLoader',
        '$ionicBackdrop',
        '$q',
        '$timeout',
        '$rootScope',
        '$document',
        function ($ionicTemplateLoader, $ionicBackdrop, $q, $timeout, $rootScope, $document) {
            return {
                require: '?ngModel',
                restrict: 'E',
                template: '<input type="text" readonly="readonly" class="ion-google-place" autocomplete="off">',
                replace: true,
                link: function (scope, element, attrs, ngModel) {
                    scope.locations = [];
//                    var geocoder = new google.maps.Geocoder();
                    var searchEventTimeout = undefined;


                    var POPUP_TPL = [
                        '<div class="ion-google-place-container">',
                        '<div class="bar bar-header item-input-inset">',
                        '<label class="item-input-wrapper">',
                        '<i class="icon ion-ios7-search placeholder-icon"></i>',
                        '<input class="google-place-search" type="search" ng-model="searchQuery" placeholder="Enter an address, place or ZIP code">',
                        '</label>',
                        '<button class="button button-clear">',
                        'Cancel',
                        '</button>',
                        '</div>',
                        '<ion-content class="has-header has-header">',
                        '<ion-list>',
                        '<ion-item ng-repeat="location in locations" type="item-text-wrap" ng-click="selectLocation(location)">',
                        '{{location.description}}',
                        '</ion-item>',
                        '</ion-list>',
                        '</ion-content>',
                        '</div>'
                    ].join('');

                    var popupPromise = $ionicTemplateLoader.compile({
                        template: POPUP_TPL,
                        scope: scope,
                        appendTo: $document[0].body
                    });

                    popupPromise.then(function (el) {
                        var options = {
                            types: [],
                            componentRestrictions: {}
                        };
//                        var tt=new google.maps.places.AutocompleteService();
                        var searchInputElement = angular.element(el.element.find('input'));
                        var mm = new google.maps.places.Autocomplete(searchInputElement[0]);

                        scope.selectLocation = function (location) {
                            ngModel.$setViewValue({name:location.name,formatted_address:location.formatted_address,geometry:location.geometry});
                            ngModel.$render();
                            el.element.css('display', 'none');
                            $ionicBackdrop.release();
                        };


                        google.maps.event.addListener(mm, 'place_changed', function () {
                            scope.selectLocation(mm.getPlace());
//
                        });


                        scope.$watch('searchQuery', function (query) {
                            if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                            searchEventTimeout = $timeout(function () {
                                if (!query) return;
                                if (query.length<3);


                                //
//                                    with getplacepredictions

//                                tt.getPlacePredictions({input:query}, function (results, status) {
////                                    if (status == google.maps.GeocoderStatus.OK) {
//                                        scope.$apply(function () {
////                                            results.push({description: scope.searchQuery});
//                                            scope.locations = results;
//                                        });
////                                    } else {
////                                        // push to list the query
////                                        scope.$apply(function () {
////                                            results.push({formatted_address: scope.searchQuery, isgoogled: false, address_components: {0: {long_name: scope.searchQuery, short_name: scope.searchQuery}}});
////                                            scope.locations = results;
////                                        });
////                                    }
//                                });


//
//                                geocoder.geocode({ address: query }, function (results, status) {
//                                    if (status == google.maps.GeocoderStatus.OK) {
//                                        scope.$apply(function () {
//                                            results.push({formatted_address: scope.searchQuery});
//                                            scope.locations = results;
//                                        });
//                                    } else {
//                                        // push to list the query
//                                        scope.$apply(function () {
//                                            results.push({formatted_address: scope.searchQuery, isgoogled: false, address_components: {0: {long_name: scope.searchQuery, short_name: scope.searchQuery}}});
//                                            scope.locations = results;
//                                        });
//                                    }
//                                });
                            }, 350); // we're throttling the input by 350ms to be nice to google's API
                        });

                        var onClick = function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $ionicBackdrop.retain();
                            el.element.css('display', 'block');
                            searchInputElement[0].focus();
                            setTimeout(function () {
                                searchInputElement[0].focus();
                            }, 0);
                        };

                        var onCancel = function (e) {
                            scope.searchQuery = '';
                            $ionicBackdrop.release();
                            el.element.css('display', 'none');
                        };

//                        element.bind('click', onClick);
                        element.bind('touchend', onClick);

                        el.element.find('button').bind('click', onCancel);
                    });

                    if (attrs.placeholder) {
                        element.attr('placeholder', attrs.placeholder);
                    }


                    ngModel.$formatters.unshift(function (modelValue) {
                        if (!modelValue) return '';
                        return modelValue;
                    });

                    ngModel.$parsers.unshift(function (viewValue) {
                        return viewValue;
                    });

                    ngModel.$render = function () {
                        if (!ngModel.$viewValue) {
                            element.val('');
                        } else {
//                            element.val(ngModel.$viewValue.formatted_address || '');
                            element.val(ngModel.$viewValue.name || '');
                        }
                    };
                }
            };
        }
    ]);