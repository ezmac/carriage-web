#!/bin/bash

if [[ ! -f .env ]]; then
  echo "No .env found.  Copy .env.dist to .env and update parameters"
  exit 1
fi

source .env
mkdir -p nginx-certs/certs

SHIB_FILE_PATH="shibboleth-sp3/files/shib-keys"
if [[ $1 == "reset-certs" ]]; then
  rm nginx-certs/certs/*

elif [[ $1 == "init" ]]; then

# This is a useful step if your app should actually do something.
# if [[ ! -f "app/config/config.inc.php" ]]; then
#   echo "WARN: config.inc.php not found; copying placeholder.  Please edit before running"
#   cp app/config/config.sample.inc.php app/config/config.inc.php
# fi
  if [[ ! -f "nginx-certs/certs/keyfile.crt" ]]; then
    cd nginx-certs/
    ../genSelfSignedCerts.sh $Domain_Name
    cd -
  fi
  echo "Done"

elif [[ $1 == "build" ]]; then
  docker-compose build

elif [[ $1 == "run" ]]; then 
  shift
  docker-compose up $@

elif [[ $1 == "logs" ]]; then 
  shift
  docker-compose logs $@

elif [[ $1 == "reset" ]]; then 
  docker-compose stop
  docker-compose rm -f

else
    echo "options: init, build, run, reset, reset-certs, clean"
fi


# Above command should generate these files
# sp-encrypt-cert.pem
# sp-encrypt-key.pem
# sp-signing-cert.pem
# sp-signing-key.pem
