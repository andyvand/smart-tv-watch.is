module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: 'build/styles'
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd:    'src/',
                        src:    ['*'],
                        dest:   'build/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd:    'src/scripts',
                        src:    ['*'],
                        dest:   'build/js',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['compass', 'copy']);

};