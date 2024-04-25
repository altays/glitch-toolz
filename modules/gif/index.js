const utilities = require('../utilities');

// to dos
    // MVP1 - analyze data correctly
        // scaffold out code
        // using test image, identify sections to test against when pulling data
        // also get other test images - static with local color table, animation with local color tables and frames
        // test, correct
    // MVP2 - create separate files
        // could export gif analysis functions to the utilities section
        // then could create files from utilities page
    // MVP3 - a sort of 'dashboard' for...
        // GCT or LCTs
        // number of frames
        // per frame, disposal method

exports.gifAnalyze = (data) => {
    
    let gifStructure = []
    // object schema
        // section name
        // start index
        // end index
        // section number
    
    // structural
        // header
        let headerObj = analyzeHeader(data)
        let logicalSD = analyzeLSD(data)
        let globalCT = analyzeGCT(data,Object.values(logicalSD[2]))
        console.log(headerObj)
        console.log(logicalSD)
        console.log(globalCT)
        // console.log(logicalSD)
            // 7 bits
            // 5th byte contains if GCT or not, size of color table
        // GCT if exists
        // let globalCT = {name:'GCT', start:0,end:0,section:3}
            // 2, 4, 8, 16, 32, 64, 128, 256 colors
            // RGB - 3 bytes per color
        // application extension (if animation) - starts with 21 FF, ends with 00
        // let appExt = {name:'AExt', start:0,end:0,section:4}
    // per frame
        // GCE - 8 bytes (optional)
            // let graphicsCE = {name:'GCE', start:0,end:0,section:5}
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

    // let trailer = data.slice()

    // then, create separate files
}

function analyzeHeader(data) {
    return ["header",{"bytes":data.slice(0,12)}]
}
    
function hex2bin(hex){
    hex = hex.replace("0x", "").toLowerCase();
    let out = "";
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
    return out;
}

function analyzeLSD(data){
    let logicalSD = data.slice(12,26)
    let packedField = logicalSD.slice(8,10)
    let backgroundColorIndex = logicalSD.slice(10,12)
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

    return ["logicalScreenDesc",{"bytes":logicalSD},{"global colortable bool":globalCTBool}, {"global CT Size":globalCTSize},{"GCT Byte Size":gctByteSize},{"background color index":backgroundColorIndex}]
}

// returns Global Color Table OR local color if it exists
function analyzeGCT(data, gctBool,gctByteSize){
    if (gctBool) {
        return data.slice(12,12+gctByteSize+1)
    } else {
        return null
    }
}

// pull app extension (for animations)
// could simplify by just slicing
// function analyzeAppExt(data, start, bool) {
//     let appExt = data.slice(start,start+20)
    
//     // is 19 bytes long
//         // always starts with 21 FF, always ends with 00
//         // appears directly after global color table

//     if (bool) {
//         return appExt
//     }
//     else {
//         return null
//     }
// }

// returns GCE, specific bytes for later usage
// function analyzeGCE(data,gctSize) {
//     let gceStart = 13 + gctSize;
//     let gceBytes = data.slice(gceStart, 9)
//     let gcePackedField = parseInt(hex2bin(gceBytes[4]),2)
//     let delayTime = gceBytes.slice(5,7)
//     let transparentColorIndex = gceBytes(7)

//     return [gceBytes,gcePackedField, delayTime,transparentColorIndex]
// }

// returns image descriptor
// function analyzeImageDesc(data, start) {
//     // always begins with 2C, always 10 bytes
//     let imageDesc = data.slice(start,start+11)
//     let packedField = imageDesc[9]
//     let packedFieldBin = hex2bin(packedField)
//     let localCTBool = utilities.binaryToBool(packedFieldBin[0])
//     let globalCTSize = parseInt(packedFieldBin.slice(5,8),2)
//     let gctByteSize;

//     switch (globalCTSize) {
//         case 0:
//             gctByteSize=6;
//             break;
//         case 1:
//             gctByteSize=12;
//             break;
//         case 2:
//             gctByteSize=24;
//             break;
//         case 3:
//             gctByteSize=48;
//             break;
//         case 4:
//             gctByteSize=96;
//             break;
//         case 5:
//             gctByteSize=192;
//             break;
//         case 6:
//             gctByteSize=384;
//             break;
//         case 7:
//             gctByteSize=768;
//             break;
//         default:
//             gctByteSize=768
//             break;
//     }

//     return [localCTBool, localCTSize, gctByteSize]
// }

// returns local color table if exists
// function analyzeLCT(data, lctBool,lctByteSize){
//     if (lctBool) {
//         return data.slice(12,12+lctByteSizeByteSize+1)
//     } else {
//         return null
//     }
// }

// returns image data
// function analyzeImageData(data, start,end) {
//     return data.slice(start,end)
// }

// function analyzeCommentExt(data, start) {
//  // starts with 21 FE, ends with 00   
// }

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