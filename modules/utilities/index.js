const fs = require('node:fs');
const path = require('node:path')

// reading from image, saving as txt in hex


exports.analyze = (input, output, format) => {   
    const data = fs.readFileSync(`assets/input/${input}`, "hex");
    fs.writeFileSync(`assets/data/${output}-analyzed.txt`,data,"hex")
    console.log(`the format is ${format}`)
    // future enhancement - create a directory with the name, split into chunks with f
}

exports.compile = (input, output, format) => {
    // open directory
    // loop over directory from beginning to end
    // add to file
    const hexData = fs.readFileSync(`assets/data/${input}.txt`, 'hex');
    fs.writeFileSync(`assets/output/${output}`,hexData,"hex")
}

// reading from txt hex, saving as an image
// const hexData = fs.readFileSync('assets/data/256-analyzed.txt', 'hex');
// fs.writeFileSync('assets/output/256-analyzed.gif',hexData,"hex")