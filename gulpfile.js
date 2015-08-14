var gulp = require("gulp");

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var watch = require("gulp-watch");


var files = [ "js/jquery.js", "js/jquery-migrate.min.js",
  "js/modernizr.custom.06523.js", "js/site-wide.js", "js/wait-for-images.js",
  "js/background-image.js", "js/jquery.form.min.js",
  "js/jquery.simplemodal.1.4.4.min.js", "js/scripts.js", "js/playSvc.js",
  "js/app.js", "js/initialize.js"];
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(files)
        .pipe(concat('all-scripts.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('watch', function(){
    return gulp.watch(files, ['scripts']);
});
