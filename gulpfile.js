var path        = require("path");
var browserify  = require("browserify");
var del         = require("del");
var merge       = require('merge2');
var tslint      = require("tslint");
var gulp        = require("gulp");
var buffer      = require("gulp-buffer");
var sourcemaps  = require('gulp-sourcemaps');
var tap         = require("gulp-tap");
var typedoc     = require("gulp-typedoc");
var ts          = require("gulp-typescript");
var uglify      = require("gulp-uglify");
var gulpTslint  = require("gulp-tslint");

var name = "Mbed Cloud SDK for JavaScript";
var namespace = "MbedCloudSDK";
var docsToc = "AccountManagementApi,CertificatesApi,ConnectApi,DeviceDirectoryApi,UpdateApi,ConnectionOptions";

// Source
var srcDir = "src";
var srcFiles = srcDir + "/**/*.ts";
var srcFilesOnly = [
    srcFiles,
    "!" + srcDir + "/_api/**",
    "!" + srcDir + "/_tests/**"
];

// Node
var nodeDir = "lib";
var bundleFiles = nodeDir + "/**/index.js"
var testFiles = nodeDir + "/_tests/**/*.js";

// Browser bundles
var bundleDir = "bundles";
var testDir = bundleDir + "/_tests";

// Other
var docsDir = "docs";
var typesDir = "types";

var watching = false;

// Error handler suppresses exists during watch
function handleError() {
    if (watching) this.emit("end");
    else process.exit(1);
}

// Set watching
gulp.task("setWatch", function() {
    watching = true;
});

// Clear built directories
gulp.task("clean", function() {
    return del([nodeDir, typesDir, bundleDir]);
});

// Lint the source
gulp.task("lint", function() {
    var program = tslint.Linter.createProgram("./");

    gulp.src(srcFiles)
    .pipe(gulpTslint({
        program: program,
        formatter: "stylish"
    }))
    .pipe(gulpTslint.report({
        emitError: !watching
    }))
});

// Create documentation
gulp.task("doc", function() {
    return gulp.src(srcFilesOnly)
    .pipe(typedoc({
        name: name,
        readme: srcDir + "/documentation.md",
        theme: srcDir + "/theme",
        module: "commonjs",
        target: "es6",
        mode: "file",
        out: docsDir,
        excludeExternals: true,
        excludePrivate: true,
        hideGenerator: true,
        toc: docsToc
    }))
    .on("error", handleError);
});

// Build TypeScript source into CommonJS Node modules
gulp.task("typescript", ["clean"], function() {
    var options = {
        target: "es5",
        types: ["intern"],
        lib: [
            "dom",
            "es5",
            "es2015.promise",
            "es2015.symbol.wellknown"
        ],
        alwaysStrict: true,
        noEmitOnError: true,
        noUnusedLocals: true,
        declaration: true,
        noUnusedParameters: true
    };

    return merge([
        gulp.src(srcFiles)
            .pipe(sourcemaps.init())
            .pipe(ts(options))
            .on("error", handleError).js
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(nodeDir)),
        gulp.src(srcFilesOnly)
            .pipe(ts(options))
            .on("error", handleError).dts
            .pipe(gulp.dest(typesDir))
    ]);
});

// Browserify helper function
function bundle(srcFiles, destDir, optionsFn) {
    return gulp.src(srcFiles, {
        read: false
    })
    .pipe(tap(function(file) {
        var options = {};
        if (optionsFn) options = optionsFn(file);
        var fileName = options.fileName || path.basename(file.path);

        if (options.standalone)
            console.log(`Creating ${options.standalone} in ${destDir}/${fileName}`);
        else
            console.log(`Creating ${destDir}/${fileName}`);

        file.contents = browserify(file.path, options)
        .ignore("buffer")
        .bundle()
        .on("error", handleError);
        file.path = path.join(file.base, fileName);
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({
        loadMaps: true
    }))
    .pipe(uglify({
        preserveComments: function(node, comment) {
            return comment.value.includes("Copyright Arm");
        }
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(destDir));
}

// Build CommonJS modules into browser bundles
gulp.task("bundleSource", ["typescript"], function() {
    return bundle(bundleFiles, bundleDir, function(file) {
        var name = path.dirname(file.relative);
        if (name === ".") {
            return {
                fileName: "index.min.js",
                standalone: namespace
            };
        }

        name = name.replace(/([A-Z]+)/g, function(match) {
            return `-${match.toLowerCase()}`;
        });

        return {
            fileName: `${name}.min${path.extname(file.relative)}`,
            standalone: `${namespace}.${name.charAt(0).toUpperCase()}${name.slice(1)}Api`
        };
    });
});

// Build CommonJS tests into browser tests
gulp.task("bundleTests", ["typescript"], function() {
    return bundle(testFiles, testDir);
});

gulp.task("watch", ["setWatch", "default"], function() {
    gulp.watch(srcFiles, ["default"]);
});

gulp.task("default", ["lint", "doc", "bundleSource", "bundleTests"]);
