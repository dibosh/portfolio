"use strict";

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var bowerFiles = require('main-bower-files');
var series = require('stream-series');
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

pipes.builtVendorStyles = function () {
  var cssFilter = plugins.filter(function (file) {
    return file.path.match(/\.css|\.sass$/i);
  });

  return gulp.src(bowerFiles())
    .pipe(cssFilter)
    .pipe(plugins.sass())
    .pipe(plugins.concat('vendor.styles.css'))
    .pipe(plugins.cleanCss({compatibility: 'ie8'}))
    .pipe(pipes.minifiedFileName())
    .pipe(gulp.dest(config.paths.dist.css));
};

pipes.builtVendorScripts = function () {
  var jsFilter = plugins.filter(function (file) {
    return file.path.match(/\.(js)$/i);
  });

  return gulp.src(bowerFiles())
    .pipe(jsFilter)
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

function buildApp() {
  var vendorScripts = pipes.builtVendorScripts();
  var vendorStyles = pipes.builtVendorStyles();
  var appScripts = pipes.builtAppScripts();
  var appStyles = pipes.builtStyles();
  // Copy others
  copyAssets();
  copyPartials();
  copyFavIcon();

  return gulp.src(config.paths.index)
    .pipe(gulp.dest(config.paths.dist.root))
    .pipe(plugins.inject(series(vendorScripts, appScripts), {relative: true}))
    .pipe(plugins.inject(series(vendorStyles, appStyles), {relative: true}))
    .pipe(gulp.dest(config.paths.dist.root));
}

function copyAssets() {
  gulp.src(config.paths.assets)
    .pipe(gulp.dest(config.paths.dist.assets));
}

function copyFavIcon() {
  gulp.src(config.paths.favicon)
    .pipe(gulp.dest(config.paths.dist.root));
}

function copyPartials() {
  gulp.src(config.paths.partials)
    .pipe(gulp.dest(config.paths.dist.partials));
}

gulp.task('watch', ['build'], function () {
  gulp.watch([
    config.paths.scripts,
    config.paths.styles,
    config.paths.partials,
    config.paths.index
  ], ['build']);
});

gulp.task('build', function () {
  del(config.paths.dist.root)
    .then(function () {
      buildApp();
    });
});