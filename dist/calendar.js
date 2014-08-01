(function () {
  'use strict';
  var mod = angular.module('jh.calendar', []);
  mod.directive('calendar', [
    '$locale',
    function ($locale) {
      return {
        restrict: 'E',
        templateUrl: 'calendar.tmpl',
        scope: {
          'for': '=',
          options: '=',
          onClick: '&',
          activeDay: '&',
          activeWeek: '&'
        },
        link: function (scope) {
          scope.$watch('for', function () {
            var date = scope['for'];
            var start = date instanceof Date && new Date(date.getTime()) || new Date();
            start.setDate(1);
            var nextMonth = (start.getMonth() + 1) % 12;
            scope.days = {};
            if (angular.isDefined(scope.options)) {
              scope.month = scope.options.shortmonth ? $locale.DATETIME_FORMATS.SHORTMONTH[start.getMonth()] : $locale.DATETIME_FORMATS.MONTH[start.getMonth()];
              if (scope.options.supershortday) {
                angular.forEach($locale.DATETIME_FORMATS.SHORTDAY, function (value, key) {
                  scope.days[key] = value.substring(0, 2);
                });
              } else {
                scope.days = scope.options.shortday ? $locale.DATETIME_FORMATS.SHORTDAY : $locale.DATETIME_FORMATS.DAY;
              }
            } else {
              scope.month = $locale.DATETIME_FORMATS.MONTH[start.getMonth()];
              scope.days = $locale.DATETIME_FORMATS.DAY;
            }
            scope.year = start.getFullYear();
            scope.weeks = [{ days: [] }];
            var week = scope.weeks[0];
            do {
              if (start.getDay() === 0 && start.getDate() !== 1) {
                week = { days: [] };
                scope.weeks.push(week);
              }
              week.days[start.getDay()] = start.getDate();
              start.setDate(start.getDate() + 1);
            } while (start.getMonth() !== nextMonth);
            while (week.days.length < 7) {
              week.days.push(undefined);
            }
          });
          scope.clickDay = function (day) {
            if (day !== undefined) {
              return scope.onClick({ day: day });
            }
          };
          scope.isDayActive = function (day) {
            return scope.activeDay({ day: day });
          };
          scope.isWeekActive = function (week) {
            return scope.activeWeek({ week: week });
          };
        }
      };
    }
  ]);
  var calendarTemplate = [
      '<div class="calendar">',
      '<div class="header">{{month}} {{year}}</div>',
      '<div class="week-header">',
      '<span ng-repeat="day in days track by $index" class="day-name" ng-class="{first: $first, last: $last}">{{day}}</span>',
      '</div>',
      '<div class="calendar-body">',
      '<div ng-repeat="week in weeks track by $index" class="week" ng-class="{first: $first, last: $last, odd: $odd, even: $even, active: isWeekActive($index+1)}">',
      '<span ng-repeat="day in week.days track by $index" class="day" ng-class="{first: $first, last: $last, active: isDayActive(day)}" ng-click="clickDay(day)">{{day}}&nbsp;</span>',
      '</div>',
      '</div>',
      '</div>'
    ].join('\n');
  mod.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('calendar.tmpl', calendarTemplate);
    }
  ]);
}());