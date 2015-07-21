var fs = require('fs'),
    ffmpeg = require('fluent-ffmpeg'),
    winston = require('winston');

// Set ffmpeg path
ffmpeg.setFfmpegPath('./bin/win/x64/ffmpeg');

var infs = fs.createReadStream('./20150626_MOV-DV50_001.mov');

infs.on('error', function(err) {
    console.log(err);
});

var proc = ffmpeg(infs, {logger: new winston.Logger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: './somefile.log' })
    ]
})})
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .keepDAR()
    // setup event handlers
    .on('progress', function(info) {
        console.log('progress ' + info.percent + '%');
    })
    .on('end', function() {
        console.log('done processing input stream');
    })
    .on('error', function(err, stdout, stderr) {
        console.log('an error happened: ' + err.message);
        console.log("stdout:\n" + stdout);
        console.log("stderr:\n" + stderr); //this will contain more detailed debugging info
    })
    .save('./your_target.mp4');