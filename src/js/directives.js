angular.module('app.directives', [])
.directive('active', ['$location',
function activeFactory($location) {
  return function linkFn(scope, $el, attr) {
    var match = attr.active;

    function listener() {
      $el.toggleClass('active', $location.url() === match);
    }

    scope.$on('$routeChangeSuccess', listener);
  };
}])
.controller('DropdownCtrl', ['$animate','$document',
function DropdownCtrl(        $animate,  $document) {
  var ctrl = this;

  function open() {
    $animate.addClass(ctrl.element, 'open', function() {
      $document.on('click', close);
    });
  }

  function close() {
    $animate.removeClass(ctrl.element, 'open');
    $document.off('click', close);
  }

  function toggle() {
    if (ctrl.element.hasClass('open')) {
      close();
    } else {
      open();
    }
  }

  this.init = function init(element) {
    this.element = element;
  };

  this.add = function add(element) {
    this.toggleElement = element;
    this.toggleElement.on('click', toggle);
  };
}])
.directive('dropdown', [
function dropdownFactory() {
  return {
    restrict: 'C',
    controller: 'DropdownCtrl',
    link: function linkFn(scope, element, attr, ctrl) {
      ctrl.init(element);
    }
  };
}])
.directive('dropdownToggle', [
function dropdownToggleFactory() {
  return {
    require: '^dropdown',
    restrict: 'C',
    link: function linkFn(scope, element, attrs, ctrl) {
      ctrl.add(element);
    }
  };
}]);
