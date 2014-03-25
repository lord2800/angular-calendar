describe('Calendar Directive', function () {
	var el, local, isolate;

	beforeEach(module('jh.calendar'));

	beforeEach(inject(function ($compile, $rootScope) {
		local = $rootScope.$new();
		local.date = new Date(2013, 0);
		local.doSomething = jasmine.createSpy();

		el = angular.element('<calendar for="date" on-click="doSomething()"></calendar>');
		$compile(el)(local);
		local.$digest();
		isolate = el.isolateScope();
	}));

	it('should set the month correctly', inject(function ($locale) {
		expect(isolate.month).toBe($locale.DATETIME_FORMATS.MONTH[0]);
	}));

	it('should set the year correctly', function () {
		expect(isolate.year).toBe(2013);
	});

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

	it('should say a date is selected if it has been clicked', function () {
		isolate.clickDay(1);
		isolate.$digest();
		expect(isolate.isSelected(1)).toBe(true);
		expect(isolate.isSelected(2)).toBe(false);
		expect(el.find('.week.first .day:nth-child(3)').hasClass('active')).toBe(true);
	});

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
		isolate.clickDay(1);
		local.doSomething.reset();
		expect(isolate.isSelected(1)).toBe(true);
		isolate.clickDay(undefined);
		expect(local.doSomething).not.toHaveBeenCalled();
		expect(isolate.isSelected(1)).toBe(true);
	});

	it('should pass clicks to the handler', function () {
		local.doSomething.reset();
		isolate.clickDay(1);
		expect(local.doSomething).toHaveBeenCalled();
	});

	it('should mark the date passed in as active', function () {
		local.date = new Date();
		local.$digest();
		expect(isolate.isSelected(local.date.getDate())).toBe(true);
	});

	it('should update the day passed in when selecting a day', function () {
		isolate.clickDay(22);
		expect(local.date.getDate()).toBe(22);
	});
});
