const fs = require('node:fs');
const utilities = require('./modules/utilities');
const path = require('node:path');

[nodePath, filePath, route, input, format, ...args] = process.argv;

let inputFormat, outputFormat;

switch (route) {
    case 'analyze':
        inputFormat = utilities.defaultValue(input, null)
        // console.log(`analyzing ${input} and saving to ${output}`);
        utilities.analyze(input, inputFormat)
        break;
    case 'compile':
        outputFormat = utilities.defaultValue(input, 'txt')
        // console.log(`compiling ${input} and saving to ${output}`);
        utilities.compile(input, format)
        break;
    case 'test':
        console.log(path.dirname('.'))
        
    // case 'scrambling':
    //     console.log(`scrambling ${input} and saving to ${output}`);
    //     console.log(inputFormat)
    //     break;
    default:
        console.log(`Please indicate a route (analyze, compile), an input file, and an output file. Input and output files do not need routes. Or, check out the package.json file for test scripts`);
}