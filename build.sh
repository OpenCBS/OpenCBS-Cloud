#!/bin/bash

show_usage() {
	echo -e "Usage: $0 [ARGUMENTS]"
	echo ""
	echo "arguments:"
	echo -e "\t-build version - specify the version of JAR. For example, 1.0.0"
        echo -e "\t-instance name - specify the instance name without opencbs prefix. For example, my-finance or impact-finance"	
}

if [ "$#" -ne 2 ]; then
    show_usage
    exit 1
else
    mvn -f ./server/opencbs-spring-boot-starter/pom.xml clean install -DskipTests
    mvn -f ./server/opencbs-core/pom.xml clean install -DskipTests
    mvn -f ./server/opencbs-loans/pom.xml clean install -DskipTests
    mvn -f ./server/opencbs-borrowings/pom.xml clean install -DskipTests
    mvn -f ./server/opencbs-savings/pom.xml clean install -DskipTests
    mvn -f ./server/opencbs-term-deposits/pom.xml clean install -DskipTests 
    mvn -f ./server/opencbs-bonds/pom.xml clean install -DskipTests
    mvn -f ./server/opencbs-$2/pom_backend.xml clean install jar:jar -DBUILD_VERSION=$1
fi
