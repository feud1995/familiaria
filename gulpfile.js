var gulp = require('gulp');
		sass = require('gulp-sass');
		path = require('path');
		concat = require('gulp-concat');
		uglify = require('gulp-uglifyjs');
		rename = require("gulp-rename");
	  cssmin = require('gulp-clean-css');
    runSequence = require('run-sequence');
		src = 'src/';
		dest = 'static/';


gulp.task('scripts', function() {
    return gulp.src([src + 'js/*.js', ])
      	.pipe(concat('main.js'))
        .pipe(rename({suffix: '.min', basename: 'familiaria'}))
        //.pipe(uglify())
        .pipe(gulp.dest(dest + 'js'));
});

// Compile CSS from Less files
gulp.task('style', function() {
    return gulp.src(src + 'sass/style.sass')
        .pipe(sass())
				//.pipe(cssmin({restructuring: false, shorthandCompacting: false}))
				.pipe(rename({suffix: '.min', basename: 'familiaria' }))
        .pipe(gulp.dest(dest + 'css'));
});

gulp.task('images', function(){
    return gulp.src(src + 'images/**/*')
        .pipe(gulp.dest(dest + 'images'))
});

gulp.task('watch', ['scripts', 'style', 'images'], function() {
  // Watch .js files
 gulp.watch(src + 'js/*.js', ['scripts']);
  // Watch .less files
 gulp.watch([src + 'sass/**/*.sass', src + 'sass/**/*.scss'], ['style']);
  // Watch image files
 gulp.watch(src + 'images/**/*', ['images']);
});


gulp.task('default', ['style', 'scripts', 'images', 'watch'])
