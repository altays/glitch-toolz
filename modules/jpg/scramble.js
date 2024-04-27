exports.scrambleJPG = (data, folders, options) => {
    // declare variables for folder data
        // object structure:
            // name of section
            // data
   
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