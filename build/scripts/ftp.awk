#!/usr/bin/env awk

{DEFAULT = 1}

/^[[:space:][:alpha:]]+/ { 
    if ($0 == "  ftp: {") {
        flag = 1
        print $0
    }
    else if (flag == 1) {
        if ($0 == "  },") {
            flag = 0
        }
        else {
            if ($0 ~ /.*lambdaName: .*,/) {
              print "    lambdaName: \"" LAMBDA_NAME "\","
            } else if ($0 ~ /.*lambdaName: .*/) {
              print "    lambdaName: \"" LAMBDA_NAME "\""
            } else if ($0 ~ /.*lambdaSecret: .*,/) {
              print "    lambdaSecret: \"" LAMBDA_SECRET "\","
            } else if ($0 ~ /.*lambdaSecret: .*/) {
              print "    lambdaSecret: \"" LAMBDA_SECRET "\""
            } else {
              print $0
            }
        }
    }
    else if (flag == 0) {
        print $0
        DEFAULT = 0
    }
}

DEFAULT {
    if (flag == 0) {
        print $0
    }
}