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
elif [ "$1" = "jpgBend" ]
then
    echo "route jpg bend" 
    node index.js bending $bendingFolderName jpg c
elif [ "$1" = "jpgCompileBend" ]
then
    echo "route jpg compilebend" 
    node index.js compile $bendingFolderName jpg
elif [ "$1" = "jpgBendAndCompile" ]
then
    echo "route jpg compileandbend"
    node index.js bending $bendingFolderName jpg c
    node index.js compile $bendingFolderName jpg
elif [ "$1" = "i" ]
then
    echo "route initialize" 
    mkdir assets assets/data assets/input assets/output
else
    echo "Please indicate a valid route."
fi
