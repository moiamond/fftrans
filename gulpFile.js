var gulp = require('gulp');
var shell = require('gulp-shell');

var NodeWebkitBuilder = require('nw-builder');

// Run project
gulp.task('run_win64', shell.task([
    'iojs node_modules/nw-builder/bin/nwbuild -p win64 -r ./'
]));

// Run project
gulp.task('runosx', shell.task([
    '~/.nvm/versions/io.js/v1.7.1/bin/iojs node_modules/nw-builder/bin/nwbuild -r ./'
]));

gulp.task('build', function(cb) {

    // Read package.json
    var mypackage = require('./package.json');

    // Find out which modules to include
    var modules = [];
    if (!!mypackage.dependencies) {
        modules = Object.keys(mypackage.dependencies)
            .filter(function(m) {
                return m != 'nodewebkit'
            })
            .map(function(m) {
                return './node_modules/' + m + '/**/*'
            });
    }

    // Which platforms should we build
    var platforms = [];
    if (process.argv.indexOf('--win') > -1) platforms.push('win');
    if (process.argv.indexOf('--mac') > -1) platforms.push('osx');
    if (process.argv.indexOf('--linux32') > -1) platforms.push('linux32');
    if (process.argv.indexOf('--linux64') > -1) platforms.push('linux64');

    // Build for All platforms
    if (process.argv.indexOf('--all') > -1) platforms = ['win', 'osx', 'linux32', 'linux64'];

    // If no platform where specified, determine current platform
    if (!platforms.length) {
        if (process.platform === 'darwin') platforms.push('osx');
        else if (process.platform === 'win32') platforms.push('win');
        else if (process.arch === 'ia32') platforms.push('linux32');
        else if (process.arch === 'x64') platforms.push('linux64');
    }

    // Initialize NodeWebkitBuilder
    var nw = new NodeWebkitBuilder({
        files: ['./package.json', './app/**/*'].concat(modules),
        cacheDir: './build/cache',
        platforms: platforms,
        macIcns: './app/assets/icons/play-icon.icns',
        winIco: './app/assets/icons/logo.ico',
        checkVersions: false
    });

    nw.on('log', function(msg) {
        // Ignore 'Zipping... messages
        if (msg.indexOf('Zipping') !== 0) console.log(msg);
    });

    // Build!
    nw.build(function(err) {

        if (!!err) {
            return console.error(err);
        }

        // Handle ffmpeg for Windows
        if (platforms.indexOf('win') > -1) {
            gulp.src('./deps/ffmpegsumo/win/*')
                .pipe(gulp.dest(
                    './build/' + mypackage.name + '/win'
                ));
        }

        // Handle ffmpeg for Mac
        if (platforms.indexOf('osx') > -1) {
            gulp.src('./deps/ffmpegsumo/osx/*')
                .pipe(gulp.dest(
                    './build/' + mypackage.name + '/osx/node-webkit.app/Contents/Frameworks/node-webkit Framework.framework/Libraries'
                ));
        }

        // Handle ffmpeg for Linux32
        if (platforms.indexOf('linux32') > -1) {
            gulp.src('./deps/ffmpegsumo/linux32/*')
                .pipe(gulp.dest(
                    './build/' + mypackage.name + '/linux32'
                ));
        }

        // Handle ffmpeg for Linux64
        if (platforms.indexOf('linux64') > -1) {
            gulp.src('./deps/ffmpegsumo/linux64/*')
                .pipe(gulp.dest(
                    './build/' + mypackage.name + '/linux64'
                ));
        }

        cb(err);
    })
});
