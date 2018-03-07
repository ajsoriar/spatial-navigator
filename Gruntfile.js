
'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['dist/*.*']
            }
        },
        copy: {
            build: {
                files: [{
                    cwd: 'src',
                    src: [
                        '*.js'
                    ],
                    dest: 'dist',
                    expand: true
                }
                ]
            }
        },
        uglify: {
            options: {
                preserveComments: 'some', // will preserve all comments that start with a bang (!) or include a closure compiler style directive (@preserve)
                mangle: false, // false to prevent changes to your variable and function names.
                compress: {
                    drop_console: true
                }
            },
            my_target: {
                files: {
                    'dist/div-lines.min.js': ['dist/div-lines.js']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'tests/karma.conf.js',
                singleRun: true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask( 
        'build',
        'Compiles all of the assets and files to dist directory.',
        //['clean', 'compass', 'copy', 'uglify', 'cssmin']
        ['clean', 'copy', 'uglify']
    );

    grunt.registerTask('test', ['karma']);
};
