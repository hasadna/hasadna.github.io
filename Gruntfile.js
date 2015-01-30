module.exports = function(grunt) {
	"use strict";
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			main: {
				files: [{
					expand: true,
					flatten: true,
					src: ['src/css/Alef-Webfont/*'],
					dest: 'dest/css/Alef-Webfont'
				}, {
					expand: true,
					cwd: 'src',
					src: ['css/font-awesome-4.0.3/**'],
					dest: 'dest/'
				}, {
					expand: true,
					cwd: 'src',
					src: ['css/favicon.ico*'],
					dest: 'dest/'
				}, {
					expand: true,
					cwd: 'src',
					src: ['all-issues/**'],
					dest: 'dest/'
				}, {
					expand: true,
					cwd: 'src',
					src: ['main-page/**'],
					dest: 'dest/'
				}, {
					expand: true,
					cwd: 'src',
					src: ['visualizations/**'],
					dest: 'dest/'
				}, {
					expand: true,
					cwd: 'src',
					src: ['templates/**'],
					dest: 'dest/'
				}, {
					expand: true,
					cwd: 'src',
					src: ['data/**'],
					dest: 'dest/'
				}]
			}
		},
		uglify: { // uglify all the js - from src to dest
			target: {
				options: {
					mangle: false,
					dead_code: false,
					compress: {
						drop_console: true
					}
				},
				files: [{
					expand: true,
					cwd: 'src',
					src: '**/*.js',
					dest: 'dest'
				}]
			}
		},
		cssmin: {
			combine: {
				files: {
					'dest/css/style.css': ["src/css/filesPiChart.css",
						"src/css/headerStyle.css", "src/css/index.css", "src/css/reset.css",
						"src/css/style.css"
					]
				},
				keepSpecialComments: "0"
			}
		},
		dom_munger: { // Remove all script link tags from src/index.html and copy it to root folder.
			removeScriptsAndLink: {
				options: {
					remove: 'script,link'
				},
				src: 'src/index.html',
				dest: 'index.html'
			},
			addFavIcon: { // Add favIcon
				options: {
					append: {
						selector: 'head',
						html: '<link rel="shortcut icon" href="dest/css/favicon.ico">'
					},
				},
				src: 'index.html',
				dest: 'index.html'
			}
		},
		bowerInstall: { // Add bower depts to index.html
			target: {
				src: 'index.html'
			}
		},
		tags: { // Inject the minifyed JavaScript and css to index.html
			injectJavaScript: {
				src: ['dest/eKnightsData.js', 'dest/small_repos.js', 'dest/config.js',
					'dest/hebUtill.js', 'dest/commentsHandler.js', 'dest/filters.js',
					'dest/arrayUtill.js', 'dest/issuesLoader.js', 'dest/main.js',
					'dest/visualizations/piVisualization/pieChartService.js',
					'dest/visualizations/piVisualization/ghPiVisualization.js',
					'dest/visualizations/piVisualization/piChartCtrl.js',
					'dest/all-issues/allIssuesCtrl.js', 'dest/eKnight.js',
					'update/modules/Repository.js', 'dest/main-page/filters.js',
					'dest/main-page/index.js'
				],
				options: {
					scriptTemplate: '<script src="{{ path }}"></script>',
					openTag: '<!-- start template js -->',
					closeTag: '<!-- end template js -->'
				},
				dest: 'index.html'
			},
			injectCss: {
				src: ['dest/css/style.css', 'dest/css/Alef-Webfont/stylesheet.css',
					'dest/css/font-awesome-4.0.3/css/font-awesome.min.css'
				],
				options: {
					linkTemplate: '<link rel="stylesheet" type="text/css"  href="{{ path }}"/>',
					openTag: '<!-- start template css -->',
					closeTag: '<!-- end template css -->'
				},
				dest: 'index.html'
			}
		},
		'file-creator': { // Create config file
			"basic": {
				"dest/config.js": function(fs, fd, done) {
					fs.writeSync(fd,
						'var CONFIG = {PATH: "dest/",relativizePath: function(oldPath) {return CONFIG.PATH + oldPath;}};'
					);
					done();
				}
			}
		},
		lineremover: { // Remove empty lines
			noOptions: {
				files: {
					'index.html': 'index.html'
				}
			}
		},
		prettify: { // Prettify index.html
			one: {
				src: 'index.html',
				dest: 'index.html'
			}
		},
		jsdoc: {
			dist: {
				src: ['src/*', 'test/*.js'],
				options: {
					destination: 'doc',
					recurse: true
				}
			}
		}
	});
	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-bower-install');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-script-link-tags');
	grunt.loadNpmTasks('grunt-dom-munger');
	grunt.loadNpmTasks('grunt-file-creator');
	grunt.loadNpmTasks('grunt-line-remover');
	grunt.loadNpmTasks('grunt-prettify');
	grunt.registerTask('init',
		'Compiles all of the assets and copies the files to the build directory.\n' +
		'Generating documentation in from the source code comments.', ['copy',
			'uglify', 'jsdoc', 'dom_munger', 'bowerInstall', 'cssmin', 'tags',
			'file-creator', 'lineremover', 'prettify'
		]);
	// Default task(s).
	grunt.registerTask('default',
		'Compiles all of the assets and copies the files to the build directory.', [
			'copy', 'uglify', 'dom_munger', 'bowerInstall', 'cssmin', 'tags',
			'file-creator', 'lineremover', 'prettify'
		]);
	grunt.registerTask('doc',
		'Generating documentation in from the source code comments.', ['jsdoc']);
};
