angular.module('app.controllers.ViewCtrl', [])
.controller('SearchCtrl', ['$scope', '$routeParams', 'history',
function (scope, route, history) {
  'use strict';

  scope.$on('delete', function (evt, urls) {
    var newItems = [];

    angular.forEach(scope.items, function (item) {
      if (urls.indexOf(item.url) < 0) {
        newItems.push(item);
      }
    });

    scope.items = newItems;
  });

  var searchText = decodeURIComponent(route.text);

  scope.title = searchText;
  scope.dateFormat = 'yyyy/MM/dd HH:mm';

  scope.lock();
  scope.setText(searchText);
  history.search(searchText).then(function (items) {
    scope.items = items;
    scope.unlock();
  });
}])
.controller('RecentCtrl', ['$scope', 'history',
function (scope, history) {
  'use strict';

  scope.$on('delete', function (evt, urls) {
    var newItems = [];

    angular.forEach(scope.items, function (item) {
      if (urls.indexOf(item.url) < 0) {
        newItems.push(item);
      }
    });

    scope.items = newItems;
  });

  scope.lock();

  if (scope.loaded) {
    get();
  } else {
    scope.$on('load', get);
  }

  function get() {
    history.getRecent(scope.config.range).then(function (items) {
      scope.items = items;
      scope.unlock();
    });
  }
}])
.controller('DateCtrl', ['$scope', '$routeParams', 'history',
function (scope, route, history) {
  'use strict';

  scope.$on('delete', function (evt, urls) {
    angular.forEach(scope.units, function (unit) {
      var newItems = [];

      angular.forEach(unit.items, function (item) {
        if (urls.indexOf(item.url) < 0) {
          newItems.push(item);
        }
      });

      unit.items = newItems;
    });
  });

  scope.title = route.date;
  scope.units = [];
  scope.getCount = function () {
    return scope.units.reduce(function (a, b) {
      return a + b.items.length;
    }, 0);
  };

  scope.lock();
  scope.setData(route.date);

  if (scope.loaded) {
    get();
  } else {
    scope.$on('load', get);
  }

  function get() {
    history.getDay(route.date, scope.config.split).then(function (units) {
      scope.units = units;
      scope.unlock();
    });
  }
}])
.controller('OptionCtrl', ['$scope', 'ranges', 'splits',
function (scope, ranges, splits) {
  'use strict';

  scope.lock();
  scope.ranges = ranges;
  scope.splits = splits;

  scope.$watch('config', function change() {
    chrome.storage.local.set(scope.config);
  }, true);
  scope.unlock();
}]);
