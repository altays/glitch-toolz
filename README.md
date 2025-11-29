# glitch-toolz

## How to set up

1. Make sure you have node installed!
2. clone the repo
3. Use 'sh main.sh' i to set up the folder structure
4. Add a jpg to the 'input' folder
5. Update the variables at the top of the sh file with the name of the jpg (without the extension)
6. Use 'sh main.sh jpgAnalyze' to break the jpg into txt files based on the 
7. chunk. This will create a duplicate folder
8. Use 'sh main.sh jpgBend' and any combination of 'c', 'q', 's', 'b', and/or 'i' to bend the txt chunks.
9. Use 'sh main.sh reset' if you start getting broken images - this will delete the '-bending' folder and copy straight from the clean data.

## How to use

* sh main.sh i will create the folder structure for data and output files
* sh main.sh jpgAnalyze will break the jpg into individual txt files and create two folders - one with the OG data, the other (ending in "-bending") that the script will apply bends to. **Only run this once when working with a new file!**
* sh main.sh jpgCompile will compile the jpg txt file chunks into an image
* sh main.sh jpgBend will bend the jpg chunks. Arguments include:
    * q - swaps the quantization table destinations. Subtle
    * h - affects the huffman table. Very direct. Running this too many times will start breaking images
    * c - affects the component bytes in the SOS table. Very direct.
    * s - affects the spectral bytes in the SOS table. Can be very subtle.
    * b - affects the approximate bytes in the SOS table. Can range from subtle to direct
    * i - affects the compressed image data. WIP! 
* sh main.sh jpgCompileBend will compile the bent chunks
* sh main.sh jpgBendAndCompile will bend and compile all at once!
* sh main.sh reset will delete the current "-bending" folder and copy a new one from the og folder. Use this if output images begin breaking

## Status

Currently: 
* breaks jpg files down into txt files per component 
* compiles jpg text sections into functioning image files
* allows for some jpeg bending - huffman tables, quantization, SOS

Current To Dos
* develop bending functionality for jpegs - fine tune component bending, allow for image data bending, add more levers
* develop out GIF analysis - scrambling color table, adjusting animation options
* add some ffmpeg scripts - converting between file formats, for instance

Future Goals:
* include other formats
* allow for additional bending methods
* potentially include a db for combining data across files?

## References and resources
* Corkami's breakdown of JPEG file structure [https://www.google.com/search?q=corkami+jpg&rlz=1C1UEAD_enUS1081US1081&oq=corkami+jpg&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIKCAEQABiABBiiBDIKCAIQABiABBiiBDIKCAMQABiABBiiBDIKCAQQABiABBiiBNIBCDE1ODJqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8]
* Patrick Louis' analysis of JPEGs and ideas on bending them [https://venam.net/blog/programming/2020/10/05/corruption-at-the-core.html#c%CC%B5a%CC%B5s%CC%B8e%CC%B8-%CC%B7s%CC%B8t%CC%B4u%CC%B5d%CC%B7y%CC%B8%CC%B7-%CC%B5j%CC%B5p%CC%B8e%CC%B6g%CC%B7]
* Nick Briz's Huffman Table bending tool [https://nickbriz.com/databending101/huffman-hacking.html]