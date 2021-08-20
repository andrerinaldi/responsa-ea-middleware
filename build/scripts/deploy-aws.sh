#!/bin/bash
set -e # stops on first error

AWS_APPLICATION_DESCRIPTION=${AWS_APPLICATION_DESCRIPTION%\"}
AWS_APPLICATION_DESCRIPTION=${AWS_APPLICATION_DESCRIPTION#\"}

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CREATE ZIP TO DEPLOY"

cd /_/app
VERSION_HASH=$(git log -1 --pretty=format:"%H")
VERSION_DATE=$(git log -1 --pretty=format:"%cs")
DEPLOY_TS=$(date +%s)
[[ "$GIT_BRANCH" == "main" ]] && VERSION_TYPE='production' || VERSION_TYPE='develop'

ZIP_FILE="$VERSION_TYPE-$VERSION_DATE-$DEPLOY_TS-$VERSION_HASH"

echo "Creating zip with name: $ZIP_FILE"
cd /install
ls -la
zip -r $ZIP_FILE.zip *
zip $ZIP_FILE .env

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "UPLOAD ZIP TO S3"
aws s3 cp $ZIP_FILE.zip s3://$AWS_DEPLOY_BUCKET/$AWS_DEPLOY_KEY/

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CREATE APPLICATION VERSION"
aws elasticbeanstalk create-application-version \
    --application-name $AWS_APPLICATION_NAME --version-label $ZIP_FILE \
    --description "${AWS_APPLICATION_DESCRIPTION} - $VERSION_TYPE version $VERSION_HASH committed on $VERSION_DATE and released on $DEPLOY_TS" \
    --source-bundle S3Bucket=$AWS_DEPLOY_BUCKET,S3Key=$AWS_DEPLOY_KEY/$ZIP_FILE.zip --auto-create-application \
    --tags Key=type,Value=$VERSION_TYPE

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "ASSIGN APPLICATION VERSION TO ENVIRONMENT"
aws elasticbeanstalk update-environment \
    --application-name $AWS_APPLICATION_NAME \
    --environment-name $AWS_ENVIRONMENT_NAME \
    --version-label $ZIP_FILE

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "TEST DEPLOY"

echo "Waiting for environment to be updated....."
cmd="aws elasticbeanstalk wait environment-updated --application-name $AWS_APPLICATION_NAME --environment-names $AWS_ENVIRONMENT_NAME --version-label $ZIP_FILE"
eval $cmd

if [[ $? != 0 ]]
then
  echo "EBS environment didn't update correctly"
  exit 1
fi

echo "Environment updating finished correctly .... checking status route...."
/_/build/scripts/curl-retry.sh "$AWS_ENVIRONMENT_URL/status"
