# glitch-toolz

## How to set up

Make sure you have node installed!
clone the repo
Use sh main.sh i to set up the folder structure
Add a jpg to the 'input' folder
Update the variables at the top of the sh file with the name of the jpg (without the extension)

## How to use

Use sh main.sh jpgAnalyze to break the jpg into chunks
Use sh main.sh jpgCompile to compile the jpg chunks into an image
Use sh main.sh jpgBend and h,s,b, and/or q to bend the jpg chunks
Use sh main.sh jpgCompileBend to compile the bent chunks
Use sh main.sh jpgBendAndCompile to bend and compile all at once!

## Status

Currently: 
* breaks jpg files down into txt files per component 
* compiles jpg text sections into functioning image files
* allows for some jpeg bending - huffman tables, quantization, SOS

Current To Dos
* develop bending functionality for jpegs - fine tune component bending, add more levers
* develop out GIF analysis - scrambling color table, adjusting animation options
* fix shell script - analyzing the same image will nest a folder in the -bending folder

Future Goals:
* include other formats
* allow for additional bending methods
* potentially include a db for combining data across files?


## References and resources
* Corkami's breakdown of JPEG file structure [https://www.google.com/search?q=corkami+jpg&rlz=1C1UEAD_enUS1081US1081&oq=corkami+jpg&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIKCAEQABiABBiiBDIKCAIQABiABBiiBDIKCAMQABiABBiiBDIKCAQQABiABBiiBNIBCDE1ODJqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8]
* Patrick Louis' analysis of JPEGs and ideas on bending them [https://venam.net/blog/programming/2020/10/05/corruption-at-the-core.html#c%CC%B5a%CC%B5s%CC%B8e%CC%B8-%CC%B7s%CC%B8t%CC%B4u%CC%B5d%CC%B7y%CC%B8%CC%B7-%CC%B5j%CC%B5p%CC%B8e%CC%B6g%CC%B7]
* Nick Briz's Huffman Table bending tool [https://nickbriz.com/databending101/huffman-hacking.html]