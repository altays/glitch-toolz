const utilities = require('../utilities');

exports.analyzeJPG = data => {
    let startOI = data.substring(0,4)

    let appHeader = analyzeApp(data)

    let quantTables = analyzeQuantTable(data)

    let fillerData = findFillData(data,parseInt(appHeader.endofhead)+4,parseInt(quantTables[1].startIndex))

    // two extra bytes are ending up at the front - where is that coming from?
    // going until the end of the file - needs to stop at the beginnign of the quantization tables

    let frameData = analyzeSOF(data)

    let huffmanTables = analyzeHuffmans(data)

    let sosData = analyzeSOS(data)
    let endOfSOS = sosData[2].endofframe

    let imageData = analyzeImageData(data,sosData[2].endofframe)

    // continue adding to reutrn object - huffman tables
    
    return [
        {"index":'a',"section":"SOI","data":startOI},
        {"index":'b',"section":"APP","data":appHeader.bytes},
        {"index":'c',"section":"Fill","data":fillerData[0].bytes},
        {"index":'d',"section":"Quant1","data":quantTables[1].bytes},
        {"index":'e',"section":"Quant2","data":quantTables[2].bytes},
        {"index":'f',"section":"SOF","data":frameData[1].bytes},
        {"index":'g',"section":"Huff1","data":huffmanTables[1].bytes},
        {"index":'h',"section":"Huff2","data":huffmanTables[2].bytes},
        {"index":'i',"section":"Huff3","data":huffmanTables[3].bytes},
        {"index":'j',"section":"Huff4","data":huffmanTables[4].bytes},
        {"index":'k',"section":"SOS","data":sosData[1].bytes},
        {"index":'l',"section":"ImgData","data":imageData[0].imgbytes},
        {"index":'m',"section":"terminator","data":imageData[1].terminator}]
}

function analyzeApp (input) {
    let appHeadLength = input.substring(8,12)
    let appHeadDec = parseInt(utilities.hex2bin(appHeadLength),2)
    let wholeApp = input.substring(4,8+(appHeadDec *2))

    return {"bytes":wholeApp,"endofhead":wholeApp.length}
}

function findFillData (input, endOfHead, startOfQuant) {
    return [{'bytes':input.substring(endOfHead, startOfQuant)}]
}

function analyzeQuantTable (input) {
    let quantTables = [{'section':'quanttables'}]
    let quantTableIDs = utilities.getIndicesOf('ffdb0043',input,true)

    for (let i = 0; i < quantTableIDs.length; i++) {
        quantTables.push({"startIndex":quantTableIDs[i],"bytes":input.substring(parseInt(quantTableIDs[i]),parseInt(quantTableIDs[i])+parseInt(138)),"destination":input.substring(parseInt(quantTableIDs[i])+8,parseInt(quantTableIDs[i])+parseInt(10))})
    }
    
    return quantTables
}

function analyzeSOF(input) {
    let sofTableIDs = utilities.getIndicesOf('ffc00011',input,true)

    let sofData = input.substring(parseInt(sofTableIDs),parseInt(sofTableIDs)+38)

    return [{'section':'SOF'},{'bytes':sofData}]
}

function analyzeHuffmans(input) {
    let huffmanIDs = utilities.getIndicesOf('ffc400',input,true)

    let huffmanTables = [{'section':'huffman table'}]
    
    for (let i = 0; i < huffmanIDs.length; i++) {
        let tableID = parseInt(huffmanIDs[i])
        let tableSize = parseInt(utilities.hex2bin(input.substring(tableID+4,tableID+8)),2)
        let tableBytes = input.substring(tableID,tableID+(tableSize*2)+4)

        huffmanTables.push({"table1D":i,"bytes":tableBytes})
    }
    
    return huffmanTables
}

function analyzeSOS(input) {
    let sosData;
    let sosID = parseInt(utilities.getIndicesOf('ffda000c',input,false))
    let sosSize = 2 * parseInt(utilities.hex2bin('000c'),2)
    
    sosData = input.substring(sosID,sosID+sosSize)

    // console.log(sosData)
    return [{'section':'SOS'},{'bytes':sosData},{'endofframe':sosID+sosSize}]
}

function analyzeImageData(input,start) {
    let fileLen = parseInt(input.length)/2 

    let termStart = fileLen - 2

    let terminator = input.substring(termStart*2,fileLen*2)

    let imgData = input.substring(parseInt(start),termStart*2)
    // let imgData = input.substring(parseInt(start),parseInt(start)+16 )

    return [{"imgbytes":imgData},{"terminator":terminator}]
}
// Corkami's breakdown: https://github.com/corkami/formats/blob/master/image/jpeg.md


// Start of Frame - FFC0, has length
// Huffman tables - FFC4, has lengths, multiple
// Start of scan - FFDA, has a length
// Image Data - just raw data
// End of image - FFD9