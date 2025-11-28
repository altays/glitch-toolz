const fs = require('node:fs');
const utilities = require('./modules/utilities');
const path = require('node:path');

[nodePath, filePath, route, input, format, ...args] = process.argv;

let inputFormat, outputFormat;

switch (route) {
    case 'analyze':
        inputFormat = utilities.defaultValue(input, null)
        utilities.analyze(input, inputFormat)
        break;
    case 'compile':
        outputFormat = utilities.defaultValue(input, 'txt')
        utilities.compile(input, format)
        break;
    case 'test':
        console.log(path.dirname('.'))
        
    case 'scramble':
        // console.log(`scrambling ${input} and saving to ${output}`);
        console.log(inputFormat)
        utilities.scramble(input,format,options)
        break;
    default:
        console.log(`Please indicate a route (analyze, compile), an input file, and an output file. Input and output files do not need routes. Or, check out the package.json file for test scripts`);
}