let projectFolder = "dist"
let sourceFolder = "src"
let path = {
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        fonts: projectFolder + "/fonts/",
    },
    src: {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/script.js",
        img: sourceFolder + "/img/**/*.{jpg, png, svg, gif, ico, wbp}",
        fonts: sourceFolder + "/fonts/*.ttf",
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg, png, svg, gif, ico, wbp}",
    },
    clean: "./" + projectFolder + "/"
}

let { src, dest } = require('gulp')
let gulp = require('gulp')
let browsersync = require('browser-sync').create()
let fileinclude = require("gulp-file-include")
let del = require("del")
let sass = require("gulp-dart-sass")
let autoprefixer = require("gulp-autoprefixer")
let groupMedia = require("gulp-group-css-media-queries")
let cleanCss = require("gulp-clean-css")
let rename = require("gulp-rename")
let uglify = require("gulp-uglify-es").default

function browserSync(parems) {
    browsersync.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
    .pipe(
        sass({
            outputStyle: "expanded"
        })
    )
    .pipe(groupMedia())
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
        rename({
            extname: ".min.js"
        })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function wathFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
}

function clean(parems) {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html))
let watch = gulp.parallel(build, wathFiles, browserSync)

exports.css = css
exports.js = js
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch
