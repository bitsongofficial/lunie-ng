#!/bin/bash

#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DIR=$(pwd)

# Build the docker image first.
docker build --tag bitsong/localnet "$DIR"/localnet

# Make sure that previous container not exist.
docker rm --force bitsong_localnet

# Start container as daemon with some ports opening.
docker run -d -p 1317:1317 -p 26657:26657 -p 9090:9090 --name bitsong_localnet bitsong/localnet

echo "Validator mnemonic: memory fault antenna oppose warfare mutual clap fossil earth solution matrix feel alley tired mix oppose melt plug marriage fiber pride hint cheap hand"
echo "Account1 mnemonic: silk cricket salt museum voice unable unaware piece excess blue crawl juice soda during learn arrange amused pony excess float grit manage notice dinner"
echo "Account2 mnemonic: expose drastic inhale gain match pause alter drift across cluster sorry oven capital river wolf used soccer slim twelve wheel notice focus put dad"
echo "Account2 mnemonic: gap wave quantum merge online sausage process grow upset fossil capital high alcohol cost mansion oak truck like ask cancel random bachelor odor rich"
echo "Each account has the balances (1000000000000ubtsg)"

echo "Docker container is running on \"bitsong_localnet\""
echo "After testing, to remove existing container, run \"sudo docker rm --force bitsong_localnet\""