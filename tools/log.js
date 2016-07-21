const Console = require('console').Console;
const fs = require('fs');

exports.logger = function(outputFile, errorOutputFile) {
    const output      = fs.createWriteStream(outputFile);
    const errorOutput = fs.createWriteStream(errorOutputFile);

    return new Console(output, errorOutput);
};
