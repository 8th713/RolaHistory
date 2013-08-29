angular.module('app.controllers.HeaderCtrl', [])
.controller('RecentMenuCtrl', ['$filter', function (filter) {
  'use strict';

  var DAY = 24 * 60 * 60 * 1000;
  var format = filter('date');
  var now = Date.now();

  this.date = [
    {title: 'Today'},
    {title: 'Yesterday'},
    {title: '2 days ago'},
    {title: '3 days ago'},
    {title: '4 days ago'},
    {title: '5 days ago'},
    {title: '6 days ago'},
    {title: '7 days ago'}
  ];

  for(var i = 0, l = this.date.length; i < l; i++) {
    this.date[i].date = (format(now - DAY * i, 'yyyy-MM-dd'));
  }
}])
.controller('DeleteCtrl', ['$scope', '$filter', function (scope, filter) {
  'use strict';

  var format = filter('date');

  scope.delRange = function (range, evt) {
    evt.preventDefault();
    evt.stopPropagation();
    $(evt.target.parentNode).dropdown('toggle');

    var endTime = evt.timeStamp - (range * 24 * 60 * 60 * 1000);
    var endText = format(endTime, 'yyyy/MM/dd HH:mm:ss');
    var isExecute = window.confirm(endText + 'より古い履歴を削除します。');

    if (isExecute) {
      scope.lock();
      chrome.history.deleteRange({
        startTime: 0,
        endTime: endTime
      }, function () {
        scope.$apply('unlock()');
      });
    }
  };
}]);
