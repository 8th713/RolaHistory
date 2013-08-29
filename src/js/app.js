angular.module('app.controllers', [
  'app.controllers.AppCtrl',
  'app.controllers.HeaderCtrl',
  'app.controllers.ViewCtrl'
]);

angular.module('app', [
  'ngRoute',
  'app.services',
  'app.directives',
  'app.controllers'
])
.config(['$compileProvider', '$routeProvider',
function ($compileProvider, $routeProvider) {
  'use strict';

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

  $routeProvider
    .when('/', {
      templateUrl: '/recent.html',
      controller: 'RecentCtrl'
    })
    .when('/search/:text', {
      templateUrl: '/search.html',
      controller: 'SearchCtrl'
    })
    .when('/date/:date', {
      templateUrl: '/date.html',
      controller: 'DateCtrl'
    })
    .when('/option', {
      templateUrl: '/option.html',
      controller: 'OptionCtrl'
    })
    .otherwise({redirectTo: '/'});
}]);
