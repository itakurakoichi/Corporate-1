var gulp = require('gulp');
var pkg = require('./package.json');
var webserver = require('gulp-webserver');
var plumber = require('gulp-plumber');
var header = require('gulp-header');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var replace = require('gulp-replace');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');

// --- Concat&Compile
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
// --- Compress
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
// --- Check
// var jshint = require('gulp-jshint');
// var htmlhint = require('gulp-htmlhint');
// --- Optimize
var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');

// --- Path
var paths = {
	src: 'src',
	dist: 'dist'
}

// Tasks
gulp.task('html', function() {
	gulp.src([
			'*.jade',
			'!_*.jade'
		], {
			cwd: paths.src + '/jade/'
		})
		.pipe(plumber())
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(paths.src))
		.pipe(replace('base.js', 'base.min.js'))
		.pipe(replace('jquery.js', 'jquery.min.js'))
		.pipe(gulp.dest(paths.dist))
});

gulp.task('img', function() {
	gulp.src(paths.src + '/img/*\.+(jpg|jpeg|png|gif)')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('js', function() {
	gulp.src([
			'*.js', '!base.js', '!jquery.js'
		], {
			cwd: paths.src + '/js/'
		})
		.pipe(plumber())
		.pipe(concat('base.js'))
		.pipe(gulp.dest(paths.src + '/js'))
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('bowerJs', function() {
	var jsFilter = filter('**/*.js');
	gulp.src(mainBowerFiles())
		.pipe(jsFilter)
		.pipe(gulp.dest(paths.src + '/js'))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('css', function() {
	gulp.src(paths.src + '/stylus/*.styl')
		.pipe(plumber())
		.pipe(stylus())
		.pipe(gulp.dest(paths.src + '/css'))
		.pipe(minifycss())
		.pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('watch', function() {
	gulp.watch(paths.src + '/**/*.jade', ['html']);
	gulp.watch(paths.src + '/js/*.js', ['js']);
	gulp.watch(paths.src + '/stylus/*.styl', ['css']);
});

gulp.task('webserver', function() {
	gulp.src(paths.src)
		.pipe(webserver({ livereload: true }));
});

gulp.task('default', ['html', 'css', 'js', 'img', 'watch', 'webserver']);
