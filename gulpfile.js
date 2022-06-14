const gulp = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const server = require('browser-sync');

const path = {
  dev: {
    html: './dev/**/*.html',
    scss: './dev/scss/**/*.scss',
    js: './dev/js/**/*.js',
  },
  prod: {
    html: './prod',
    css: './prod/css',
    js: './prod/js',
  }
}

gulp.task('server', () => {
  return server({
    server: {
      baseDir: './prod',
    },
    notify: false,
  });
});

gulp.task('html', () => {
  return gulp.src(path.dev.html)
    .pipe(gulp.dest(path.prod.html))
    .pipe(server.reload({stream: true}));
});

gulp.task('scss', () => {
  return gulp.src(path.dev.scss)
    .pipe(scss())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(path.prod.css))
    .pipe(server.reload({stream: true}))
});

gulp.task('js', () => {
  return gulp.src(path.dev.js)
    .pipe(gulp.dest(path.prod.js))
    .pipe(server.reload({stream: true}));
});

gulp.task('watch', () => {
  gulp.watch('./dev/scss/**/*.scss', gulp.parallel('scss'))
  gulp.watch('./dev/js/**/*.js', gulp.parallel('js'))
  gulp.watch('./dev/**/*.html', gulp.parallel('html'))
})

gulp.task('default', gulp.parallel('server', 'scss', 'html', 'js', 'watch'));