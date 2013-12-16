describe('Calendar Directive', function () {
	var el, local, isolate;

	beforeEach(module('jh.calendar'));

	beforeEach(inject(function ($compile, $rootScope) {
		local = $rootScope.$new();
		local.date = new Date(2013, 0);

		el = angular.element('<calendar for="date"></calendar>');
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
});