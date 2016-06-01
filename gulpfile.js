const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const middleware = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.include())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/public/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('views', () => {
  return gulp.src('app/*.pug')
    .pipe($.plumber())
    .pipe($.pug({pretty: true}))
    .pipe(gulp.dest('.tmp/public'))
    .pipe(reload({stream: true}));
});

gulp.task('html', ['views', 'styles', 'scripts'], () => {
  return gulp.src(['app/*.html', '.tmp/public/*.html'])
    .pipe($.useref({searchPath: ['.tmp/public', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist/public'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/public/images'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    '!app/*.pug'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/public'));
});

gulp.task('serve', ['views', 'styles', 'scripts'], () => {
  browserSync({
    notify: false,
    open: false,
    port: 9000,
    server: {
      baseDir: ['.tmp/public', 'app'],
      middleware,
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    '.tmp/public/*.html',
    'app/images/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.pug', ['views']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    open: false,
    port: 9002,
    server: {
      baseDir: ['dist/public'],
      middleware
    }
  });
});

gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/layouts/*.pug')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('clean', del.bind(null, ['.tmp/public', 'dist/public']));

gulp.task('build', ['lint', 'html', 'images', 'extras'], () => {
  return gulp.src('dist/public/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('app', ['clean'], () => {
  gulp.start('build');
});

gulp.task('blog:styles', () => {
  return gulp.src('blog/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(gulp.dest('dist/blog/styles'));
});

gulp.task('blog:scripts', () => {
  return gulp.src('blog/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.include())
    .pipe($.babel())
    .pipe(gulp.dest('dist/blog/scripts'));
});

gulp.task('blog:html', ['blog:styles', 'blog:scripts'], () => {
  return gulp.src('blog/*.html')
    .pipe($.include())
    .pipe(gulp.dest('dist/blog'));
});

gulp.task('blog:images', () => {
  return gulp.src('blog/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/blog/images'));
});

gulp.task('blog:build', ['blog:html', 'blog:images'], () => {
  return gulp.src('dist/blog/**/*').pipe($.size({title: 'blog:build', gzip: true}));
});

gulp.task('blog:clean', del.bind(null, ['.tmp/blog', 'dist/blog']));

gulp.task('blog', ['blog:clean'], () => {
  gulp.start('blog:build');
});

gulp.task('server:clean', del.bind(null, ['dist/server']));

gulp.task('server:data', () => {
  return gulp.src('server/data/*.*')
    .pipe(gulp.dest('dist/server/data'));
});

gulp.task('server:build', ['server:data'], () => {
  return gulp.src(['server/*.*', 'server/.htaccess', '!server/*.lock'])
    .pipe(gulp.dest('dist/server'));
});

gulp.task('server', ['server:clean'], () => {
  gulp.start('server:build');
});

gulp.task('default', () => {
  $.util.log('Check package.json for tasks!');
});
