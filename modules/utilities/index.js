const fs = require('node:fs');
const path = require('node:path')
const gif = require('../gif');
const jpg = require('../jpg');

let homePath = path.basename(`./assets/`)
let dataPath = path.join(homePath,'/data/')
let inputPath = path.join(homePath,'/input/')
let outputPath = path.join(homePath,'/output/')

exports.analyze = (input, format) => {   
    const data = fs.readFileSync(path.join(inputPath,`${input}`), "hex");
    let outputName = input.slice(0,-4)
    let dataFolderPath = path.join(dataPath,outputName);
    let pathIncrement = 0;

    fs.readdir(dataPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        
        let fileNameCheck = files.includes(outputName)

        if (!fileNameCheck) {
            try {
                fs.mkdirSync(dataFolderPath)
                formatSelectAnalyze(format,data,outputName,dataFolderPath)
            } catch (err) {
                console.log(err)
            }

        } else {
            while (fileNameCheck == true) {
                // refine this - adds a number to end of folder name
                outputName+= pathIncrement
                fileNameCheck = files.includes(outputName)
                pathIncrement++ 
            }

            dataFolderPath=path.join(dataPath,outputName);

            try {
                fs.mkdirSync(dataFolderPath)
                formatSelectAnalyze(format,data,outputName,dataFolderPath)
            } catch (err) {
                console.log(err)
            }
        }
    }); 
}

exports.compile = (input, format) => {
    let allData = ""
    let outputName = `${input}-compiled`

    let folderPath = path.join(dataPath,input)
    let filePath = path.join(outputPath,`${outputName}.${format}`)

    if (fs.existsSync(filePath)) { 
        filePath = path.join(outputPath,`${outputName}-${parseInt(Date.now()/1000)}.${format}`)
    }
    
    fs.readdirSync(folderPath).forEach(filename => {
        const hexData = fs.readFileSync(path.join(folderPath,filename), 'hex');
        allData += hexData
    });
    
    fs.writeFileSync(filePath,allData,"hex")
}

exports.bending = (input, format, options) => {   
    
    // setting up for bending JPGs currently
        // will need to break this out into modules after the jpg functionality is worked out
    // target bending data folder
    // based on option, bend the table, write directly to the txt file

    let optionsArr = options.split('');
    let folderPath = path.join(dataPath,input)
    let table = ""
    let filePath
    let tableA, tableB, tableC, tableD

    for (let i = 0; i < optionsArr.length;i++) {
        switch (optionsArr[i]) {
            case 'q':
                // console.log('quant-tables')
                tableA = path.join(folderPath,"d-Quant1.txt")
                tableB = path.join(folderPath,"e-Quant2.txt")
                // tableA = "d-Quant1.txt"
                // tableB = "e-Quant2.txt"
                jpg.bendQuant(tableA, tableB)
                break;
            case 'h':
                // console.log('huffman-tables')
                tableA = path.join(folderPath,"g-Huff1.txt")
                tableB = path.join(folderPath,"h-Huff2.txt")
                tableC = path.join(folderPath,"i-Huff3.txt")
                tableD = path.join(folderPath,"j-Huff4.txt")
                jpg.bendHuffman(tableA,tableB,tableC,tableD)
                break;
            case 'c':
                // console.log('sos-tables-components')
                tableA = path.join(folderPath,"k-SOS.txt")
                jpg.bendSOSComponents(tableA)
                break;
            case 's':
                // console.log('sos-tables-spectral')
                tableA = path.join(folderPath,"k-SOS.txt")
                jpg.bendSOSSpectralSelection(tableA)
                break;
            case 'b':
                // console.log('sos-tables-approx-bites')
                tableA = path.join(folderPath,"k-SOS.txt")
                jpg.bendSOSApproxBytes(tableA)
                break;
            case 'i':
                // console.log('image-data')
                tableA = path.join(folderPath,"l-imgData.txt")
                jpg.bendImageBody(tableA)
                break;
            default:
                break;
        }
    }

}

exports.defaultValue = (value, defaultValue) => {
    const num = value ? value.slice(-3) : defaultValue;
    return num;
}

function formatSelectAnalyze(dataFormat, dataFile, dataOutName, dataFolderPathInfo) {
    let fileFormat = dataFormat.toLowerCase()
    
    try {
        switch(fileFormat) {
            case 'gif':
                gif.gifAnalyze(dataFile)
                fs.writeFileSync(path.join(dataFolderPathInfo,`${dataOutName}`),dataFile,"hex")
                break;
            case 'jpg':
                let jpgData = jpg.analyzeJPG(dataFile)
                writeFileLoop(jpgData,dataFolderPathInfo)                                
                break;
            default:
                console.log('no processing')
                // fs.writeFileSync(path.join(dataFolderPath,`${output}`),data,"hex");
                break;
            }               
    } catch (err) {
        console.log(err)
    }
}

function formatSelectBend(dataFormat, dataFile, dataOutName, dataFolderPathInfo) {
    let fileFormat = dataFormat.toLowerCase()
    
    try {
        switch(fileFormat) {
            case 'gif':
                // gif.gifAnalyze(dataFile)
                // fs.writeFileSync(path.join(dataFolderPathInfo,`${dataOutName}`),dataFile,"hex")
                break;
            case 'jpg':
                let jpgData = jpg.bendJPG(dataFile)
                writeFileLoop(jpgData,dataFolderPathInfo)                                
                break;
            default:
                console.log('no processing')
                // fs.writeFileSync(path.join(dataFolderPath,`${output}`),data,"hex");
                break;
            }               
    } catch (err) {
        console.log(err)
    }
}

function writeFileLoop(data,location) {
    let info = data
    for (let i = 0; i < info.length; i++) {
        let index = info[i].index;
        let section = info[i].section
        let data = info[i].data
        let fileName = `${index}-${section}`
        fs.writeFileSync(path.join(location,`${fileName}.txt`),data,"hex")
     }
}

exports.binaryToBool = (value) => {
    if (value == 1) {
        return true
    } else {
        return false
    }
}

exports.getIndicesOf = (searchStr, str, caseSensitive) => {
    let startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + 1;
    }
    return indices;
}

exports.hex2bin = (hex) => {
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

exports.getRandomIntInclusive = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

exports.getRandomHexValue = () => {
    let hexList = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]
    return hexList[this.getRandomIntInclusive(0,hexList.length-1)]
}

exports.coinflip = (input1, input2) => {
    if (this.getRandomIntInclusive(0,1) == 0) {
        return input1
    } else {
        return input2
    }
}

exports.shuffle = (array) => {   
    return array.sort(() => Math.random() - 0.5);
}

exports.evenRound = num => {
   return 2 * Math.round(num / 2);
}