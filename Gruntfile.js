module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist'],
    copy: {
      icons: {
        expand: true,
        cwd: 'src/',
        src: ['icons/*.png'],
        dest: 'dist/'
      },
      manifest: {
        options: {
          processContent: function(content) {
            return grunt.template.process(content);
          }
        },
        src: ['src/manifest.json'],
        dest: 'dist/manifest.json'
      },
      bootstrap: {
        expand: true,
        cwd: 'assets/Bootstrap/',
        src: [
          'css/bootstrap.min.css',
          'fonts/*.woff'
        ],
        dest: 'dist/'
      },
    },
    jade: {
      page: {
        files: {
          'dist/index.html': 'src/jade/index.jade'
        }
      }
    },
    less: {
      release: {
        files: {
          'dist/css/style.css': 'src/less/style.less'
        }
      }
    },
    concat: {
      lib: {
        src: [
          'assets/jQuery/jquery-*.min.js',
          'assets/Bootstrap/js/bootstrap.min.js',
          'assets/AngularJs/angular.min.js',
          'assets/AngularJs/angular-route.min.js'
        ],
        dest: 'dist/js/lib.js'
      },
      dev: {
        options: {
          process: function (src, filepath) {
            return '// Source: ' + filepath + '\n' + src;
          }
        },
        src: 'src/js/**/*.js',
        dest: 'dist/js/app.js'
      }
    },
    uglify: {
      release: {
        options: {
          sourceMap: 'dist/js/app.min.js.map',
          sourceMappingURL: 'app.min.js.map',
          sourceMapPrefix: 2
        },
        files: {
          'dist/js/app.min.js': ['dist/js/app.js']
        }
      }
    },
    watch: {
      jade: {
        files: ['src/jade/**/*.jade'],
        tasks: ['jade']
      },
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['concat:dev', 'uglify']
      }
    },
    packaging: {
      release: {
        src: 'dist',
        dest: 'RolaHistory' // 拡張子を除いたファイル名
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadTasks('tasks');

  grunt.registerTask('dev',     ['clean', 'copy', 'jade', 'less', 'concat']);
  grunt.registerTask('build',   ['dev', 'uglify']);
  grunt.registerTask('release', ['build', 'packaging']);
  grunt.registerTask('default', ['build', 'watch']);
};
