const fs = require('node:fs');
const path = require('node:path')

let homePath = path.basename(`./assets/`)
let dataPath = path.join(homePath,'/data/')
let inputPath = path.join(homePath,'/input/')
let outputPath = path.join(homePath,'/output/')

// make a folder, analyze a file, save txt files for each section in new folder
    // future enhancement - search for if folder already exists - if so, iterate over
exports.analyze = (input, output, format) => {   
    const data = fs.readFileSync(path.join(inputPath,`${input}`), "hex");
   
    const dataFolderPath = path.join(dataPath,output.slice(0,-4))

    try {
        fs.mkdirSync(dataFolderPath)
    } catch (err) {
        console.log(err)
    }
   
    try {
        // gif and jpeg processing here
        // MVP 2 gif based analysis
            // break data into file section chunks
                // save with incremenet + section type
           
        // MVP 3 jpeg based analysis
                // break data into file section chunks
                    // save with incremenet + section type
        
        // MVP 4 other format based analysis
        fs.writeFileSync(path.join(dataFolderPath,`${output}`),data,"hex")
    } catch (err) {
        console.log(err)
    }
   
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

// functions to create
// // create folder - https://nodejs.org/en/learn/manipulating-files/working-with-folders-in-nodejs
// // naming convention
// // // number of section
// // // name of section
// // // iterating
// // iterating over a dataset