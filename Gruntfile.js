module.exports = function (grunt) {
	['contrib-jshint', 'contrib-connect','contrib-copy', 'contrib-cssmin', 'contrib-concat', 'contrib-uglify', 'contrib-watch', 'contrib-clean', 'ngmin', 'karma', 'gh-pages', 'karma-coveralls'].forEach(function (mod) {
		grunt.loadNpmTasks('grunt-' + mod);
	});

	grunt.initConfig({
		connect: { serve: { options: { port: 9000, keepalive: false, livereload: 23489, base: ['dist', '/tmp/calendar-coverage'], debug: true } } },
		jshint: { options: { jshintrc: '.jshintrc' }, calendar: { files: [{ src: '{src,test}/*.js' }] } },
		copy: { main: {expand: true, cwd: 'src/', src: ['*.css'], dest: 'dist/'} },
		cssmin: {
			minify: { expand: true, cwd: 'dist/', src: ['*.css', '!*.min.css'], dest: 'dist/', ext: '.min.css' }
		},
		concat: {
			calendar: {
				options: { banner: '(function () { "use strict";\n\n', footer: '\n})();' },
				files: [{ src: ['src/module.js', 'src/*.js'], dest: 'dist/calendar.js' }]
			}
		},
		ngmin: { calendar: { files: [{ src: 'dist/calendar.js', dest: 'dist/calendar.js' }] } },
		uglify: { calendar: { files: [{ src: 'dist/calendar.js', dest: 'dist/calendar.min.js' }] } },
		clean: { calendar: { files: [{ src: ['dist/calendar.js', 'dist/calendar.min.js'] }] } },
		karma: {
			options: {
				basePath: '',
				files: [
					'http://code.jquery.com/jquery-2.1.0.js',
					'dist/bower_components/angular/angular.js',
					'dist/bower_components/angular-i18n/angular-locale_en-us.js',
					'dist/bower_components/angular-mocks/angular-mocks.js',
					'dist/calendar.js', 'test/*.js'],
				preprocessors: { 'dist/calendar.js': ['coverage'] },
				frameworks: ['jasmine'],
				exclude: [],
				reporters: ['dots', 'coverage'],
				coverageReporter: { reporters: [{ type: 'html' }, { type: 'lcov' }], dir: '/tmp/calendar-coverage' },
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
		coveralls: { options: { debug: true, coverage_dir: '/tmp/calendar-coverage' } },
		watch: {
			options: { atBegin: true, livereload: 23489 },
			calendar: { files: ['src/*.js','src/*.css'], tasks: ['jshint', 'concat'] },
			test: { files: ['test/*.js'], tasks: ['karma:unit'] },
			livereload: { files: ['dist/*'], tasks: [] }
		},
		'gh-pages': {
			options: {
				base: 'dist',
				message: 'Auto-commit via Travis [ci-skip]',
				repo: 'https://' + process.env.GH_OAUTH_TOKEN + '@github.com/lord2800/angular-calendar.git',
				silent: true,
				user: {
					name: 'Travis CI',
					email: 'lord2800@gmail.com'
				}
			},
			src: ['**']
		}
	});

	grunt.registerTask('package', ['jshint', 'concat', 'copy', 'cssmin', 'ngmin', 'uglify']);
	grunt.registerTask('test', ['karma:unit']);
	grunt.registerTask('docs', ['coveralls', 'gh-pages']);
	grunt.registerTask('default', ['copy', 'cssmin', 'connect:serve', 'watch']);
};
