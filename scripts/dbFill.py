#!/usr/bin/env python

"""
 * @file dbFill.py
 * Used in CS498RK MP3 to populate database with randomly generated users and tasks.
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
from random import randint
from random import choice
from datetime import date
from time import mktime

def usage():
    print 'dbFill.py -u <baseurl> -p <port> -n <numUsers> -t <numErrands>'

def getUsers(conn):
    # Retrieve the list of users
    conn.request("GET","""/api/users?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)

    # Array of user IDs
    users = [str(d['data'][x]['_id']) for x in xrange(len(d['data']))]

    return users

def getBid(userIDs, userNames):
    if (randint(0, 100) < 70):
        return False
    bidder = randint(0, len(userIDs) -1)
    bidderID = userIDs[bidder]
    bidderName = userNames[bidder]
    bidAmount = randint(0, 100)

    bid = {'bidAmount':bidAmount,'bidderID': bidderID, 'bidderName' : bidderName}
    jsonBid = json.dumps(bid)
    return bid
def main(argv):

    # Server Base URL and port
    baseurl = "www.uiucwp.com"
    port = 4000

    # Number of POSTs that will be made to the server
    userCount = 50
    errandCount = 200

    try:
        opts, args = getopt.getopt(argv,"hu:p:n:t:",["url=","port=","users=","errands="])
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
        elif opt in ("-n", "--users"):
             userCount = int(arg)
        elif opt in ("-t", "--errands"):
             errandCount = int(arg)

    # Python array containing common first names and last names
    firstNames = ["james","john","robert","michael","william","david","richard","charles","joseph","thomas","christopher","daniel","paul","mark","donald","george","kenneth","steven","edward","brian","ronald","anthony","kevin","jason","matthew","gary","timothy","jose","larry","jeffrey","frank","scott","eric","stephen","andrew","raymond","gregory","joshua","jerry","dennis","walter","patrick","peter","harold","douglas","henry","carl","arthur","ryan","roger","joe","juan","jack","albert","jonathan","justin","terry","gerald","keith","samuel","willie","ralph","lawrence","nicholas","roy","benjamin","bruce","brandon","adam","harry","fred","wayne","billy","steve","louis","jeremy","aaron","randy","howard","eugene","carlos","russell","bobby","victor","martin","ernest","phillip","todd","jesse","craig","alan","shawn","clarence","sean","philip","chris","johnny","earl","jimmy","antonio","danny","bryan","tony","luis","mike","stanley","leonard","nathan","dale","manuel","rodney","curtis","norman","allen","marvin","vincent","glenn","jeffery","travis","jeff","chad","jacob","lee","melvin","alfred","kyle","francis","bradley","jesus","herbert","frederick","ray","joel","edwin","don","eddie","ricky","troy","randall","barry","alexander","bernard","mario","leroy","francisco","marcus","micheal","theodore","clifford","miguel","oscar","jay","jim","tom","calvin","alex","jon","ronnie","bill","lloyd","tommy","leon","derek","warren","darrell","jerome","floyd","leo","alvin","tim","wesley","gordon","dean","greg","jorge","dustin","pedro","derrick","dan","lewis","zachary","corey","herman","maurice","vernon","roberto","clyde","glen","hector","shane","ricardo","sam","rick","lester","brent","ramon","charlie","tyler","gilbert","gene"]
    lastNames = ["smith","johnson","williams","jones","brown","davis","miller","wilson","moore","taylor","anderson","thomas","jackson","white","harris","martin","thompson","garcia","martinez","robinson","clark","rodriguez","lewis","lee","walker","hall","allen","young","hernandez","king","wright","lopez","hill","scott","green","adams","baker","gonzalez","nelson","carter","mitchell","perez","roberts","turner","phillips","campbell","parker","evans","edwards","collins","stewart","sanchez","morris","rogers","reed","cook","morgan","bell","murphy","bailey","rivera","cooper","richardson","cox","howard","ward","torres","peterson","gray","ramirez","james","watson","brooks","kelly","sanders","price","bennett","wood","barnes","ross","henderson","coleman","jenkins","perry","powell","long","patterson","hughes","flores","washington","butler","simmons","foster","gonzales","bryant","alexander","russell","griffin","diaz","hayes"]

    # Server to connect to (1: url, 2: port number)
    conn = httplib.HTTPConnection(baseurl, port)

    # HTTP Headers
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}

    # Array of user IDs
    userIDs = []
    userNames = []
    userEmails = []
    userPasswords=[]

    # Loop 'userCount' number of times
    for i in xrange(userCount):

        # Pick a random first name and last name
        x = randint(0,99)
        y = randint(0,99)
        params = urllib.urlencode({'name': firstNames[x] + " " + lastNames[y], 'email': firstNames[x] + "@" + lastNames[y] + ".com", 'password': firstNames[x]})
        
        # POST the user
        conn.request("POST", "/api/users", params, headers)
        response = conn.getresponse()
        data = response.read()
        d = json.loads(data)

        # Store the users id
        userIDs.append(str(d['data']['_id']))
        userNames.append(str(d['data']['name']))
        userEmails.append(str(d['data']['name']))
        userPasswords.append(str(d['data']['password']))

    # Open 'tasks.txt' for sample task names
    f = open('errands.txt','r')
    errandNames = f.read().splitlines()
    locations = ["Chicago", "Boston", "Hawaii", "Paris", "Stutgart", "London", "Tokyo", "Chennai", "Madrid", "Shanghai", "Mt. Kilimanjaro", "The South Pole", "Singapore", "Lebanon"]
    # Loop 'taskCount' number of times
    for i in xrange(errandCount):

        # Randomly generate task parameters
        assigned = True
        createdUser = randint(0,len(userIDs)-1) 
        createdID = userIDs[createdUser]
        createdName = userNames[createdUser]
        location = locations[randint(0, len(locations)-1)]

        #random bidder
        bids = []
        for i in xrange(5):
            b = getBid(userIDs, userNames)
            if (b != False):
                bids.append(b)

        deadline = (mktime(date.today().timetuple()) + randint(86400,864000)) * 1000
        description = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."

        print bids
        if len(bids)>0:
            params = urllib.urlencode({'name': choice(errandNames), 'deadline': deadline, 'createdName': createdName, 'createdID': createdID, 'description': description, 'bids' : bids, 'errandLocation': location}, True)
        else:
            params = urllib.urlencode({'name': choice(errandNames), 'deadline': deadline, 'createdName': createdName, 'createdID': createdID, 'description': description, 'bids' : [], 'errandLocation' : location}, True)
        
        # POST the task
        conn.request("POST", "/api/errands", params, headers)
        response = conn.getresponse()
        data = response.read()
        d = json.loads(data)

        errandID = str(d['data']['_id'])

        # Make sure the task is added to the pending list of the user
        if assigned:
            # GET the correct user
            conn.request("GET","""/api/users?where={"_id":\""""+createdID+"""\"}""")
            response = conn.getresponse()
            data = response.read()
            d = json.loads(data)

            # Store all the user properties
            createdID = str(d['data'][0]['_id'])
            createdName = str(d['data'][0]['name'])
            createdEmail = str(d['data'][0]['email'])
            createdPassword = str(d['data'][0]['password'])

            # Append the new taskID to pending tasks
            createdUserErrands = d['data'][0]['userErrands']
            createdUserTasks = [str(x).replace('[','').replace(']','').replace("'",'').replace('"','') for x in createdUserErrands]
            createdUserErrands.append(errandID)

            # PUT in the user
            params = urllib.urlencode({'_id': createdID, 'name': createdName, 'email': createdEmail, 'password': createdPassword, 'userErrands[]': createdUserErrands}, True)
            conn.request("PUT", "/api/users/"+createdID, params, headers)
            response = conn.getresponse()
            data = response.read()
            d = json.loads(data)

    # Exit gracefully
    conn.close()
    print str(userCount)+" users and "+str(errandCount)+" errands added at "+baseurl+":"+str(port)


if __name__ == "__main__":
     main(sys.argv[1:])