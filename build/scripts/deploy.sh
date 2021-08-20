#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CHOOSE DEPLOY TARGET"

DEPLOY_TARGET=${DEPLOY_TARGET:-aws}
echo "Deploy Target is $DEPLOY_TARGET"
cmd="/_/build/scripts/deploy-$DEPLOY_TARGET.sh"
eval $cmd
