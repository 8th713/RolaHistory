angular.module('app.controllers.AppCtrl', [])
.controller('AppCtrl', ['$scope', '$location', 'config',
function (scope, location, config) {
  'use strict';

  scope.config = config;
  scope.loaded = false;
  scope.locked = true;
  scope.dateFormat = 'HH:mm';

  scope.search = function () {
    var str = encodeURIComponent(scope.searchText);

    if (str) {
      location.path('search/' + str);
    }
  };
  scope.setText = function (text) {
    scope.searchText = text;
  };

  scope.changeDate = function () {
    if (scope.dateText) {
      location.path('date/' + scope.dateText);
    }
  };
  scope.setData = function (date) {
    scope.dateText = date;
  };

  scope.lock = function () {
    scope.locked = true;
  };
  scope.unlock = function () {
    scope.locked = false;
  };

  scope.delItem = function () {
    var url = this.item.url;

    scope.lock();
    chrome.history.deleteUrl({url: url}, function () {
      scope.$apply(function () {
        scope.$broadcast('delete', [url]);
        scope.unlock();
      });
    });
  };

  scope.selectedItems = [];

  scope.$on('$routeChangeStart', function () {
    scope.selectedItems = [];
  });

  scope.change = function () {
    var index = scope.selectedItems.indexOf(this.item.url);

    if (index < 0) {
      scope.selectedItems.push(this.item.url);
    } else {
      scope.selectedItems.splice(index, 1);
    }
  };
  scope.isDisabled = function () {
    return !scope.selectedItems.length;
  };
  scope.deleteSelected = function () {
    var max = scope.selectedItems.length;
    var dones = [];

    scope.lock();
    scope.selectedItems.map(function (url) {
      chrome.history.deleteUrl({url: url}, function () {
        dones.push(url);
      });
    });

    var timer = setInterval(function () {
      if (dones.length === max) {
        clearInterval(timer);
        scope.$apply(function () {
          scope.selectedItems = [];
          scope.$broadcast('delete', dones);
          scope.unlock();
        });
      }
    }, 200);
  };

  chrome.storage.local.get(null, function (items) {
    scope.$apply(function () {
      scope.config = angular.extend({}, config, items);
      scope.loaded = true;
      scope.$broadcast('load');
    });
  });
}]);
