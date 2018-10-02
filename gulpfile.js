var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var pkg = require('./package.json');

var production = (process.env.NODE_ENV == 'production');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
      './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome 5
  gulp.src([
      './node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    ])
    .pipe(gulp.dest('./vendor/fontawesome/css'))
  gulp.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/**/*'])
    .pipe(gulp.dest('./vendor/fontawesome/webfonts'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/jquery.min.js',
			'./node_modules/jquery.easing/jquery.easing.min.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // Simple Line Icons
  gulp.src([
      './node_modules/simple-line-icons/fonts/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/fonts'))

  gulp.src([
      './node_modules/simple-line-icons/css/**',
    ])
    .pipe(gulp.dest('./vendor/simple-line-icons/css'))

});

// Compile SCSS
gulp.task('scss', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: (production) ? 'compressed' : 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 5%', '> 2% in IR', 'ie >= 9'],
      cascade: false
    }))
		.pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
});

// JavaScript
gulp.task('js', function() {
  var bundler = browserify(['./js/main.js'])
			
	return bundler.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// Default task
gulp.task('default', function() {
	production = true;
	gulp.run(['scss', 'js', 'vendor'])
});

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', ['scss', 'js', 'browserSync'], function() {
  gulp.watch('./scss/*.scss', ['scss']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
});
