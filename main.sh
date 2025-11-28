#! /bin/bash

sampleJPG="IMG_3141.jpg"
sampleJPGName="IMG_3141"
sampleWav=""

randomLoop=$[ ( $RANDOM % 9 )  + 2 ]

if [ "$1" = "jpgAnalyze" ] 
then
    echo "route jpg analyze"
    node index.js analyze $sampleJPG
    cp -r assets/data/$sampleJPGName assets/data/$sampleJPGName-bending
elif [ "$1" = "jpgCompile" ]
then
    echo "route jpg compile" 
    node index.js compile IMG_3141 jpg
elif [ "$1" = "jpgBending" ]
then
    echo "route jpg bending" 
    node index.js bending IMG_3141-bending jpg qsb
elif [ "$1" = "jpgBendingCompile" ]
then
    echo "route jpg bendingcompile" 
    node index.js compile IMG_3141-bending jpg
elif [ "$1" = "jpgBendingAndCompile" ]
then
    echo "route jpg bendingcompile"
    node index.js bending IMG_3141-bending jpg qsb
    node index.js compile IMG_3141-bending jpg
elif [ "$1" = "i" ]
then
    echo "route initialize" 
    mkdir assets assets/data assets/input assets/output
else
    echo "Please indicate a valid route."
fi
