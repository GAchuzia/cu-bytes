<#
Splits a large model file into fixed-size chunks for upload to Azure (Kudu).

This script takes a file and splits it into smaller .part files using configurable
chunk size (Kudu max chunk size is 256MiB). After uploading these parts via the
Kudu console they can be reassembled inside the Azure SSH terminal.

You can access the relevant directory in Kudu here:
https://cu-bytes-e2cnaff9e2cgg5hk.scm.eastus2-01.azurewebsites.net/filemanager/models/

To reassemble the model in the Azure terminal:
    cd /home/models
    cat best_model.pth.part* > best_model.pth

Test the model via a request from your local machine:
    curl -X POST -F "image=@salmon_nigiri.png"
    https://cu-bytes-e2cnaff9e2cgg5hk.eastus2-01.azurewebsites.net/ml/predict

Afterwards you can delete the split parts:
    rm best_model.pth.part*
#>

# Configure file name and chunk size
param(
    [string]$InputFile = "best_model.pth",
    [int64]$ChunkSize = 200MB
)

# Get the directory of the script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Build the path to the input file
$filePath = Join-Path $scriptDir $InputFile

Write-Host "Splitting file: $filePath"
Write-Host "Chunk size: $ChunkSize bytes"

if (!(Test-Path $filePath)) {
    Write-Host "ERROR: File not found."
    exit
}

$reader = [System.IO.File]::OpenRead($filePath)
$buffer = New-Object byte[] $ChunkSize
$part = 0

# Read each ChunkSize of the input file
while (($bytesRead = $reader.Read($buffer,0,$buffer.Length)) -gt 0) {

    # Construct the output filename, e.g. best_model.pth.part0, best_model.pth.part1
    $outFile = Join-Path $scriptDir ("{0}.part{1}" -f $InputFile,$part)
    Write-Host "Writing $outFile"

    # Create the output file and write the bytes that were read for this chunk.
    $outStream = [System.IO.File]::Create($outFile)
    $outStream.Write($buffer,0,$bytesRead)
    $outStream.Close()

    $part++
}

$reader.Close()

Write-Host "Done splitting file."
Write-Host "$part parts created."
