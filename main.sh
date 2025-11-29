#! /bin/bash

sampleJPGName="IMG_3141"
sampleWav=""
bendingFolderName="IMG_3141-bending"

randomLoop=$[ ( $RANDOM % 9 )  + 2 ]

if [ "$1" = "jpgAnalyze" ] 
then
    echo "route jpg analyze"
    node index.js analyze $sampleJPGName.jpg
    cp -r assets/data/$sampleJPGName assets/data/$sampleJPGName-bending
elif [ "$1" = "jpgCompile" ]
then
    echo "route jpg compile" 
    node index.js compile $sampleJPGName jpg
elif [ "$1" = "jpgBending" ]
then
    echo "route jpg bending" 
    node index.js bending $bendingFolderName jpg hsbq
elif [ "$1" = "jpgBendingCompile" ]
then
    echo "route jpg bendingcompile" 
    node index.js compile $bendingFolderName jpg
elif [ "$1" = "jpgBendingAndCompile" ]
then
    echo "route jpg bendingcompile"
    node index.js bending $bendingFolderName jpg hsbq
    node index.js compile $bendingFolderName jpg
elif [ "$1" = "i" ]
then
    echo "route initialize" 
    mkdir assets assets/data assets/input assets/output
else
    echo "Please indicate a valid route."
fi
