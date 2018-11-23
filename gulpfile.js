var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var csscomb = require('gulp-csscomb');
var sassGlob = require('gulp-sass-glob');
var spritesmith = require('gulp.spritesmith');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var uncss = require('gulp-uncss');
var csso = require('gulp-csso');

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});


gulp.task('sass', function () {
    return gulp.src('app/scss/styles.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(csscomb())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(csso())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('app/img/icons/*.*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            imgPath: '../img/sprites/sprite.png'
        }));
    spriteData.img.pipe(gulp.dest('app/img/sprites/'));
    spriteData.css.pipe(gulp.dest('app/scss/modules/'));
});


gulp.task('watch', ['browserSync', 'sprite', 'sass'], function () {
    gulp.watch('app/*.html').on('change', browserSync.reload);
    gulp.watch(['app/img/icons/*.*'], ['sprite']);
    gulp.watch('app/scss/**/*.scss', ['sass']);

});