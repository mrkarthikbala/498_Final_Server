#!/usr/bin/env python

"""
 * @file dbClean.py
 * Used in CS498RK MP3 to empty database of all users and tasks.
 *
 * @author Aswin Sivaraman
 * @date Created: Spring 2015
 * @date Modified: Spring 2015
"""

import sys
import getopt
import httplib
import urllib
import json

def usage():
    print 'dbClean.py -u <baseurl> -p <port>'

def getUsers(conn):
    # Retrieve the list of users
    conn.request("GET","""/api/users?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)

    # Array of user IDs
    users = [str(d['data'][x]['_id']) for x in xrange(len(d['data']))]

    return users

def getErrands(conn):
    # Retrieve the list of tasks
    conn.request("GET","""/api/errands?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)

    # Array of user IDs
    errands = [str(d['data'][x]['_id']) for x in xrange(len(d['data']))]

    return errands

def main(argv):

    # Server Base URL and port
    baseurl = "www.uiucwp.com"
    port = 4000

    try:
        opts, args = getopt.getopt(argv,"hu:p:",["url=","port="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
             usage()
             sys.exit()
        elif opt in ("-u", "--url"):
             baseurl = str(arg)
        elif opt in ("-p", "--port"):
             port = int(arg)

    # Server to connect to (1: url, 2: port number)
    conn = httplib.HTTPConnection(baseurl, port)

    # Fetch a list of users
    users = getUsers(conn)

    # Loop for as long as the database still returns users
    while len(users):

        # Delete each individual user
        for user in users:
            conn.request("DELETE","/api/users/"+user)
            response = conn.getresponse()
            data = response.read()

        # Fetch a list of users
        users = getUsers(conn)

    # Fetch a list of tasks
    errands = getErrands(conn)

    # Loop for as long as the database still returns tasks
    while len(errands):

        # Delete each individual task
        for errand in errands:
            conn.request("DELETE","/api/errands/"+errand)
            response = conn.getresponse()
            data = response.read()

        # Fetch a list of tasks
        errands = getErrands(conn)

    # Exit gracefully
    conn.close()
    print "All users and errands removed at "+baseurl+":"+str(port)


if __name__ == "__main__":
     main(sys.argv[1:])