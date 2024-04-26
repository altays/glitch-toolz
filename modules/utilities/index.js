const fs = require('node:fs');
const path = require('node:path')
const gif = require('../gif');
const jpg = require('../jpg');

let homePath = path.basename(`./assets/`)
let dataPath = path.join(homePath,'/data/')
let inputPath = path.join(homePath,'/input/')
let outputPath = path.join(homePath,'/output/')

exports.analyze = (input, output, format) => {   
    const data = fs.readFileSync(path.join(inputPath,`${input}`), "hex");
    let outputName = output.slice(0,-4)
    let dataFolderPath = path.join(dataPath,outputName);
    let pathIncrement = 0;
    let folders = []

    fs.readdir(dataPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        
        let fileNameCheck = files.includes(outputName)

        if (!fileNameCheck) {
            try {
                fs.mkdirSync(dataFolderPath)
                formatSelect(format,data,output,dataFolderPath)
            } catch (err) {
                console.log(err)
            }

        } else {
            while (fileNameCheck == true) {
                outputName+= pathIncrement
                fileNameCheck = files.includes(outputName)
                pathIncrement++ 
            }

            dataFolderPath=path.join(dataPath,outputName);

            try {
                fs.mkdirSync(dataFolderPath)
                formatSelect(format,data,output,dataFolderPath)
            } catch (err) {
                console.log(err)
            }
        }
    }); 
}

exports.compile = (input, output, format) => {
    let allData = ""

    let folderPath = path.join(dataPath,input)
    let filePath = path.join(outputPath,`${output}`)

    if (fs.existsSync(filePath)) { 
        filePath = path.join(outputPath,`${parseInt(Date.now()/1000)}-${output}`)
    }
    
    fs.readdirSync(folderPath).forEach(filename => {
        const hexData = fs.readFileSync(path.join(folderPath,filename), 'hex');
        console.log(filename)
        allData += hexData
    });
    
    fs.writeFileSync(filePath,allData,"hex")
}

function formatSelect(dataFormat, dataFile, dataOutName, dataFolderPathInfo) {
    let fileFormat = dataFormat.toLowerCase()
    
    try {
        switch(fileFormat) {
            case 'gif':
                // helper functions for GIF processing
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