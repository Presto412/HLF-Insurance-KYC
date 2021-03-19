#!/bin/bash

set -ev

if [[ -z "${GOPATH}" ]]; then
  mkdir -p ~/gopath-custom/src/github.com/hyperledger
  export GOPATH=~/gopath
  export PATH=$PATH:$(go env GOPATH)/bin
fi

if [ ! -d "$GOPATH/src/github.com/hyperledger/fabric" ] 
then
    CURRENT_DIR=$(pwd)
    mkdir -p $GOPATH/src/github.com/hyperledger
    cd $GOPATH/src/github.com/hyperledger
    git clone --single-branch --branch release-1.1 https://github.com/hyperledger/fabric.git
    cd $CURRENT_DIR
fi

cd tarp-chaincode
./start.sh && ./install.sh
sleep 3
cd ..
cd tarp-client/src
cp .env.example .env
npm install
rm -rf ./node_modules/fabric-client
cp -rf ../fabric-client ./node_modules

./scripts/set-up-client.sh
npm start
