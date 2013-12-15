/* global mod */

mod.directive('calendar', function ($locale) {
	return {
		restrict: 'E',
		templateUrl: 'calendar.tmpl',
		scope: { 'for': '=', options: '=', click: '=' },
		link: function (scope) {
			scope.$watch('for', function () {
				var start = scope['for'] && new Date(scope['for'].getTime()) || new Date();
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
		}
	};
});
