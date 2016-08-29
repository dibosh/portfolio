"use strict";

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var bowerFiles = require('main-bower-files');
var Q = require('q');
// Config file
var config = require('./gulp.config.json');
// All piped works
var pipes = {};

pipes.orderedVendorScripts = function () {
  return plugins.order(['jquery.js', 'angular.js']);
};

pipes.orderedAppScripts = function () {
  return plugins.angularFilesort();
};

pipes.minifiedFileName = function () {
  return plugins.rename(function (path) {
    path.extname = '.min' + path.extname;
  });
};

pipes.validatedAppScripts = function () {
  return gulp.src(config.paths.scripts)
    .pipe(plugins.jshint());
};

pipes.builtAppScripts = function () {
  return pipes.validatedAppScripts()
    .pipe(pipes.orderedAppScripts())
    .pipe(plugins.concat('app.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.paths.dist.js));
};

pipes.builtVendorScripts = function () {
  return gulp.src(bowerFiles())
    .pipe(pipes.orderedVendorScripts())
    .pipe(plugins.concat('vendor.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(config.paths.dist.js));
};

pipes.builtStyles = function () {
  return gulp.src(config.paths.styles)
    .pipe(plugins.sass())
    .pipe(plugins.cleanCss({compatibility: 'ie8'}))
    .pipe(pipes.minifiedFileName())
    .pipe(gulp.dest(config.paths.dist.css));
};

pipes.copiedAssets = function () {
  return gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.paths.dist.assets));
};

pipes.builtIndex = function () {
  var vendorScripts = pipes.builtVendorScripts();
  var appScripts = pipes.builtAppScripts();
  var appStyles = pipes.builtStyles();
  var copiedAssets = pipes.copiedAssets();

  return gulp.src(config.paths.index)
    .pipe(gulp.dest(config.paths.dist.root))
    .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
    .pipe(plugins.inject(appScripts, {relative: true}))
    .pipe(plugins.inject(appStyles, {relative: true}))
    .pipe(gulp.dest(config.paths.dist.root));
};

gulp.task('build', function () {
  del(config.paths.dist.root)
    .then(function () {
      pipes.builtIndex();
    });
});