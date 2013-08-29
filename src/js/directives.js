angular.module('app.directives', [])
.directive('active', ['$location', function (location) {
  'use strict';

  return function (scope, $el, attrs) {
    var match = attrs.active;

    scope.$on('$routeChangeSuccess', function () {
      $el.toggleClass('active', location.url() === match);
    });
  };
}]);
