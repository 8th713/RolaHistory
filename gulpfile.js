/* jshint node: true */

var gulp = require('gulp');

var clean    = require('gulp-clean');
var bower    = require('gulp-bower-files');
var jade     = require('gulp-jade');
var less     = require('gulp-less');
var concat   = require('gulp-concat');
var template = require('gulp-template');

var runSequence = require('run-sequence');

var paths = {
  src_jade:     './src/jade/index.jade',
  src_jade_dir: './src/jade/**/*.jade',
  src_less:     './src/less/style.less',
  src_less_dir: './src/less/**/*.less',
  src_js:       './src/js/**/*.js',
  src_json:     './src/manifest.json',
  src_icons:    './src/icons/*.png',
  dist:         './dist/'
};

var data = {
  pkg: require('./package.json')
};

gulp.task('clean', function () {
  return gulp.src(paths.dist, {read: false})
    .pipe(clean());
});

gulp.task('lib', function() {
  bower()
    .pipe(gulp.dest(paths.dist));
});

gulp.task('jade', function() {
  gulp.src('./src/jade/index.jade')
    .pipe(jade())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('less', function() {
  gulp.src('./src/less/style.less')
    .pipe(less())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function () {
  gulp.src('./src/js/**/*js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('manifest', function() {
  gulp.src(paths.src_json)
    .pipe(template(data))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('icons', function () {
  gulp.src(paths.src_icons)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', function() {
  runSequence('clean', ['lib', 'jade', 'less', 'js', 'manifest', 'icons']);
});

gulp.task('watch', function () {
  gulp.watch(paths.src_jade_dir, ['jade']);
  gulp.watch(paths.src_less_dir, ['less']);
  gulp.watch(paths.src_js,   ['js']);
});

gulp.task('default', ['build', 'watch']);
