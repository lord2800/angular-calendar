/* global mod */

mod.directive('calendar', function ($locale) {
	return {
		restrict: 'E',
		templateUrl: 'calendar.tmpl',
		scope: { 'for': '=', options: '=', onClick: '=' },
		link: function (scope) {
			scope.$watch('for', function () {
				var date = scope['for'];
				var start = (date instanceof Date && new Date(date.getTime())) || new Date();
				start.setDate(1);
				var nextMonth = (start.getMonth() + 1) % 12;

				scope.month = $locale.DATETIME_FORMATS.MONTH[start.getMonth()];
				scope.year = start.getFullYear();
				scope.days = $locale.DATETIME_FORMATS.DAY;

				scope.weeks = [ { days: [] } ];

				var week = scope.weeks[0];

				do {
					if(start.getDay() === 0 && start.getDate() !== 1) {
						week = { days: [] };
						scope.weeks.push(week);
					}
					week.days[start.getDay()] = start.getDate();

					start.setDate(start.getDate()+1);
				} while(start.getMonth() !== nextMonth);
				while(week.days.length < 7) {
					week.days.push(undefined);
				}
			});

			var currentDay = 0;

			scope.clickDay = function (day) {
				if(day !== undefined) {
					currentDay = day;
					if(angular.isFunction(scope.onClick)) {
						scope.onClick(day);
					}
				}
			};
			scope.isSelected = function (day) {
				return currentDay === day;
			};
		}
	};
});
