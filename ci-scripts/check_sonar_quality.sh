#!/bin/bash
# Usage: ./check_sonar_quality.sh <projectKey> <sonar_host> <sonar_token>

projectKey="$1"
host="$2"
token="$3"

echo "Checking Sonar Quality Gate for project: $projectKey"

for i in {1..30}; do
  status=$(curl -s -u ${token}: "${host}/api/qualitygates/project_status?projectKey=${projectKey}" | jq -r '.projectStatus.status')
  if [ "$status" == "OK" ]; then
    echo "✅ Quality Gate Passed"
    exit 0
  elif [ "$status" == "ERROR" ]; then
    echo "❌ Quality Gate Failed"
    exit 1
  else
    echo "Waiting for analysis... ($i/30)"
    sleep 10
  fi
done

echo "Timed out waiting for SonarQube result."
exit 1
