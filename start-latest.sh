#!/bin/bash

TARGET=/opt/errbuddy.war
LATEST_RELEASE=$(curl -L -s -H 'Accept: application/json' https://github.com/peh/errbuddy/releases/latest)
LATEST_VERSION=$(echo $LATEST_RELEASE | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/')
ARTIFACT_URL="https://github.com/peh/errbuddy/releases/download/$LATEST_VERSION/errbuddy.war"

rm -f $TARGET
wget -O $TARGET $ARTIFACT_URL
java -Dgrails.env=prod -Derrbuddy.mysql.password=$MYSQL_PASSWORD -Derrbuddy.serverUrl=$SERVER_URL -jar $TARGET
