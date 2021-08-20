#!/usr/bin/env awk

{DEFAULT = 1}

/^[[:space:][:alpha:]]+/ { 
    if ($0 == "  servers: [") {
        flag = 1
        print $0
    }
    else if (flag == 1) {
        if ($0 == "  ],") {
            flag = 0
        }
        else {
            if (printed == 0) {
                print SERVERS
                printed = 1
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