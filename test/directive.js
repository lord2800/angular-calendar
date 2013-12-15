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
});