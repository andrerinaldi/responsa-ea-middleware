#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "GENERATING BUILD FINGERPRINT"

sed -i "s|CI_PUTS_HERE_LAST_GIT_COMMIT|$LAST_COMMIT|g" /_/app/src/config/status.config.ts
today=$(date)
sed -i "s|CI_PUTS_HERE_DEPLOY_DATE|$today|g" /_/app/src/config/status.config.ts

cat /_/app/src/config/status.config.ts

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "WRITING .ENV"
echo "RESPONSA_BOTID=${RESPONSA_BOTID}" >> /_/app/.env
echo "RESPONSA_USER=${RESPONSA_USER}" >> /_/app/.env
echo "RESPONSA_CHATBOT_URL=${RESPONSA_CHATBOT_URL}" >> /_/app/.env
echo "MONGO_URI=${MONGO_URI}" >> /_/app/.env
echo "BOT_FRAMEWORK_APP_ID=${BOT_FRAMEWORK_APP_ID}" >> /_/app/.env
echo "BOT_FRAMEWORK_APP_PASSWORD=${BOT_FRAMEWORK_APP_PASSWORD}" >> /_/app/.env
cat /_/app/.env

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CLEANING TEST FOLDER"

# creates output directory if not exists (locally it will be created on bamboo it will not create cause a docker volume is mounted under /test-reports)
mkdir -p /test-reports 

cd /test-reports && rm -rf ./* && cd ..

echo "test folder recreated"
cd /test-reports && ls -l && cd .. # count content of /test-reports folder

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "RESTORING PACKAGES SOURCES"

cd /_/app/
npm config set store-dir /test-reports/.pnpm-store
npm set progress=false
npm i --prefer-offline

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "LINTING"
npm run lint

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "RUNNING UNIT TEST"
npm run jest:ci

echo "copying unit test result to /test-result folder"
cp test-report.xml /test-reports/TestResult.xml

echo "copying coverage reports to /test-result folder"
rsync -a coverage/lcov-report/ /test-reports