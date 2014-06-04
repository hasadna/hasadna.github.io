module.exports = function (grunt) {

    // Project configuration.
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
                        src: ['css/favicon.ico'],
                        dest: 'dest/'
                    },

                    {
                        expand: true,
                        cwd: 'src',
                        src: ['index.html'],
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
                    }
                ]
            }
        },


        uglify: {
            target: {
                options: {
                    mangle: false,
                    dead_code: true,
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
                    'dest/css/style.css': [
                        "src/css/filesPiChart.css", "src/css/headerStyle.css", "src/css/index.css", "src/css/reset.css", "src/css/style.css"
                    ]
                },
                keepSpecialComments: "0"
            }

        },
        bowerInstall: {
            target: {
                src: 'src/index.html' // point to your HTML file.
            }
        },

        link_html: {
            your_target: {
                // Target-specific file lists and/or options go here.
                jsFiles: [],
                cssFiles: ['style.css'],
                targetHtml: ['dest/index.html'],
                options: {
                    cwd: '.'
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/*.js', 'test/*.js'],
                recurse: true,
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.loadNpmTasks('grunt-bower-install');

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-link-html');

    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy','uglify', 'jsdoc',  'bowerInstall', 'cssmin', 'link_html']);


};