'use strict';

module.exports = function(grunt) {

    var getDate = ( timestamp ) => {
        var dt = null, str;
        if (!timestamp) timestamp = Date.now();
        dt = new Date(timestamp);
        str = dt.getFullYear() + "-";
        if (dt.getMonth() < 9) str += "0";
        str += (dt.getMonth() + 1);
        str += "-";
        if(dt.getDate() < 10) str += "0";
        str += dt.getDate();
        return str;
    };

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
                        //'*.js',
                        'spatial-navigator.js'
                    ],
                    dest: 'dist',
                    expand: true
                }]
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
                    'dist/spatial-navigator.min.js': ['dist/spatial-navigator.js']
                }
            },
        },
        remove_comments: {
            js: {
                options: {
                    multiline: true,
                    singleline: true,
                    keepSpecialComments: false
                },
                cwd: 'dist',
                src: 'spatial-navigator.js',
                expand: true,
                dest: 'dist'
            }
        },
        concat: {
            dist: {
              src: ['src/header.txt', 'dist/spatial-navigator.js'],
              dest: 'dist/spatial-navigator.js',
            },
        },
        replace: {
            header: {
                options: {
                    patterns: [
                        {
                            json: {
                                "version-number": '<%= pkg.version %>',
                                "version-date": getDate( Date.now() ),
                            }
                        }
                    ]
                },
                files: [
                    {
                        src: ['dist/spatial-navigator.js'],
                        dest: 'dist/spatial-navigator.js'
                    }
                ]
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-remove-comments');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask( 
        'build',
        'Compiles all of the assets and files to dist directory.',
        ['clean', 'copy', 'remove_comments:js', 'concat', 'replace:header', 'uglify' ]
    );

};
