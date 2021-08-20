#!/bin/bash
set -e # stops on first error

/_/build/scripts/build-unit-test.sh

/_/build/scripts/prepare-bundle.sh

/_/build/scripts/deploy.sh

/_/build/scripts/sonarqube.sh responsa-twilio-voice-middleware

echo "Cleaning up artifacts"
rm -rf test-report.xml
rm -rf test-report-sonar.xml
rm -rf coverage/lcov-report