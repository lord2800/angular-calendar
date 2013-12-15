module.exports = function (grunt) {
	['contrib-jshint', 'contrib-connect', 'contrib-concat', 'contrib-uglify', 'contrib-watch', 'contrib-clean', 'karma'].forEach(function (mod) {
		grunt.loadNpmTasks('grunt-' + mod);
	});

	grunt.initConfig({
		connect: { serve: { options: { port: 9000, keepalive: false, livereload: 23489, base: ['.', '/tmp/calendar-coverage'], debug: true } } },
		jshint: { options: { jshintrc: '.jshintrc' }, calendar: { files: [{ src: '{src,test}/*.js' }] } },
		concat: {
			calendar: {
				options: { banner: '(function () { "use strict";\n\n', footer: '\n})();' },
				files: [{ src: ['src/module.js', 'src/*.js'], dest: 'dist/calendar.js' }]
			}
		},
		uglify: { calendar: { files: [{ src: 'dist/calendar.js', dest: 'dist/calendar.min.js' }] } },
		clean: { calendar: { files: [{ src: ['dist/calendar.js', 'dist/calendar.min.js'] }] } },
		karma: {
			options: {
				basePath: '',
				files: [
					'http://code.angularjs.org/1.2.5/angular.js',
					'http://code.angularjs.org/1.2.5/i18n/angular-locale_en-us.js',
					'http://code.angularjs.org/1.2.5/angular-mocks.js',
					'dist/calendar.js', 'test/*.js'],
				preprocessors: { 'dist/calendar.js': ['coverage'] },
				frameworks: ['jasmine'],
				exclude: [],
				reporters: ['dots', 'coverage'],
				coverageReporter: { reporters: [{ type: 'html' }], dir: '/tmp/calendar-coverage' },
				port: 43783,
				logLevel: 'INFO',
				autoWatch: false,
				captureTimeout: 60000,
				singleRun: false
			},
			unit: {
				browsers: ['PhantomJS'],
				singleRun: true,
				autoWatch: true
			}
		},
		watch: {
			options: { atBegin: true, livereload: 23489 },
			calendar: { files: ['src/*.js'], tasks: ['jshint', 'concat'] },
			test: { files: ['test/*.js'], tasks: ['karma:unit'] },
			livereload: { files: ['dist/*'], tasks: [] }
		}
	});

	grunt.registerTask('package', ['concat', 'uglify']);
	grunt.registerTask('test', ['karma:unit']);
	grunt.registerTask('default', ['connect:serve', 'watch']);
};
