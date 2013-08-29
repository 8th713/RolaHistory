angular.module('app.services', [])
.value('config', {
  range: 60,
  split: 30
})
.value('ranges', [15, 30, 60, 120, 180, 240, 360])
.value('splits', [15, 30, 60, 120, 180, 240])
.filter('hour', [function () {
  return function (value) {
    var h = value / 60;

    return value == 15 ? 'quarter-hour' :
           value == 30 ? 'half-hour' :
           value == 60 ? (h + 'hour') :
                         (h + 'hours');
  };
}])
.factory('history', ['$rootScope', '$q', function (scope, $q) {
  'use strict';

  var MIN = 60 * 1000;
  var HOUR = 60 * MIN;
  // var DAY = 24 * HOUR;
  var MAX = 1000;
  var history = chrome.history;

  var anc = document.createElement('a');

  function createCallback(dfd) {
    return function (items) {
      items.map(function (item) {
        anc.href = item.url;
        item.origin = anc.origin;
        return item;
      });
      scope.$apply(function () {
        dfd.resolve(items);
      });
    };
  }

  return {
    getRange: function (range) {
      var options = angular.extend({
        text: '',
        maxResults: MAX
      }, range);
      var dfd = $q.defer();

      history.search(options, createCallback(dfd));
      return dfd.promise;
    },
    search: function (text) {
      var options = {
        text: text,
        maxResults: MAX
      };
      var dfd = $q.defer();

      history.search(options, createCallback(dfd));
      return dfd.promise;
    },
    getDay: function (date, period) {
      date = +new Date(date.replace(/-/g, '/'));
      period = period * MIN;

      var units = [];
      var promises = [];
      var end = date + 24 * HOUR;
      var range;

      for (; end > date; end -= period) {
        range = {
          endTime: end,
          startTime: end - period
        };
        units.push(range);
        promises.push(this.getRange(range));
      }

      return $q.all(promises).then(function (values) {
        angular.forEach(values, function (items, index) {
          units[index].items = items;
        });
        return units;
      });
    },
    getRecent: function (minutes) {
      var ms = minutes * MIN;
      var options = {
        text: '',
        startTime: Date.now() - ms,
        maxResults: 1000
      };
      var dfd = $q.defer();

      history.search(options, createCallback(dfd));
      return dfd.promise;
    }
  };
}]);
