const utilities = require('../utilities');

exports.analyzeJPG = data => {
    let startOI = data.substring(0,4)

    let appHeader = analyzeApp(data)

    let quantTables = analyzeQuantTable(data)

    let fillerData = findFillData(data,appHeader.endofhead,quantTables[0].startIndex)

    let frameData = analyzeSOF(data)

    let huffmanTables = analyzeHuffmans(data)

    let sosData = analyzeSOS(data)
    let endOfSOS = sosData[2].endofframe


    let imageData = analyzeImageData(data,sosData[2].endofframe)

    console.log(imageData)
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

    console.log(sosData)
    return [{'section':'SOS'},{'bytes':sosData},{'endofframe':sosID+sosSize}]
}

function analyzeImageData(input,start) {
    let terminatorID = utilities.getIndicesOf('ffd9',input,false)

    return terminatorID
}
// Corkami's breakdown: https://github.com/corkami/formats/blob/master/image/jpeg.md


// Start of Frame - FFC0, has length
// Huffman tables - FFC4, has lengths, multiple
// Start of scan - FFDA, has a length
// Image Data - just raw data
// End of image - FFD9