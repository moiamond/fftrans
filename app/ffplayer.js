/**
 * Created by moiamond on 5/2/15.
 */

var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath('./bin/win/x64/ffmpeg');
ffmpeg.setFfprobePath('./bin/win/x64/ffprobe');

var command = ffmpeg();

ffmpeg.getAvailableFormats(function(err, format) {
    console.log("Available format:");

    console.log(format);
});


console.log("ffmpeg test!!!");

