var gulp = require('gulp');
var browserify = require('browserify');
var htmlmin = require('gulp-htmlmin');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var del = require('del');
var zip = require("gulp-zip");
var source = require('vinyl-source-stream');

function compress() {
	return gulp
		.src('output/*')
		.pipe(zip('package.zip'))
		.pipe(gulp.dest('output'));
}

function pre_js() {
	return gulp
		.src(['src/index.js'])
		.pipe(babel({
			plugins: ['@babel/transform-runtime'],
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('comp'));
}

function m_html() {
	return gulp
		.src(['src/index.html', 'src/404.html'])
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('output'));
}

function m_css() {
	var plugins = [
        cssnano()
    ];
	return gulp
		.src('src/index.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('output'));
}

function m_js() {
	return gulp
		.src(['comp/index.js', 'src/head.js'])
		.pipe(uglify())
		.pipe(gulp.dest('output'));
}

function copy_extras() {
	return gulp
		.src(['src/manifest.json', 'src/favicon.ico', 'src/icons/*', 'src/sw.js'], {
			base: "src"
		})
		.pipe(gulp.dest('output'));
}

function clean() {
	return del(["./comp"]);
}

function bundle() {
	return browserify('output/index.js')
		.bundle()
		.pipe(source('index.js'))
		.pipe(gulp.dest('output'));
}

gulp.task("html", m_html);
gulp.task("css", m_css);
gulp.task("js", m_js);
gulp.task("pre_js", pre_js);
gulp.task("clean", clean);
gulp.task("copy_extras", copy_extras);
gulp.task("compress", compress);
gulp.task("bundle", bundle);
gulp.task(
	"build",
	gulp.series("html", "css", "pre_js", "js", "bundle", "copy_extras", "clean")
);
gulp.task(
	"packit",
	gulp.series("build", "compress")
);
