const utilities = require('../utilities');

// to dos
    // MVP1 - analyze data correctly
        // scaffold out code
        // using test image, identify sections to test against when pulling data
        // test, correct
    // MVP2 - create separate files
        // could export gif analysis functions to the utilities section
        // then could create files from utilities page
    // MVP3 - a sort of 'dashboard' for...
        // GCT or LCTs
        // number of frames
        // per frame, disposal method

exports.gifAnalyze = (data, outname) => {

    // initial analysis - loop over file
        // identify start of different sections
        // analyze LSD for presence of GCT
        // save information to an object
            // section name
            // indexes of start and end
            // increment if multiple frames
    // looping
        // per item in array - create a new file (start + end, name)
       
    
    let gifStructure = []
    // object schema
        // section name
        // start index
        // end index
        // section number
    
    // structural
        // header
        let headerObj = {name:'header',start:0,end:5,section:1}
        gifStructure.push(headerObj)
            // first six bits
        // LSD
        let logicalSD = {name:'LSD',start:6,end:12,section:2}
            // 7 bits
            // 5th byte contains if GCT or not, size of color table
        // GCT if exists
        let globalCT = {name:'GCT', start:0,end:0,section:3}
            // 2, 4, 8, 16, 32, 64, 128, 256 colors
            // RGB - 3 bytes per color
        // application extension (if animation) - starts with 21 FF, ends with 00
        let appExt = {name:'AExt', start:0,end:0,section:4}
    // per frame
        // GCE - 8 bytes (optional)
            let graphicsCE = {name:'GCE', start:0,end:0,section:5}
            // packed fields contain transparency stuff
            // another bytes for which character is transparent
        // image descriptor - 10 bytes - per frame
        // local color table - ignore if GCT exists
            // same rules as GCT
        // image data
            // until end
        // plain text extension - ignored, but could be captured
        // comment extension - starts with 21 FE, ends with 00


    // trailer - 1 bytes, 3B    

    let trailer = data.slice()

    // then, create separate files
}
    
function hex2bin(hex){
    hex = hex.replace("0x", "").toLowerCase();
    var output = "";
    for(var c of hex) {
        switch(c) {
            case '0': out += "0000"; break;
            case '1': out += "0001"; break;
            case '2': out += "0010"; break;
            case '3': out += "0011"; break;
            case '4': out += "0100"; break;
            case '5': out += "0101"; break;
            case '6': out += "0110"; break;
            case '7': out += "0111"; break;
            case '8': out += "1000"; break;
            case '9': out += "1001"; break;
            case 'a': out += "1010"; break;
            case 'b': out += "1011"; break;
            case 'c': out += "1100"; break;
            case 'd': out += "1101"; break;
            case 'e': out += "1110"; break;
            case 'f': out += "1111"; break;
            default: return "";
        }
    }
    return output;
}

// returns LSD, other bits for later usage
function analyzeLSD(data){
    let logicalSD = data.slice(6,13)
    let packedField = logicalSD[4]
    let backgroundColorIndex = logicalSD[5]
    let packedFieldBin = hex2bin(packedField)
    let globalCTBool = utilities.binaryToBool(packedFieldBin[0])
    let globalCTSize = parseInt(packedFieldBin.slice(5,8),2)
    let gctByteSize;

    switch (globalCTSize) {
        case 0:
            gctByteSize=6;
            break;
        case 1:
            gctByteSize=12;
            break;
        case 2:
            gctByteSize=24;
            break;
        case 3:
            gctByteSize=48;
            break;
        case 4:
            gctByteSize=96;
            break;
        case 5:
            gctByteSize=192;
            break;
        case 6:
            gctByteSize=384;
            break;
        case 7:
            gctByteSize=768;
            break;
        default:
            gctByteSize=768
            break;
    }

    return [globalCTBool, globalCTSize, backgroundColorIndex,gctByteSize]
}

// returns GCT if it exists
function analyzeGCT(data, gctBool,gctByteSize){
    if (gctBool) {
        return data.slice(12,12+gctByteSize+1)
    } else {
        return null
    }
}

// pull app extension (for animations)
// could simplify by just slicing
function analyzeAppExt(data, start) {
    // is 19 bytes long
    // appears directly after global color table
}

// returns GCE, specific bytes for later usage
function analyzeGCE(data,gctSize) {
    let gceStart = 13 + gctSize;
    let gceBytes = data.slice(gceStart, 9)
    let gcePackedField = parseInt(hex2bin(gceBytes[4]),2)
    let delayTime = gceBytes.slice(5,7)
    let transparentColorIndex = gceBytes(7)

    return [gceBytes,gcePackedField, delayTime,transparentColorIndex]
}

// returns image descriptor
function analyzeImageDesc(data, start) {

}


// returns local color table if exists
function analyzeLCT(data, start) {

}

// returns image data
function analyzeImageData(data, start) {

}



// identifying
    // structural
        // ID header
        // ID LSD 
        // ID GCT 
        // ID application extension (if animation)
    // per frame
        // ID GCE 
        // ID image descriptor
        // ID local color table - ignore if GCT exists
        // ID image data
// create files
    // header
    // LSD
    // GCT
    // app ext
    // frames
        // GCE
        //image desc
        // LCT
        // image data

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

// // scrambling