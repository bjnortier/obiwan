'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        node: true,
        loopfunc: true,
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js'],
        options: {
          globals: {
          }
        },
      },
      unit: {
        src: ['test/unit/**/*.js'],
        options: {
          globals: {
            describe: false, 
            before: false, 
            beforeEach: false, 
            after: false,
            afterEach: false,
            it: false,
          },
        }
      },
      functional: {
        src: ['test/functional/**/*.js'],
        options: {
          globals: {
            describe: false, 
            before: false, 
            beforeEach: false, 
            after: false,
            afterEach: false,
            it: false,
          },
        }
      },
    },

    simplemocha: {
      options: {
        timeout: 5000,
        slow: 5000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec',
        path: 'test'
      },
      unit: { 
        src: '<%= jshint.unit.src %>'
      },
      functional: { 
        src: '<%= jshint.functional.src %>'
      },
    },

    watch: {
      lib: {
        files: ['<%= jshint.lib.src %>'],
        tasks: ['jshint:lib', 'unit', 'functional'],
      },
      unit: {
        files: ['<%= jshint.unit.src %>'],
        tasks: ['jshint:unit', 'unit'],
      },
      functional: {
        files: ['<%= jshint.functional.src %>'],
        tasks: ['jshint:functional', 'functional'],
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('unit', ['simplemocha:unit']);
  grunt.registerTask('functional', ['simplemocha:functional']);
  grunt.registerTask('test', ['jshint', 'unit', 'functional']);
  grunt.registerTask('default', ['test']);

};
