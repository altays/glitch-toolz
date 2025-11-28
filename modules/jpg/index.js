const utilities = require('../utilities');

exports.analyzeJPG = data => {
    let startOI = data.substring(0,4)
    let appHeader = analyzeApp(data)
    let quantTables = analyzeQuantTable(data)
    let fillerData = findFillData(data,parseInt(appHeader.endofhead)+4,parseInt(quantTables[1].startIndex))
    let frameData = analyzeSOF(data)
    let huffmanTables = analyzeHuffmans(data)
    let sosData = analyzeSOS(data)
    let endOfSOS = sosData.endofframe
    let imageData = analyzeImageData(data,endOfSOS)
    
    return [
        {"index":'a',"section":"SOI","data":startOI},
        {"index":'b',"section":"APP","data":appHeader.bytes},
        {"index":'c',"section":"Fill","data":fillerData.bytes},
        {"index":'d',"section":"Quant1","data":quantTables[1].bytes},
        {"index":'e',"section":"Quant2","data":quantTables[2].bytes},
        {"index":'f',"section":"SOF","data":frameData.bytes},
        {"index":'g',"section":"Huff1","data":huffmanTables[1].bytes},
        {"index":'h',"section":"Huff2","data":huffmanTables[2].bytes},
        {"index":'i',"section":"Huff3","data":huffmanTables[3].bytes},
        {"index":'j',"section":"Huff4","data":huffmanTables[4].bytes},
        {"index":'k',"section":"SOS","data":sosData.bytes},
        {"index":'l',"section":"ImgData","data":imageData.imgbytes},
        {"index":'m',"section":"terminator","data":imageData.terminator}
    ]
}

function analyzeApp (input) {
    let appHeadLength = input.substring(8,12)
    let appHeadDec = parseInt(utilities.hex2bin(appHeadLength),2)
    let wholeApp = input.substring(4,8+(appHeadDec *2))

    return {"bytes":wholeApp,"endofhead":wholeApp.length}
}

function findFillData (input, endOfHead, startOfQuant) {
    return {'bytes':input.substring(endOfHead, startOfQuant)}
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

    return {'section':'SOF','bytes':sofData}
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

    return {'section':'SOS','bytes':sosData,'endofframe':sosID+sosSize}
}

function analyzeImageData(input,start) {
    let fileLen = parseInt(input.length)/2 
    let termStart = fileLen - 2
    let terminator = input.substring(termStart*2,fileLen*2)
    let imgData = input.substring(parseInt(start),termStart*2)

    return {"imgbytes":imgData,"terminator":terminator}
}

exports.scrambleJPG = (data, folders, options) => {
   
    let jpgStructure = [
        {"index":'a',"section":"SOI","data":""},
        {"index":'b',"section":"APP","data":""},
        {"index":'c',"section":"Fill","data":""},
        {"index":'d',"section":"Quant1","data":""},
        {"index":'e',"section":"Quant2","data":""},
        {"index":'f',"section":"SOF","data":""},
        {"index":'h',"section":"Huff2","data":""},
        {"index":'i',"section":"Huff3","data":""},
        {"index":'g',"section":"Huff1","data":""},
        {"index":'j',"section":"Huff4","data":""},
        {"index":'k',"section":"SOS","data":""},
        {"index":'l',"section":"ImgData","data":""},
        {"index":'m',"section":"terminator","data":""}
    ]

    for (let i = 0; i < folders.length; i++ ) {
        jpegStructure[i].data = folders[i].data
    }


    // analyze data
        // update objects with relevant data

    // process data in objects

    // reassemble output object
    
    // unbendable
        // let startOI = data.substring(0,4)
        // let appHeader = analyzeApp(data)
        // let fillerData = findFillData(data,parseInt(appHeader.endofhead)+4,parseInt(quantTables[1].startIndex))
        // let frameData = analyzeSOF(data)

    // bendable
    //// should bending be on input files or data?
        // let quantTables = analyzeQuantTable(data)
        // let huffmanTables = analyzeHuffmans(data)
        // let sosData = analyzeSOS(data)
        // let endOfSOS = sosData[2].endofframe
        // let imageData = analyzeImageData(data,endOfSOS)
    
    return [
        // {"index":'a',"section":"SOI","data":startOI},
        // {"index":'b',"section":"APP","data":appHeader.bytes},
        // {"index":'c',"section":"Fill","data":fillerData[0].bytes},
        // {"index":'d',"section":"Quant1","data":quantTables[1].bytes},
        // {"index":'e',"section":"Quant2","data":quantTables[2].bytes},
        // {"index":'f',"section":"SOF","data":frameData[1].bytes},
        // {"index":'g',"section":"Huff1","data":huffmanTables[1].bytes},
        // {"index":'h',"section":"Huff2","data":huffmanTables[2].bytes},
        // {"index":'i',"section":"Huff3","data":huffmanTables[3].bytes},
        // {"index":'j',"section":"Huff4","data":huffmanTables[4].bytes},
        // {"index":'k',"section":"SOS","data":sosData[1].bytes},
        // {"index":'l',"section":"ImgData","data":imageData[0].imgbytes},
        // {"index":'m',"section":"terminator","data":imageData[1].terminator}
    ]
}
// ways to scramble



// Quantz
    // first two bits are marker
    // next two are length
    // next is the destination - 00 or 01
        // can swap 01 and 00
    // rest is the quantization table itself
        // can be changed to whatever

function reanalyzeQuant (data)  {
    return data
}

function scrambleQuant (data)  {
    return data
}

// Huff
    // 2 bits for marker
    // 2 bits for size
    // 1 bit for table ID - either 01 or 00
    // 16 bits - list bits, can't modifify
    // remaining bits - can be modified
        // if table ID is 0, can be between 0F and 00
        // if table ID is 1, table ID can be between 00 and FF

function reanalyzeHuffmanTables (data)  {
    return data
}

function scrambleHuffman(data) {
    return data
}

// SOS
    // 2 bits for marker
    // 2 bits for size
    // 1 bit for number of components
    // components - selector # and huffman table selection
        // can swap selector numbers between 01 and number of tables, non repeating
    // 2 bytes before end - beginning and end of spectral selection

function reanalyzeSOS (data) {
    let sosStructure = {"raw-data":data,"marker":data.substring(0,4),"size":data.substring(4,8),"componentNum":data.substring(8,10),"components":"","spectral-selection":data.substring(parseInt(data.length)-6,parseInt(data.length)-2),"approx":data.substring(parseInt(data.length)-2,parseInt(data.length))}
    return sosStructure
}

function scrambleSOS (data) {
    return data
}

// Img data
    // replacing chunks with whatever
    // process like with natural language processing?