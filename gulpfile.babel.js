const   gulp          = require('gulp'),
        babel         = require('gulp-babel'),
        sass          = require('gulp-sass'),
        autoprefixer  = require('gulp-autoprefixer'),
        browserSync   = require('browser-sync'),
        concat        = require('gulp-concat'),
        uglify        = require('gulp-uglifyjs'),
        cssnano       = require('gulp-cssnano'),
        rename        = require('gulp-rename'),
        del           = require('del'),
        imagemin      = require('gulp-imagemin'),
        cache         = require('gulp-cache');

gulp.task('sass', () => {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('libs', () => {
  return gulp.src('src/libs/**/*.js')
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(babel())
    .pipe(gulp.dest('src/js'))
});

gulp.task('scripts', () => {
    return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(babel())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('css', ['sass'], () => {
    return gulp.src('src/css/*.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', ['browser-sync'], () => {
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('clean', () => {
    return del.sync('dist');
});

gulp.task('img', () => {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'sass', 'scripts', 'css', 'img'], () => {

    let buildCss = gulp.src([
        'src/css/main.css',
        'src/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    let buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    let buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'))

    let buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});


gulp.task('clear', () => {
    return cache.clearAll();
});
