describe('Calendar Directive', function () {
	var el, el2, el3, el4, local, isolate, isolate2, isolate3, isolate4;

	beforeEach(module('jh.calendar'));

	beforeEach(inject(function ($compile, $rootScope) {
		local = $rootScope.$new();
		local.date = new Date(2013, 0);
		local.doSomething = jasmine.createSpy();
		local.isActiveDay = function (x) { return x === 3; };
		local.isActiveWeek = function (x) { return x === 3; };

		el = angular.element('<calendar for="date" on-click="doSomething()"></calendar>');
		el2 = angular.element('<calendar for="date" on-click="doSomething()" options="{shortday: true, shortmonth: true}"></calendar>');
		el3 = angular.element('<calendar for="date" on-click="doSomething()" options="{supershortday: true}"></calendar>');
		el4 = angular.element('<calendar for="date" active-day="isActiveDay(day)" active-week="isActiveWeek(week)"></calendar>');
		$compile(el)(local);
		$compile(el2)(local);
		$compile(el3)(local);
		$compile(el4)(local);
		local.$digest();
		isolate = el.isolateScope();
		isolate2 = el2.isolateScope();
		isolate3 = el3.isolateScope();
		isolate4 = el4.isolateScope();
	}));

	it('should set the month correctly', inject(function ($locale) {
		expect(isolate.month).toBe($locale.DATETIME_FORMATS.MONTH[0]);
	}));

	it('should display a short month name when options.shortmonth is true', inject(function ($locale) {
		expect(isolate2.month).toBe($locale.DATETIME_FORMATS.SHORTMONTH[0]);
	}));

	it('should set the year correctly', function () {
		expect(isolate.year).toBe(2013);
	});

	it('should display short day names when options.shortday is true', inject(function ($locale) {
		expect(isolate2.days[0]).toBe($locale.DATETIME_FORMATS.SHORTDAY[0]);
	}));

	it('should display supershort day names when options.supershortday is true', inject(function ($locale) {
		expect(isolate3.days[0]).toBe($locale.DATETIME_FORMATS.SHORTDAY[0].substring(0, 2));
	}));

	it('should use the current date if one not specified', function () {
		local.date = null;
		local.$digest();
		expect(isolate.year).toBe((new Date()).getFullYear());
	});

	it('should get the right set of week values for 2013-12-01', function () {
		local.date = new Date(2013, 11);
		local.$digest();

		expect(isolate.weeks[0].days[0]).toBe(1);
		expect(isolate.weeks[0].days[1]).toBe(2);
		expect(isolate.weeks[0].days[2]).toBe(3);
		expect(isolate.weeks[0].days[3]).toBe(4);
		expect(isolate.weeks[0].days[4]).toBe(5);
		expect(isolate.weeks[0].days[5]).toBe(6);
		expect(isolate.weeks[0].days[6]).toBe(7);

		expect(isolate.weeks[1].days[0]).toBe(8);
		expect(isolate.weeks[1].days[1]).toBe(9);
		expect(isolate.weeks[1].days[2]).toBe(10);
		expect(isolate.weeks[1].days[3]).toBe(11);
		expect(isolate.weeks[1].days[4]).toBe(12);
		expect(isolate.weeks[1].days[5]).toBe(13);
		expect(isolate.weeks[1].days[6]).toBe(14);

		expect(isolate.weeks[2].days[0]).toBe(15);
		expect(isolate.weeks[2].days[1]).toBe(16);
		expect(isolate.weeks[2].days[2]).toBe(17);
		expect(isolate.weeks[2].days[3]).toBe(18);
		expect(isolate.weeks[2].days[4]).toBe(19);
		expect(isolate.weeks[2].days[5]).toBe(20);
		expect(isolate.weeks[2].days[6]).toBe(21);

		expect(isolate.weeks[3].days[0]).toBe(22);
		expect(isolate.weeks[3].days[1]).toBe(23);
		expect(isolate.weeks[3].days[2]).toBe(24);
		expect(isolate.weeks[3].days[3]).toBe(25);
		expect(isolate.weeks[3].days[4]).toBe(26);
		expect(isolate.weeks[3].days[5]).toBe(27);
		expect(isolate.weeks[3].days[6]).toBe(28);

		expect(isolate.weeks[4].days[0]).toBe(29);
		expect(isolate.weeks[4].days[1]).toBe(30);
		expect(isolate.weeks[4].days[2]).toBe(31);
		expect(isolate.weeks[4].days[3]).toBeUndefined();
		expect(isolate.weeks[4].days[4]).toBeUndefined();
		expect(isolate.weeks[4].days[5]).toBeUndefined();
		expect(isolate.weeks[4].days[6]).toBeUndefined();
	});

	it('should ignore invalid objects as dates and use the current date instead', inject(function ($locale) {
		local.date = 'abc';
		local.$digest();
		var now = new Date();
		expect(isolate.month).toBe($locale.DATETIME_FORMATS.MONTH[now.getMonth()]);
		expect(isolate.year).toBe(now.getFullYear());
	}));

	it('should ignore the handler if it\'s undefined', function () {
		var spy = local.doSomething;
		local.doSomething.reset();
		local.doSomething = undefined;
		local.$digest();
		isolate.clickDay(1);
		expect(spy).not.toHaveBeenCalled();
		local.doSomething = spy;
	});

	it('should ignore calls with an undefined day', function () {
		local.doSomething.reset();
		isolate.clickDay(1);
		expect(local.doSomething).toHaveBeenCalled();
		local.doSomething.reset();
		isolate.clickDay(undefined);
		expect(local.doSomething).not.toHaveBeenCalled();
	});

	it('should pass clicks to the handler', function () {
		local.doSomething.reset();
		isolate.clickDay(1);
		expect(local.doSomething).toHaveBeenCalled();
	});

	it('should mark a day/week as active based on the expression passed to activeDay/Week', function() {
		expect(isolate4.isDayActive(1)).toBe(false);
		expect(isolate4.isDayActive(3)).toBe(true);
		expect(isolate4.isWeekActive(7)).toBe(false);
		expect(isolate4.isWeekActive(3)).toBe(true);

		expect(el4.find('.week:nth-child(1)').hasClass('active')).toBe(false);
		expect(el4.find('.week:nth-child(3)').hasClass('active')).toBe(true);
		expect(el4.find('.week:nth-child(3) .day:nth-child(7)').hasClass('active')).toBe(false);
		expect(el4.find('.week:nth-child(1) .day:nth-child(5)').hasClass('active')).toBe(true);
	});
});
