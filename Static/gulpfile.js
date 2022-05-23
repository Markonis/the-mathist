var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");

const paths = {
    static: {
        html: "./src/pages/*.html",
        images: "./src/assets/images/**/*",
        fonts: "./src/assets/fonts/**/*",
    },
    app: {
        styles: "./src/assets/stylesheets/client/app.scss",
        scripts: [
            "./src/assets/javascripts/vendor/jquery-1.11.0.min.js",
            "./src/assets/javascripts/vendor/jquery.finger.min.js",
            "./src/assets/javascripts/vendor/jquery.pep.min.js",
            "./src/assets/javascripts/vendor/keypress-1.0.9.min.js",
            "./src/assets/javascripts/vendor/snap.svg-min.js",
            "./src/assets/javascripts/vendor/tooltipster.bundle.min.js",
            "./src/assets/javascripts/client/modules/app.js",
            "./src/assets/javascripts/client/modules/coordinator.js",
            "./src/assets/javascripts/client/modules/app-ui.js",
            "./src/assets/javascripts/client/modules/preloader.js",
            "./src/assets/javascripts/client/modules/providers.js",
            "./src/assets/javascripts/client/modules/user.js",
            "./src/assets/javascripts/client/modules/guest.js",
            "./src/assets/javascripts/client/modules/deeplinking.js",
            "./src/assets/javascripts/client/modules/settings-ui.js",
            "./src/assets/javascripts/client/modules/util.js",
            "./src/assets/javascripts/client/modules/notifications.js",
            "./src/assets/javascripts/client/modules/home.js",
            "./src/assets/javascripts/client/modules/editor/editor.js",
            "./src/assets/javascripts/client/modules/editor/editor-ui.js",
            "./src/assets/javascripts/client/modules/editor/editor-scroller.js",
            "./src/assets/javascripts/client/modules/editor/convertors.js",
            "./src/assets/javascripts/client/modules/editor/keyboard.js",
            "./src/assets/javascripts/client/modules/editor/keyboard-ui.js",
            "./src/assets/javascripts/client/modules/editor/writing-tools.js",
            "./src/assets/javascripts/client/modules/editor/autocomplete.js",
            "./src/assets/javascripts/client/modules/editor/history.js",
            "./src/assets/javascripts/client/modules/editor/wolfram-alpha.js",
            "./src/assets/javascripts/client/modules/editor/wolfram-alpha-parser.js",
            "./src/assets/javascripts/client/modules/editor/editor-tutorial.js",
            "./src/assets/javascripts/client/modules/editor/geogebra.js",
            "./src/assets/javascripts/client/modules/editor/desmos.js",
            "./src/assets/javascripts/client/modules/editor/manipulator.js",
            "./src/assets/javascripts/client/modules/editor/image-inserter.js",
            "./src/assets/javascripts/client/modules/editor/latex.js",
            "./src/assets/javascripts/client/modules/editor/latex-tokenizer.js",
            "./src/assets/javascripts/client/modules/notes.js",
            "./src/assets/javascripts/client/modules/files/files-ui.js",
            "./src/assets/javascripts/client/modules/files/gdrive.js",
            "./src/assets/javascripts/client/modules/files/file-uploader.js",
            "./src/assets/javascripts/client/modules/updates.js",
            "./src/assets/javascripts/client/modules/demo-requests.js",
            "./src/assets/javascripts/client/modules/logger.js",
            "./src/assets/javascripts/client/app.js",
        ]
    },
    index: {
        styles: "./src/assets/stylesheets/client/index.scss",
        scripts: [
            "./src/assets/javascripts/vendor/jquery-1.11.0.min.js",
            "./src/assets/javascripts/vendor/jquery.finger.min.js",
            "./src/assets/javascripts/vendor/tooltipster.bundle.min.js",
            "./src/assets/javascripts/client/modules/app.js",
            "./src/assets/javascripts/client/modules/app-ui.js",
            "./src/assets/javascripts/client/modules/index-ui.js",
        ]
    }
}

gulp.task("app:js", function () {
    return gulp
        .src(paths.app.scripts)
        .pipe(concat("app.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
});

gulp.task("app:css", function () {
    return gulp.src(paths.app.styles)
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(gulp.dest("./dist/css"));
});

gulp.task("index:js", function () {
    return gulp
        .src(paths.index.scripts)
        .pipe(concat("index.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
});

gulp.task("index:css", function () {
    return gulp.src(paths.index.styles)
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(gulp.dest("./dist/css"));
});

gulp.task("static:html", function () {
    return gulp.src(paths.static.html)
        .pipe(gulp.dest("./dist"));
});

gulp.task("static:images", function () {
    return gulp.src(paths.static.images)
        .pipe(gulp.dest("./dist/images"));
});

gulp.task("static:fonts", function () {
    return gulp.src(paths.static.fonts)
        .pipe(gulp.dest("./dist/fonts"));
});

gulp.task("app", gulp.parallel(["app:js", "app:css"]));
gulp.task("index", gulp.parallel(["index:js", "index:css"]));
gulp.task("static", gulp.parallel(["static:html", "static:images", "static:fonts"]));

gulp.task("build", gulp.parallel(["app", "index", "static"]));