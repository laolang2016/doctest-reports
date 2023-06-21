const { series, parallel, watch, src, dest } = require('gulp')

const cssmin = require('gulp-cssmin')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('node-sass'))
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const sourcemap = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const clean = require('gulp-clean')
const browser = require('browser-sync').create()
const reload = browser.reload
const fileinclude = require('gulp-file-include')

const config = {
    sass: {
        src: './src/sass/*.scss',
        css: './src/css/',
        dest: './dist/css/'
    },
    js: {
        src: './src/js/*.js',
        dest: './dist/js/'
    },
    html: {
        src: './src/html/*.html',
        prefix: '@@',
        components: './src/components',
        componentsFiles: './src/components/*.html',
        dest: './dist/html/'
    },
    image: {
        src: './src/images/**',
        dest: './dist/images/'
    },
    libs: {
        src: './src/libs/**',
        dest: './dist/libs/'
    }
}

const hello = (cb) => {
    console.log('hello')
    console.log(config.sass.src)
    cb()
}

// css 任务
const sassHandler = () => {
    return src(config.sass.src)
        .pipe(sass()) // sass 编译, 无法编译变量, 但是会自动读取 .sass 文件中的变量
        .pipe(dest(config.sass.css))
        .pipe(sourcemap.init())
        .pipe(autoprefixer())
        .pipe(cssmin()) // css 压缩
        .pipe(sourcemap.write('.'))
        .pipe(dest(config.sass.dest))
        .pipe(reload({ stream: true }))
}

// js 任务
const jsHandler = () => {
    return src(config.js.src)
        .pipe(sourcemap.init())
        .pipe(babel({
            // babel@7: presets:['es2015]
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemap.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(config.js.dest))
        .pipe(reload({ stream: true }))
}

// html 任务
const htmlHandler = () => {
    return src(config.html.src)
        .pipe(fileinclude({
            prefix: config.html.prefix,
            basepath: config.html.components
        }))
        .pipe(htmlmin({
            // collapseWhitespace: true, // 移除空格
            removeEmptyAttributes: true, // 移除空的属性, 仅限于原生属性
            collapseBooleanAttributes: true, // 移除 checked="checked" 中不必要的 ="checked"
            removeAttributeQuotes: true, // 移除属性上的双引号
            minifyCSS: true, // 压缩内嵌的 css, 只能基本压缩, 不能添加前缀
            minifyJS: false, // 压缩内嵌的 js 代码, 只能基本压缩, 不能转 es6 为 es5
            removeStyleLinkTypeAttributes: false, // 移除 style 和 link 标签上的 type 属性
            removeScriptTypeAttributes: false, // 移除 script 标签上的默认 type 属性
        }))
        .pipe(dest(config.html.dest))
        .pipe(reload({ stream: true }))
}

// image 任务
const imageHandler = () => {
    return src(config.image.src)
        .pipe(dest(config.image.dest))
        .pipe(reload({ stream: true }))
}

// lib 任务
const libsHandler = () => {
    return src(config.libs.src)
        .pipe(dest(config.libs.dest))
}

// clean 任务
const cleanHandler = () => {
    return src('./dist', { allowEmpty: true })
        .pipe(clean({}))

}

// server 任务
const serverHandler = () => {
    browser.init({
        server: {
            baseDir: './dist'
        },
        port: 4000,
        open: false
    })
}

// watch
const watchHandler = () => {
    watch(config.sass.src, sassHandler).on('change', reload)
    watch(config.js.src, jsHandler).on('change', reload)
    watch(config.html.src, htmlHandler).on('change', reload)
    watch(config.html.componentsFiles, htmlHandler).on('change', reload)
    watch(config.image.src, imageHandler).on('change', reload)
}

exports.hello = hello
exports.sass = sassHandler
exports.js = jsHandler
exports.html = htmlHandler
exports.image = imageHandler
exports.libs = libsHandler
exports.clean = cleanHandler
exports.server = serverHandler
exports.watch = watchHandler


// exports.default = gulp.series(cleanHandler, gulp.parallel(sassHandler, jsHandler, htmlHandler, imageHandler, libsHandler))

exports.default = series(
    cleanHandler,
    parallel(sassHandler, jsHandler, htmlHandler, imageHandler, libsHandler),
    parallel(watchHandler, serverHandler)
)
