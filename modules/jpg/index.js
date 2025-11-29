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
    let sosSize = (2 * parseInt(utilities.hex2bin('000c'),2) ) + 4  
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

    for (let i = 0; i < tableArr.length; i++) {

        let table=tableArr[i]

        const data = fs.readFileSync(table);
        let dataArr = data.toString('hex').split("")

        if (dataArr[9]==1){
            dataArr[9]=0
        } else {
            dataArr[9]=1
        }

        let dataStr = dataArr.join("")
        
        fs.writeFileSync(table,dataStr,"hex")

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
    let tableArr = [tableA, tableB, tableC, tableD]
    
    for (let i = 0; i < tableArr.length; i++) {

        if (utilities.coinflip(true,false)) {

            let table = tableArr[i]

            const data = fs.readFileSync(table);
            let dataStr = data.toString('hex')
            // console.log(dataStr)
            // console.log('dataStr',dataStr.length)

            let marker = dataStr.substring(0,4)
            // console.log(marker)
            let size = dataStr.substring(4,8)
            // console.log(size)
            // console.log(parseInt(size,16))
            let tableID = dataStr.substring(8,10)
            // console.log(tableID)
            let listBits = dataStr.substring(10,26)
            // console.log(listBits)
            let modBits = dataStr.substring(26,).split('')

            let ogHuffman = marker+size+tableID+listBits+modBits.join('')
            // console.log('oghuffman', ogHuffman.length)
            // console.log('array', modBits)
            // if tableID is 00, swap a random bit with a value between 00 and 0F
            // if tableID is 01, swap a random bit with a value between 00 and FF

            if (tableID == "00" || tableID == "01" ) {
                let randomID = utilities.evenRound(utilities.getRandomIntInclusive(1,(modBits.length-1)))-1
                let randomHexVal = utilities.getRandomHexValue()
                console.log(randomHexVal)
                modBits.splice(randomID,1,randomHexVal)
        
            } else {
                let randomID = utilities.evenRound(utilities.getRandomIntInclusive(1,(modBits.length-1)))-1
                let randomHexValA = utilities.getRandomHexValue()
                let randomHexValB = utilities.getRandomHexValue()
                console.log(randomHexValA)
                console.log(randomHexValB)

                modBits.splice(randomID,1,randomHexValA)
                modBits.splice(randomID+1,1,randomHexValB)
            }

            modBits=modBits.join('')

            let newHuffman = marker + size + tableID + listBits + modBits
            console.log(dataStr)
            console.log(newHuffman)
    
            fs.writeFileSync(table,newHuffman,"hex")

            console.log('=====================')

        }

    }

}

// SOS
    // 2 bits for marker
    // 2 bits for size
    // 1 bit for number of components
    // components - selector # and huffman table selection
        // can swap selector numbers between 01 and number of tables, non repeating
    // 2 bytes before end - beginning and end of spectral selection
    // 1 byte - approx byte

exports.bendSOSComponents = (table,config) => {

    // dig into this more - it's not working 100%

    const data = fs.readFileSync(table);
    let dataStr = data.toString('hex')

    let marker=dataStr.substring(0,4)
    let length=dataStr.substring(4,8)
    let componentCount=dataStr.substring(8,10)
    let components=dataStr.substring(10,22)
    let spectralSelection=dataStr.substring(22,26)
    let successiveApprox=dataStr.substring(26,28)

    console.log(dataStr)

    console.log('componentCount: ', componentCount)
    console.log('components: ', components)
    let componentGroupSelA = components.substring(0,2)
    let componentGroupTableA = components.substring(2,4)
    let componentGroupSelB = components.substring(4,6)
    let componentGroupTableB = components.substring(6,8)
    let componentGroupSelC = components.substring(8,10)
    let componentGroupTableC = components.substring(10,12)

    let newComponentGroup = ""
    let newComponentGroupA = ""
    let newComponentGroupB = ""
    let newComponentGroupC = ""

    // randomly swap first 2 numbers of each component group
    // console.log('og components', componentGroupSelA,componentGroupTableA,componentGroupSelB,componentGroupTableB,componentGroupSelC,componentGroupTableC)

    let modChanceArr = [0,1,2]
    let newArr = utilities.shuffle(modChanceArr)
    console.log(newArr)

    // console.log('mod chances', componentGroupAModChance, componentGroupBModChance, componentGroupCModChance)
    
    switch (newArr[0]) {
    case 0:
        newComponentGroupA = componentGroupSelA
        break;
    case 1:
        newComponentGroupA = componentGroupSelB
        break;
    case 2:
        newComponentGroupA = componentGroupSelC
        break;
    default:
        console.log(`Invalid Num`);
    }

    switch (newArr[1]) {
    case 0:
        newComponentGroupB = componentGroupSelA
        break;
    case 1:
        newComponentGroupB = componentGroupSelB
        break;
    case 2:
        newComponentGroupB = componentGroupSelC
        break;
    default:
        console.log(`Invalid Num`);
    }

    switch (newArr[2]) {
    case 0:
        newComponentGroupC = componentGroupSelA
        break;
    case 1:
        newComponentGroupC = componentGroupSelB
        break;
    case 2:
        newComponentGroupC = componentGroupSelC
        break;
    default:
        console.log(`Invalid Num`);
    }

    newComponentGroup = newComponentGroupA + componentGroupTableA + newComponentGroupB + componentGroupTableB + newComponentGroupC + componentGroupTableC

    console.log('new components', newComponentGroupA , componentGroupTableA , newComponentGroupB , componentGroupTableB , newComponentGroupC , componentGroupTableC)

    let newSOS = marker + length + componentCount + newComponentGroup + spectralSelection + successiveApprox
    console.log(newSOS)
    
    fs.writeFileSync(table,newSOS,"hex")
    // ffda
    // 000c
    // 03
    // 0100
    // 0311
    // 0211
    // 003f00

}

exports.bendSOSSpectralSelection = table => {
    const data = fs.readFileSync(table);
    let dataStr = data.toString('hex')

    let marker=dataStr.substring(0,4)
    let length=dataStr.substring(4,8)
    let componentCount=dataStr.substring(8,10)
    let components=dataStr.substring(10,22)
    let spectralSelection=dataStr.substring(22,26)
    let successiveApprox=dataStr.substring(26,28)

    let newSpectralNumA = utilities.getRandomHexValue() + utilities.getRandomHexValue()
    let newSpectralNumB = utilities.getRandomHexValue() + utilities.getRandomHexValue()
    let newSpectralPair;
    
    if (parseInt(newSpectralNumA,16)>parseInt(newSpectralNumB,16)){
        newSpectralPair = newSpectralNumB + newSpectralNumA
    } else {
        newSpectralPair = newSpectralNumA + newSpectralNumB
    }

    let newSOS = marker + length + componentCount + components + newSpectralPair + successiveApprox
    
    fs.writeFileSync(table,newSOS,"hex")
}

exports.bendSOSApproxBytes = table => {
    const data = fs.readFileSync(table);
    let dataStr = data.toString('hex')

    let marker=dataStr.substring(0,4)
    let length=dataStr.substring(4,8)
    let componentCount=dataStr.substring(8,10)
    let components=dataStr.substring(10,22)
    let spectralSelection=dataStr.substring(22,26)
    let successiveApprox=dataStr.substring(26,28)

    let newSuccessApprox = ""

    for (let i = 0; i < 2; i++) {
        newSuccessApprox+=utilities.getRandomHexValue()
    }

    let newSOS = marker + length + componentCount + components + spectralSelection + newSuccessApprox
    
    fs.writeFileSync(table,newSOS,"hex")
}

exports.bendImageBody = data => {
    console.log(data)
    // read text file
    // analyze text file
    // do the bending
        // could shuffle array
        // could sort array
        // could use markov chains
    // save over text file
}