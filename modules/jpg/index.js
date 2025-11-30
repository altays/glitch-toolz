const { markovChain } = require('../../../../computer-poetry/text-reconstructing/Text-Reconstruction/scripts/word-processing');
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

exports.bendHuffman = (tableA, tableB, tableC, tableD) => {
    let tableArr = [tableA, tableB, tableC, tableD]
    
    for (let i = 0; i < tableArr.length; i++) {

        if (utilities.coinflip(true,false)) {

            let table = tableArr[i]
            const data = fs.readFileSync(table);
            let dataStr = data.toString('hex')
            let marker = dataStr.substring(0,4)
            let size = dataStr.substring(4,8)
            let tableID = dataStr.substring(8,10)
            let listBits = dataStr.substring(10,26)
            let modBits = dataStr.substring(26,).split('')

            let ogHuffman = marker+size+tableID+listBits+modBits.join('')
            // if tableID is 00, swap a random bit with a value between 00 and 0F
            // if tableID is 01, swap a random bit with a value between 00 and FF

            if (tableID == "00" || tableID == "01" ) {
                let randomID = utilities.evenRound(utilities.getRandomIntInclusive(1,(modBits.length-1)))-1
                let randomHexVal = utilities.getRandomHexValue()
                modBits.splice(randomID,1,randomHexVal)
        
            } else {
                let randomID = utilities.evenRound(utilities.getRandomIntInclusive(1,(modBits.length-1)))-1
                let randomHexValA = utilities.getRandomHexValue()
                let randomHexValB = utilities.getRandomHexValue()

                modBits.splice(randomID,1,randomHexValA)
                modBits.splice(randomID+1,1,randomHexValB)
            }

            modBits=modBits.join('')
            let newHuffman = marker + size + tableID + listBits + modBits
            fs.writeFileSync(table,newHuffman,"hex")

        }

    }

}

exports.bendSOSComponents = (sosTable,huffTableA,huffTableB,huffTableC,huffTableD) => {

    // component table
    const data = fs.readFileSync(sosTable);
    let dataStr = data.toString('hex')

    let marker=dataStr.substring(0,4)
    let length=dataStr.substring(4,8)
    let componentCount=dataStr.substring(8,10)
    let components=dataStr.substring(10,22)
    let spectralSelection=dataStr.substring(22,26)
    let successiveApprox=dataStr.substring(26,28)

    // huffman tables - just need the ids
    const huffTableAData = fs.readFileSync(huffTableA).toString('hex');
    let hufftableIDA = huffTableAData.substring(8,10)
    const huffTableBData = fs.readFileSync(huffTableB).toString('hex');
    let hufftableIDB = huffTableBData.substring(8,10)
    const huffTableCData = fs.readFileSync(huffTableC).toString('hex');
    let hufftableIDC = huffTableCData.substring(8,10)
    const huffTableDData = fs.readFileSync(huffTableD).toString('hex');
    let hufftableIDD = huffTableDData.substring(8,10)

    let componentGroupSelA = components.substring(0,2)
    let componentGroupTableA = components.substring(2,4)
    let componentGroupSelB = components.substring(4,6)
    let componentGroupTableB = components.substring(6,8)
    let componentGroupSelC = components.substring(8,10)
    let componentGroupTableC = components.substring(10,12)

    let componentGroupTableArr = [undefined, undefined, undefined]

    for (let i = 0; i<componentGroupTableArr.length; i++){

        let bendProbability=(utilities.getRandomIntInclusive(0,100)/100)

        if ((bendProbability > 0) && (bendProbability <=0.25)) {
            componentGroupTableArr[i]=hufftableIDA            
        } else if ((bendProbability > 0.25) && (bendProbability <=0.5)) {
            componentGroupTableArr[i]=hufftableIDB
        } else if ((bendProbability > 0.5) && (bendProbability <=0.75)) {
            componentGroupTableArr[i]=hufftableIDC
        } else {
            componentGroupTableArr[i]=hufftableIDD
        }
    }
    
    let newComponents = componentGroupSelA + componentGroupTableArr[0] + componentGroupSelB + componentGroupTableArr[1] + componentGroupSelC + componentGroupTableArr[2]
    let newSOS = marker + length + componentCount + newComponents + spectralSelection + successiveApprox
    
    fs.writeFileSync(sosTable,newSOS,"hex")
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

    const table = fs.readFileSync(data);
    let tableStr = table.toString('hex')

    let newBody = tableStr
    let newBodyArr = tableStr.split('')


    console.log(typeof tableStr)

    // let revBody=newBody.split('').reverse().join("")

    console.log(revBody.length)

    // let markov, markovNew;
    // markovNew=1;

    // for (let i = 0; i < tableStr.length; i+= markovNew.length) {
    //     markovNew=utilities.markovChain(tableStr,10)
    //     markov += markovNew
    //     console.log(i)
    // }


    // methods of scrambling
        // markov chain - taking a long time, figure out how to optimize
            // work out patterns
            // create chains based on length of original body
        // reverse
            // chunks
            // whole block
        // sort
            // chunks
            // whole block

    
    

    fs.writeFileSync(data,revBody,"hex")

}