// Corkami's breakdown: https://github.com/corkami/formats/blob/master/image/jpeg.md

// Start of image - FF D8
// Application Header - starts with FFE0, contains length
// Quantization Table 1 - FFDB and has length
// Quantization Table 2 - FFDB and has length
// Start of Frame - FFC0, has length
// Huffman tables - FFC4, has lengths, multiple
// Start of scan - FFDA, has a length
// Image Data - just raw data
// End of image - FFD9