/**
 * Created by moiamond on 5/2/15.
 */

var fs = require('fs');

var ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath('./bin/osx/x64/ffmpeg');
ffmpeg.setFfprobePath('./bin/osx/x64/ffprobe');

var command = ffmpeg();

ffmpeg.getAvailableFormats(function(err, format) {
    console.log("Avaliable format:");

    console.log(format);
});


console.log("ffmpeg test!!!");

