const fs = require('node:fs');
const path = require('node:path')
const gif = require('../gif');

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

// read a folder, read the data from each file, add data to a variable, write the data to a file
exports.compile = (input, output, format) => {
    let allData = ""

    let folderPath = path.join(dataPath,input)

    fs.readdirSync(folderPath).forEach(filename => {
        const hexData = fs.readFileSync(path.join(folderPath,filename), 'hex');
        allData += hexData
    });
    
    fs.writeFileSync(path.join(outputPath,`${output}`),allData,"hex")
}

exports.defaultValue = (value, defaultValue) => {
    const num = value ? value.slice(-3) : defaultValue;
    // const firstVal = value.indexOf('.')
    // console.log('from function',firstVal)
    return num;
}

function formatSelect(dataFormat, dataFile, dataOutName, dataFolderPathInfo) {
    try {
        switch(dataFormat) {
            case 'gif':
                // helper functions for GIF processing
               
                // fs.writeFileSync(path.join(dataFolderPathInfo,`${dataOutName}`),dataFile,"hex")
                break;
            case 'jpg':
                // fs.writeFileSync(path.join(dataFolderPath,`${output}`),data,"hex");
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

exports.binaryToBool =(value) => {
    if (value == 1) {
        return true
    } else {
        return false
    }
}