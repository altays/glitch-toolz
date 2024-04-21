const fs = require('node:fs');
const utilities = require('./modules/utilities');

[nodePath, filePath, route, input, output, ...args] = process.argv;

const inputFormat = input.slice(-3)
const outputFormat = output.slice(-3)

switch (route) {
    case 'analyze':
        console.log(`analyzing ${input} and saving to ${output}`);
        utilities.analyze(input, output, inputFormat)
        break;
    case 'compile':
        console.log(`compiling ${input} and saving to ${output}`);
        utilities.compile(input, output, outputFormat)
        break;
    // case 'scrambling':
    //     console.log(`scrambling ${input} and saving to ${output}`);
    //     console.log(inputFormat)
    //     break;
  default:
    console.log(`Please indicate a route (analyze, compile), an input file, and an output file. Input and output files do not need routes. For instance, node scripts/index.js analyze infile.jpg outfile`);
}



// using CLI
// // grammar
// // // node index.js -analyze inputfile -> analyze file, store data, do some analysis
// // // node index.js -scramble format thing options -> scramble thing in this format, using these options
// // // node index.js -compile output
// // MVPs
// // // console logs
// // // store file data
// // // read file data and create a new one
// // // formatting and processing -> below

// MVP3 - processing

// updating skeleton
// GIF processing
// // 1 - break file into chunks -  save NOTABLE individual sections as txt files in a folder (including other data that is necessary but can't be manipulated)
// // // header
// // // logical screen descriptor - read bytes, flow if GCT
// // // global color table if exists - from LSD, if exists and how big
// // // application extension if exists (will ID as animation)
// // // frames
    // // // GCE
    // // // image descriptor
    // // // local color table if exists -> save a copy, scramble copy
    // // // image data -> save a copy, scramble copy
// // // // terminator
// // 2 - compiling a gif
// // // loop over directory, save data per txt file
// // // from individual sections saved as txt files, combine into one gif file
// // 3 - manipulating sections - in general, make a copy, scramble copy
// // // manipulate color table
// // // if GCEs exists, manipulating transitions
// // // manipulating image data (shuffle, randomize, use text analysis)

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