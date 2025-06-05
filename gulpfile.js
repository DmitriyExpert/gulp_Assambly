const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer'); 
const mediaquery = require('postcss-combine-media-query'); 
const cssnano = require('cssnano');

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
} 

function html() {
  return gulp.src('src/**/*.html')
              .pipe(plumber())
                .pipe(gulp.dest('dist/'))
              .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano(),
  ]
  return gulp.src('src/blocks/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/fonts/**/*.{woff2,woff,otf,ttf,eot}')
          .pipe(gulp.dest('dist/fonts'))
          .pipe(browserSync.reload({stream: true}))
}

function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
            .pipe(gulp.dest('dist/images'))
            .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

const build = gulp.series(clean, gulp.parallel(html, css, images, fonts));

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/**/*.{woff2, woff, otf, ttf, eot}'], fonts);
}
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.watchapp = watchapp; 
exports.build = build; 
exports.clean = clean;
exports.fonts = fonts;
exports.images = images;
exports.css = css; 
exports.html = html;
exports.default = watchapp; 