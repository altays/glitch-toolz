const utilities = require('../utilities');
const fs = require('node:fs');

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

// ways to scramble

exports.bendQuant = (tableA, tableB) =>  {

    let tableArr = [tableA, tableB]
    console.log(tableA)
    console.log(tableB)

    for (let i = 0; i < tableArr.length; i++) {

        let table=tableArr[i]

        const data = fs.readFileSync(table,"utf-8");
        const tempData = data.split("")

        // target destination, if 0 swap to 1; if 1 swap to 0
        // console.log(data)
        // console.log(data[17])
        if (data[17]==1){
            // console.log("1 to 0")
            tempData[17]=0
        } else {
            // console.log("0 to 1")
            tempData[17]=1
        }

        console.log(tempData.join(""))
        
        // fs.writeFileSync(table,tempData.join(""))

    }
}

// Huff
    // 2 bits for marker
    // 2 bits for size
    // 1 bit for table ID - either 01 or 00
    // 16 bits - list bits, can't modifify
    // remaining bits - can be modified
        // if table ID is 0, can be between 0F and 00
        // if table ID is 1, table ID can be between 00 and FF

exports.bendHuffman = (tableA, tableB, tableC, tableD) => {
    console.log(tableA)
    console.log(tableB)
    console.log(tableC)
    console.log(tableD)
    // loop over array of tables
        // read text file
        // analyze text file
        // do the bending
        // save over text file
}

// SOS
    // 2 bits for marker
    // 2 bits for size
    // 1 bit for number of components
    // components - selector # and huffman table selection
        // can swap selector numbers between 01 and number of tables, non repeating
    // 2 bytes before end - beginning and end of spectral selection

exports.bendSOSComponents = data => {
    console.log(data)
    // read text file
    // analyze text file
    // do the bending
    // save over text file
}

exports.bendSOSSpectralSelection = data => {
    console.log(data)
    // read text file
    // analyze text file
    // do the bending
    // save over text file
}

exports.bendSOSApproxBites = data => {
    console.log(data)
    // read text file
    // analyze text file
    // do the bending
    // save over text file
}

exports.bendImageBody = data => {
    console.log(data)
    // read text file
    // analyze text file
    // do the bending
    // save over text file
}