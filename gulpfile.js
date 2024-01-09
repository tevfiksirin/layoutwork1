/*
  Usage:
  1. npm install //To install all dev dependencies of package
  2. npm run dev //To start development and server for live preview
  3. npm run prod //To generate minifed files for live server
*/

const { src, dest, task, watch, series, parallel } = require('gulp');
const del = require('del'); //For Cleaning build/dist for fresh export
const options = require("./config"); //paths and other options from config.js
const browserSync = require('browser-sync').create();

const nunjucks = require('gulp-nunjucks');
const rename = require('gulp-rename');
const prettier = require('gulp-prettier');
const sass = require('gulp-sass')(require('sass')); //For Compiling SASS files
const postcss = require('gulp-postcss'); //For Compiling tailwind utilities with tailwind config
const concat = require('gulp-concat'); //For Concatinating js,css files
const uglify = require('gulp-terser');//To Minify JS files
const imagemin = require('gulp-imagemin'); //To Optimize Images
const cleanCSS = require('gulp-clean-css');//To Minify CSS files
const purgecss = require('gulp-purgecss');// Remove Unused CSS from Styles
const autoprefixer = require('gulp-autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plumber = require('gulp-plumber')
const webpack = require('webpack-stream')
//Note : Webp still not supported in major browsers including forefox
//const webp = require('gulp-webp'); //For converting images to WebP format
//const replace = require('gulp-replace'); //For Replacing img formats to webp in html
const logSymbols = require('log-symbols'); //For Symbolic Console logs :) :P 
const webpackConfig = require('./webpack.config');

//Load Previews on Browser on dev
function livePreview(done) {
  browserSync.init({
    server: {
      baseDir: options.paths.dist.base
    },
    port: options.config.port || 5000
  });
  done();
}

// Triggers Browser reload
function previewReload(done) {
  console.log("\n\t" + logSymbols.info, "Reloading Browser Preview.\n");
  browserSync.reload();
  done();
}

//Development Tasks
// function devHTML() {
//   return src(`${options.paths.src.base}/**/*.html`).pipe(dest(options.paths.dist.base));
// }

function devNunjucks() {
  return src(`${options.paths.src.base}/*.njk`)
    .pipe(nunjucks.compile())
    .pipe(prettier({
      singleQuote: false,
      htmlWhitespaceSensitivity: 'ignore',
      printWidth: 130
    }))
    .pipe(
      rename(function (path) {
        return (path.extname = '.html');
      })
    )
    .pipe(dest(options.paths.dist.base))
}

function devStyles() {
  const tailwindcss = require('tailwindcss');
  return src(`${options.paths.src.css}/main.scss`).pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      tailwindcss(options.config.tailwindjs),
      require('autoprefixer'),
    ]))
    .pipe(concat({ path: 'style.css' }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(dest(options.paths.dist.css));
}

function devScripts() {
  return src('src/js/main.js')
    .pipe(plumber())
    .pipe(webpack({
      ...webpackConfig,
      mode: 'development',
    }))
    .pipe(dest(options.paths.dist.js))
}

function devImages() {
  return src(`${options.paths.src.img}/**/*`).pipe(dest(options.paths.dist.img));
}

function devVideos() {
  return src(`${options.paths.src.video}/**/*`).pipe(dest(options.paths.dist.video));
}

function devFonts() {
  return src(`${options.paths.src.fonts}/**/*`).pipe(dest(options.paths.dist.fonts));
}

function devModels() {
  return src(`${options.paths.src.models}/**/*`).pipe(dest(options.paths.dist.models));
}

function devJson() {
  return src(`${options.paths.src.json}/**/*`).pipe(dest(options.paths.dist.json));
}

function watchFiles() {
  // watch(`${options.paths.src.base}/**/*.html`, series(devHTML, devStyles, previewReload));
  watch(`${options.paths.src.base}/**/*.njk`, series(devNunjucks, devStyles, previewReload));
  watch([options.config.tailwindjs, `${options.paths.src.css}/**/*.scss`], series(devStyles, previewReload));
  watch(`${options.paths.src.js}/**/*.js`, series(devScripts, previewReload));
  watch(`${options.paths.src.js}/**/*.vue`, series(devScripts, devStyles, previewReload));
  watch(`${options.paths.src.img}/**/*`, series(devImages, previewReload));
  watch(`${options.paths.src.video}/**/*`, series(devVideos, previewReload));
  watch(`${options.paths.src.fonts}/**/*`, series(devFonts, previewReload));
  watch(`${options.paths.src.models}/**/*`, series(devModels, previewReload));
  watch(`${options.paths.src.json}/**/*`, series(devJson, previewReload));
  console.log("\n\t" + logSymbols.info, "Watching for Changes..\n");
}

function devClean() {
  console.log("\n\t" + logSymbols.info, "Cleaning dist folder for fresh start.\n");
  return del([options.paths.dist.base]);
}

//Production Tasks (Optimized Build for Live/Production Sites)
function prodNunjucks() {
  return src(`${options.paths.src.base}/*.njk`)
    .pipe(nunjucks.compile())
    .pipe(
      rename(function (path) {
        return (path.extname = '.html');
      })
    )
    .pipe(dest(options.paths.build.base))
}

function prodStyles() {
  return src(`${options.paths.dist.css}/**/*`)

    // this removes necessary CSS and creates bugs
    // .pipe(purgecss({
    //   content: ['src/**/*.{njk,js}'],
    //   defaultExtractor: content => {
    //     const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
    //     const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
    //     return broadMatches.concat(innerMatches)
    //   }
    // }))

    .pipe(cleanCSS({ compatibility: '*' }))
    .pipe(dest(options.paths.build.css));
}

function prodScripts() {
  return src('src/js/main.js')
    .pipe(plumber())
    .pipe(webpack({
      ...webpackConfig,
      mode: 'production',
      plugins: [
        ...webpackConfig.plugins,
        new BundleAnalyzerPlugin(),
      ]
    }))
    .pipe(dest(options.paths.build.js))
}

function prodImages() {
  return src(options.paths.src.img + '/**/*').pipe(imagemin()).pipe(dest(options.paths.build.img));
}

function prodVideos() {
  return src(`${options.paths.src.video}/**/*`).pipe(dest(options.paths.build.video));
}

function prodFonts() {
  return src(`${options.paths.src.fonts}/**/*`).pipe(dest(options.paths.build.fonts));
}

function prodModels() {
  return src(`${options.paths.src.models}/**/*`).pipe(dest(options.paths.build.models));
}

function prodClean() {
  console.log("\n\t" + logSymbols.info, "Cleaning build folder for fresh start.\n");
  return del([options.paths.build.base]);
}

function buildFinish(done) {
  console.log("\n\t" + logSymbols.info, `Production build is complete. Files are located at ${options.paths.build.base}\n`);
  done();
}

exports.default = series(
  devClean, // Clean Dist Folder
  parallel(devStyles, devScripts, devImages, devVideos, devFonts, devModels, devJson, devNunjucks), //Run All tasks in parallel
  livePreview, // Live Preview Build
  watchFiles // Watch for Live Changes
);

exports.prod = series(
  prodClean, // Clean Build Folder
  parallel(prodStyles, prodScripts, prodImages, prodVideos, prodFonts, prodModels, devJson, prodNunjucks), //Run All tasks in parallel
  buildFinish
);