const fs = require('node:fs');
const utilities = require('./modules/utilities');
const path = require('node:path');

[nodePath, filePath, route, input, output, ...args] = process.argv;

let inputFormat, outputFormat;

switch (route) {
    case 'analyze':
        inputFormat = utilities.defaultValue(input, null)
        // console.log(`analyzing ${input} and saving to ${output}`);
        utilities.analyze(input, output, inputFormat)
        break;
    case 'compile':
        outputFormat = utilities.defaultValue(output, 'txt')
        // console.log(`compiling ${input} and saving to ${output}`);
        utilities.compile(input, output, outputFormat)
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

// MVP3 - processing



// JPEG processing
// // 1 - break file into chunks - save NOTABLE individual sections as txt files in a folder (including other data that is necessary but can't be manipulated)
// // // head
// // // huffman tables, quantization tables, SOS markers, body
// // // all other data as needed
// // 2 - recompile jpeg from saved data
// // 3 - manipualting sections
    // // // huffman tables - lots of stuff
    // // // quantization tables
    // // // SOS markers
    // // // body - remixing

// AVI processing
// // 1 - break file into chunks, save NOTABLE individual sections as txt files in a folder (including other data that is necessary but can't be manipulated)
// // 2