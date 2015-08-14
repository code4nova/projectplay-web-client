var gulp = require("gulp");

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all-scripts.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});
