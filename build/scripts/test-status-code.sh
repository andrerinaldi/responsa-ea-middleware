#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "TEST STATUS CODE"

echo URL: $1
echo Expected response: $2

response=$(curl -4 --write-out %{http_code} --retry 10 --silent --output /dev/null --retry-connrefused $1)

errstatus=$?

if [ $errstatus != 0 ]
then
  echo "Cannot Curl $1 - returning $errstatus"  
  exit $errstatus
fi

echo "response is $response"

if [ $response != $2 ]
then
  echo "Actual response is $response - expected is $2"  
  exit $response
fi