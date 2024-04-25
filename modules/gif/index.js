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
    
    // let gifData = data.split("")
    let gifStructure = []
    // object schema
        // section name
        // start index
        // end index
        // section number
    
    // structural
        let headerObj = analyzeHeader(data)
        let headerLegnth = Object.values(headerObj[1])[0].length
        let logicalSD = analyzeLSD(data)
        let logicalSDLength = Object.values(logicalSD[1])[0].length

        // toggle - if exists then run, otherwise skip
        let globalCT = analyzeGCT(data,Object.values(logicalSD[2]),Object.values(logicalSD[4]))
        let globalCTlength = Object.values(logicalSD[4])[0]

        let imageDescInfo = countImageDesc(data)
        
        // loop over based on number of image descs OR graphicsCE
            // if GCE exists, loop overGCE
            // if GCE doesn't exist, loop ove

        // let graphicsCE = analyzeGCE(data)
        
        let localColorTable = analyzeLCT(data,Object.values(imageDescInfo[0])[2],Object.values(imageDescInfo[0])[3])
        console.log(imageDescInfo)

        // GCE -> image desc -> lct (maybe) -> image data
        // or image desc -> lct (maybe) -> image data

        // need to come back to the appllication Ext when I have an animation I can work with
        // let applicationExt = analyzeAppExt(data, headerLegnth+logicalSDLength+globalCTlength)
        
        // console.log(graphicsCE)

        // combining together
            // rearrange in array order based on gif structure, name of section
        
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

function analyzeGCT(data, gctBool,gctByteSize){
    if (gctBool == "true") {
        return data.slice(12,12+parseInt(gctByteSize))
    } else {
        return null
    }
}

// come back to this with an animated gif
function analyzeAppExt(data, start) {
    // let appExt = data.slice(start,start+20)

    // let hex = hex2bin(appExt)
    // let appExt = data.search("21FF")
    // console.log(appExt)
    // is 19 bytes long
        // always starts with 21 FF, always ends with 00
        // appears directly after global color table
    // return appExt
    // if (bool) {
        // return hex
    // }
    // else {
    //     return null
    // }
}

// wait until I have an animation to use
// returns GCE, specific bytes for later usage
function analyzeGCE(data) {
    // let gceBytes = data.slice(gceStart, 9)
    // let gcePackedField = parseInt(hex2bin(gceBytes[4]),2)
    // let delayTime = gceBytes.slice(5,7)
    // let transparentColorIndex = gceBytes(7)
    // need a better way to find this section
    let gceStart = data.search('21f904')
    let gceBytes = data.slice(parseInt(gceStart), gceStart+20)


    return gceBytes

    // return [gceBytes,gcePackedField, delayTime,transparentColorIndex]
}

// currently just pulling image descriptors that start at 00, 00
function countImageDesc(data){
    let searchTerm = "2c"

    let rawImgDescIndeces = utilities.getIndicesOf(searchTerm,data,true)

    let imgDescArray = [];

    for (let i = 0; i < rawImgDescIndeces.length; i++) {
        let bytes = data.substring(parseInt(rawImgDescIndeces[i]),parseInt(rawImgDescIndeces[i])+20)
        
        if (bytes.substring(0,10)=="2c00000000") {
            
            let packedField = hex2bin(bytes.slice(18,20))
            let localCT = utilities.binaryToBool(packedField[0])
            let lctSize = parseInt(packedField.slice(5,8),2)
            let lctByteSize;

            switch (lctSize) {
                case 0:
                    lctByteSize=6;
                    break;
                case 1:
                    lctByteSize=12;
                    break;
                case 2:
                    lctByteSize=24;
                    break;
                case 3:
                    lctByteSize=48;
                    break;
                case 4:
                    lctByteSize=96;
                    break;
                case 5:
                    lctByteSize=192;
                    break;
                case 6:
                    lctByteSize=384;
                    break;
                case 7:
                    lctByteSize=768;
                    break;
                default:
                    lctByteSize=768
                    break;
            }

            imgDescArray.push({"index":rawImgDescIndeces[i],"bytes":bytes, "local color table":localCT, "local color table size":lctByteSize})   
        }        
    }

    return imgDescArray
}
// returns local color table if exists
function analyzeLCT(data, lctBool,lctByteSize){
    if (lctBool) {
        return data.slice(12,12+lctByteSize+1)
    } else {
        return null
    }
}

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