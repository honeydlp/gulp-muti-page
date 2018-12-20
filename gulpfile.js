var gulp = require('gulp')
var less = require('gulp-less')
var minifyCSS = require('gulp-csso')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
// var imagemin = require('gulp-imagemin')
// var gulpLoadPlugins = require('gulp-load-plugins')
var jsonminify = require('gulp-jsonminify')
var watchPath = require('gulp-watch-path')
var gutil = require('gulp-util')
var autoprefixer = require('gulp-autoprefixer')
var htmlmin = require('gulp-htmlmin')
var babel = require('gulp-babel')
var revCollector = require('gulp-rev-collector')
var rev = require('gulp-rev')
var cheerio = require('gulp-cheerio')
var combiner = require('stream-combiner2')
var rename = require('gulp-rename')
// var $ = gulpLoadPlugins()
// ts编译
var ts = require('gulp-typescript')
var AUTOPREFIXER_BROWSERS = [
  // 'ie >= 10',
  // 'ie_mob >= 10',
  // 'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  // 'opera >= 23',
  'ios >= 7',
  'android >= 4.4'
  // 'bb >= 10'
]

let useMock = false

for (var i = process.argv.length - 1; i >= 2; --i) {
  var arg = process.argv[i]
  if (arg.indexOf('--mock=') > -1) {
    useMock = Boolean(arg.substring(7))
  }
}

gulp.task('phtml', function () {
  return gulp.src(['rev/**/*.json', 'src/**/*.html'])
    .pipe(revCollector({
      replaceReved: true
      // dirReplacements: {
      //     'css': '/dist/css',
      //     'js': '/dist/js'
      // }
    }))
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩HTML
      // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS
    }))
    .pipe(gulp.dest('app/'))
})
gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩HTML
      // collapseBooleanAttributes: true,// 省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS
    }))
    .pipe(gulp.dest('app/'))
})
gulp.task('watchhtml', function () {
  gulp.watch('src/**/*.html', function (event) {
    var paths = watchPath(event, 'src/', 'app/')

    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    gulp.src(paths.srcPath)
      .pipe(htmlmin({
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
      }))
      .pipe(gulp.dest(paths.distDir))
  })
})
gulp.task('devhtml', function () {
  if (useMock) {
    return gulp.src('src/**/*.html')
      .pipe(cheerio(function ($, file, done) {
        $('head').append($('<script src="./mock/mock.js"></script>'))
        $('head').append('<script src="./mock/mock_data.js"></script>')
        done()
      }))
      .pipe(gulp.dest('app/'))
  } else {
    return gulp.src('src/**/*.html')
      .pipe(gulp.dest('app/'))
  }
})
gulp.task('watchdevhtml', function () {
  gulp.watch('src/**/*.html', function (event) {
    var paths = watchPath(event, 'src/', 'app/')
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    if (useMock) {
      gulp.src(paths.srcPath)
        .pipe(cheerio(function ($, file, done) {
          $('head').append($('<script src="./mock/mock.js"></script>'))
          $('head').append('<script src="./mock/mock_data.js"></script>')
          done()
        }))
        .pipe(gulp.dest(paths.distDir))
    } else {
      gulp.src(paths.srcPath)
        .pipe(gulp.dest(paths.distDir))
    }
  })
})
gulp.task('mockjs', function () {
  return gulp.src('node_modules/mockjs/dist/mock.js')
    .pipe(gulp.dest('app/mock'))
})
gulp.task('mock', function () {
  return gulp.src('mock/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('mock_data.js'))
    .pipe(gulp.dest('app/mock'))
})
gulp.task('watchmock', function () {
  gulp.watch('mock/*.js', function (event) {
    var paths = watchPath(event, 'mock', 'app/mock')
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    var combined = combiner.obj([
      gulp.src('mock/*.js'),
      babel({
        presets: ['es2015']
      }),
      concat('mock_data.js'),
      gulp.dest('app/mock')
    ])
    combined.on('error', function (err) {
      console.log('--------------')
      console.log('Error')
      console.log('fileName: ' + err.fileName)
      console.log('lineNumber: ' + err.lineNumber)
      console.log('message: ' + err.message)
      console.log('plugin: ' + err.plugin)
    })
  })
})

gulp.task('copyProxyConfig', function () {
  return gulp.src('config/proxy.template.js')
    .pipe(rename('proxy.config.js'))
    .pipe(gulp.dest('config/'))
})
gulp.task('json', function () {
  return gulp.src('src/**/*.json')
    .pipe(jsonminify())
    .pipe(gulp.dest('app/'))
})
gulp.task('pstyles', () => {
  return gulp.src([
    'src/**/*.less'
  ])
    .pipe(less())
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(minifyCSS({
      restructure: false
    }))
    .pipe(rev())
    .pipe(gulp.dest('app/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/less'))
})
gulp.task('pstyles-css', () => {
  return gulp.src([
    'src/**/*.css'
  ])
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(minifyCSS({
      restructure: false
    }))
    .pipe(rev())
    .pipe(gulp.dest('app/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'))
})
gulp.task('styles', () => {
  return gulp.src([
    'src/**/*.less'
  ])
    // .pipe(newer('.tmp/styles'))
    // .pipe(sourcemaps.init())
    .pipe(less())
    // .on('error', sass.logError))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    // .pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    // .pipe(if('*.css', cssnano()))
    // .pipe(size({title: 'styles'}))
    .pipe(minifyCSS({
      restructure: false
    }))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/'))
})

gulp.task('styles-css', () => {
  return gulp.src([
    'src/**/*.css'
  ])
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(minifyCSS({
      restructure: false
    }))
    .pipe(gulp.dest('app/'))
})

gulp.task('watchstyles1', function () {
  gulp.watch(['src/**/*.css'], function (event) {
    var paths = watchPath(event, 'src/', 'app/')

    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    var combined = combiner.obj([
      gulp.src(paths.srcPath)
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.distDir))
    ])
    combined.on('error', function (err) {
      console.log('--------------')
      console.log('Error')
      console.log('fileName: ' + err.fileName)
      console.log('lineNumber: ' + err.lineNumber)
      console.log('message: ' + err.message)
      console.log('plugin: ' + err.plugin)
    })
  })
})
gulp.task('watchstyles', function () {
  gulp.watch(['src/**/*.less'], function (event) {
    var paths = watchPath(event, 'src/', 'app/')

    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    var combined = combiner.obj([
      gulp.src(paths.srcPath)
        .pipe(less())
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.distDir))
    ])
    combined.on('error', function (err) {
      console.log('--------------')
      console.log('Error')
      console.log('fileName: ' + err.fileName)
      console.log('lineNumber: ' + err.lineNumber)
      console.log('message: ' + err.message)
      console.log('plugin: ' + err.plugin)
    })
  })
})
gulp.task('images', function () {
  // 1. 找到图片
  return gulp.src('src/**/*.{png,jpg,jpeg,gif,ico,svg,otf,ttf}')
    // .pipe(imagemin({
    //   progressive: true
    // }))
    .pipe(gulp.dest('app/'))
})
gulp.task('watchimage', function () {
  gulp.watch('src/image/**/*.{png,jpg,jpeg,gif,ico,svg,otf,ttf}', function (event) {
    var paths = watchPath(event, 'src/image/', 'app/image/')

    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)

    gulp.src(paths.srcPath)
      // .pipe(imagemin({
      //     progressive: true
      // }))
      .pipe(gulp.dest(paths.distDir))
  })
})
gulp.task('copy', function () {
  gulp.src('src/assets/**/*')
    .pipe(gulp.dest('app/assets/'))
})
gulp.task('copyjs', function () {
  gulp.src('src/js/**/*.min.js')
    .pipe(gulp.dest('app/js/'))
})
gulp.task('pjs', function () {
  return gulp.src(['src/**/*.js', '!src/**/*.min.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rev())
    .pipe(gulp.dest('app/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'))
})
gulp.task('js', function () {
  return gulp.src(['src/**/*.js', '!src/**/*.min.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/'))
})
gulp.task('watchjs', function () {
  gulp.watch('src/**/*.js', function (event) {
    var paths = watchPath(event, 'src/', 'app/')
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    var combined = combiner.obj([
      gulp.src(paths.srcPath),
      sourcemaps.init(),
      babel({
        presets: ['es2015']
      }),
      sourcemaps.write(),
      gulp.dest(paths.distDir)
    ])
    combined.on('error', function (err) {
      console.log('--------------')
      console.log('Error')
      console.log('fileName: ' + err.fileName)
      console.log('lineNumber: ' + err.lineNumber)
      console.log('message: ' + err.message)
      console.log('plugin: ' + err.plugin)
    })
  })
})
// ts编译
gulp.task('ts', function () {
  return gulp.src(['src/**/*.ts'])
    .pipe(ts({
      alwaysStrict: true,
      sourceMap: true,
      target: 'ES5'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/'))
})
// 监听ts文件
gulp.task('watchts', function () {
  gulp.watch('src/**/*.ts', function (event) {
    var paths = watchPath(event, 'src/', 'app/')
    gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    var combined = combiner.obj([
      gulp.src(paths.srcPath)
        .pipe(ts({
          alwaysStrict: true,
          sourceMap: true,
          target: 'ES5'
        }))
        .pipe(gulp.dest(paths.distDir))
    ])
    combined.on('error', function (err) {
      console.log('--------------')
      console.log('Error')
      console.log('fileName: ' + err.fileName)
      console.log('lineNumber: ' + err.lineNumber)
      console.log('message: ' + err.message)
      console.log('plugin: ' + err.plugin)
    })
  })
})
// 生产ts编译
gulp.task('pts', function () {
  gulp.src(['src/**/*.ts'])
    .pipe(ts({
      alwaysStrict: true,
      target: 'ES5'
    }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rev())
    .pipe(gulp.dest('app/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/ts'))
})

gulp.task('default', ['pstyles', 'pstyles-css', 'pts', 'pjs', 'json', 'copy', 'copyjs', 'images'
  // ,'phtml'
  // ,'watchimage'
  // ,'watchjs','watchstyles','watchhtml'
], function () {
  console.log('default end')
  return gulp.src(['rev/**/*.json', 'src/**/*.html'])
    .pipe(revCollector({
      replaceReved: true
      // dirReplacements: {
      //     'css': '/dist/css',
      //     'js': '/dist/js'
      // }
    }))
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩HTML
      // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS
    }))
    .pipe(gulp.dest('app/'))
})
var devTask = ['styles', 'styles-css', 'ts', 'js', 'json', 'copy', 'copyjs', 'devhtml', 'images', 'watchimage', 'watchts', 'watchjs', 'watchstyles', 'watchstyles1', 'watchdevhtml']
if (useMock) {
  devTask.push('mockjs', 'mock', 'watchmock')
}
gulp.task('dev', devTask)
