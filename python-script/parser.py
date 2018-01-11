import requests
import pymysql
from time import sleep
import json
import random

hostname = 'YOUR-HOSTNAME'
username = 'YOUR-USERNAME'
password = 'YOUR-PASSWORD'
database = 'YOUR-DATABASE'

already_seen = []


def doQuery(connection, place_id, osm_id, place_name, place_latitude, place_longitude, place_type, importance, wikipedia_page_IT, wikipedia_page_EN, wikipedia_extract, wikipedia_image):
    cur = connection.cursor()
    cur.execute("INSERT INTO app_places SET place_id=%s, osm_id=%s, latitude=%s, longitude=%s, name=%s, place_type=%s,"
                " wikipedia_page_IT=%s, wikipedia_page_EN=%s, wikipedia_extract=%s, wikipedia_image=%s, importance=%s, vote_count=%s",
                (str(place_id), str(osm_id), str(place_latitude), str(place_longitude), place_name, place_type, str(wikipedia_page_IT),
                                        str(wikipedia_page_EN), str(wikipedia_extract), str(wikipedia_image), str(importance), '0'))


def parsePlaces(place_type):
    count_places = 0
    latitude = 'YOUR-STARTING-LATITUDE'
    endingLatitude = 'YOUR-ENDING-LATITUDE'
    endingLongitude = 'YOUR-ENDING-LONGITUDE'
    while latitude <= endingLatitude:
        longitude = 'YOUR-STARTING-LONGITUDE'
        while longitude <= endingLongitude:
            search_string = place_type + ' near ' + str(latitude) + ', ' + str(longitude)
            payload = {'q': search_string, 'limit': '100', 'format': 'json', 'extratags': '1', 'email': 'YOUR-EMAIL'}
            try:
                response = json.loads(requests.get('http://nominatim.openstreetmap.org/search', params=payload).text)
                for place in response:
                    place_string = place['display_name'].split(', ')
                    place_name = place_string[0].replace("'", "\\'")
                    place_id = place['place_id']
                    osm_id = place['osm_id']
                    place_latitude = place['lat']
                    place_longitude = place['lon']
                    importance = place['importance']

                    wikipedia_page_IT = ''
                    wikipedia_page_EN = ''
                    wikipedia_extract = ''
                    wikipedia_image = ''

                    if place_id not in already_seen:
                        already_seen.append(place_id)

                        if 'extratags' in place:
                            if 'wikipedia' in place['extratags']:
                                if place['extratags']['wikipedia'].find("it:") > -1:
                                    wikipedia_page_IT = place['extratags']['wikipedia'].replace("it:", "")
                                    print(wikipedia_page_IT)
                                elif place['extratags']['wikipedia'].find("en:") > -1:
                                    wikipedia_page_EN = place['extratags']['wikipedia'].replace("en:", "")
                                    print(wikipedia_page_EN)

                        if wikipedia_page_IT != '':
                            redirection_payload = {'format': 'json', 'action': 'query', 'prop': 'langlinks',
                                                   'titles': wikipedia_page_IT}
                            redirection_response = json.loads(requests.get('https://it.wikipedia.org/w/api.php',
                                                                           params=redirection_payload).text)
                            try:
                                wikipedia_pages = list(redirection_response['query']['pages'].values())[0]['langlinks']
                                for page in wikipedia_pages:
                                    if page['lang'] == 'en':
                                        wikipedia_page_EN = page['*']
                                        print(wikipedia_page_EN)
                            except KeyError:
                                pass

                            image_payload = {'format': 'json', 'action': 'query', 'prop': 'pageimages',
                                             'piprop': 'original', 'titles': wikipedia_page_IT}
                            image_response = json.loads(requests.get('https://it.wikipedia.org/w/api.php',
                                                                     params=image_payload).text)
                            if 'original' in list(image_response['query']['pages'].values())[0]:
                                if 'source' in list(image_response['query']['pages'].values())[0]['original']:
                                    wikipedia_image = list(image_response['query']['pages'].values())[0]['original'][
                                        'source']
                                    print(wikipedia_image)

                            sleep(1)

                        if wikipedia_page_EN != '':
                            extract_payload = {'format': 'json', 'action': 'query', 'prop': 'extracts', 'exintro': '',
                                                   'explaintext': '', 'titles': wikipedia_page_EN, 'utf8': ''}
                            extract_response = json.loads(requests.get('https://en.wikipedia.org/w/api.php',
                                                                           params=extract_payload).text)
                            if 'extract' in list(extract_response['query']['pages'].values())[0]:
                                wikipedia_extract = list(extract_response['query']['pages'].values())[0]['extract']
                                print(wikipedia_extract)
                            sleep(1)

                            if wikipedia_image == '':
                                image_payload = {'format': 'json', 'action': 'query', 'prop': 'pageimages',
                                                 'piprop': 'original', 'titles': wikipedia_page_EN}
                                image_response = json.loads(requests.get('https://it.wikipedia.org/w/api.php',
                                                                         params=image_payload).text)
                                if 'original' in list(image_response['query']['pages'].values())[0]:
                                    if 'source' in list(image_response['query']['pages'].values())[0]['original']:
                                        wikipedia_image = list(image_response['query']['pages'].values())[0]['original']['source']
                                        print(wikipedia_image)

                    try:
                        doQuery(myConnection, place_id, osm_id, place_name, place_latitude, place_longitude, place_type,
                                importance, wikipedia_page_IT, wikipedia_page_EN, wikipedia_extract, wikipedia_image)
                        count_places += 1
                    except pymysql.err.IntegrityError:
                        pass
                    myConnection.commit()
            except json.decoder.JSONDecodeError:
                pass
            longitude += 0.02
            sleep(1)
        print("Row executed.")
        latitude += 0.02
        sleep(1)
    print(place_type + " retrieved. Total: " + str(count_places))


myConnection = pymysql.connect(host=hostname, user=username, passwd=password, db=database, charset='utf8')
typesList = ['parks', 'artworks', 'archaeological sites', 'memorials', 'gardens', 'attractions', 'buildings',
             'monuments', 'viewpoints', 'museums', 'churches', 'castles', 'ruins', 'arts centres', 'theme park']
random.shuffle(typesList)
for place_type in typesList:
    parsePlaces(place_type)

myConnection.close()
