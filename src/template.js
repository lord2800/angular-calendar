/* global mod */

var calendarTemplate = [
	'<div class="calendar">',
		'<div class="header">{{month}} {{year}}</div>',
		'<div class="week-header">',
			'<span ng-repeat="day in days track by $index" class="day-name" ng-class="{first: $first, last: $last}">{{day}}</span>',
		'</div>',
		'<div class="calendar-body">',
			'<div ng-repeat="week in weeks track by $index" class="week" ng-class="{first: $first, last: $last}">',
				'<span ng-repeat="day in week.days track by $index" class="day" ng-class="{first: $first, last: $last}" ng-click="day != undefined && click(day)">{{day}}&nbsp;</span>',
			'</div>',
		'</div>',
	'</div>'
].join('\n');

mod.run(['$templateCache', function ($templateCache) {
	$templateCache.put('calendar.tmpl', calendarTemplate);
}]);
