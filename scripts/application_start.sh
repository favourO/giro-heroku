#!/bin/bash

sudo chmod -R 777 /home/ec2-user/giro-payment-api

#navigate into our working directory where
cd /home/ec2-user/giro-payment-api

#add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in )

#install node modules
npm install

#start our node app in the background
node server.js > server.out.log 2> server.err.log < /dev/null & 