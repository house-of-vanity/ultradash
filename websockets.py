import logging
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import urllib.request, json
from xml.dom import minidom
import random
import unicodedata
import time
import sys
from threading import Thread
logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

WEATHERAPIKEY = '5d23bafcb2379530ac399b0017d2f4ba'
WEATHER_CITY = 'Moscow,ru'
VERSION = 0.58
PORT = 8090
#News rss feed.
URL = ["https://news.yandex.ru/world.rss", "https://news.google.com/news?output=rss", "https://news.google.ru/news?output=rss"]
USAGE = """
Possible commands:
temp - get temperature. 
img  - get weather visualisation.
wind - get wind speed.
news - get random news.
"""

try:
    def cdate():
        _ = time.strftime("%d-%b %H:%M:%S")
        return str(_)

    def logic(request):
        print(request)
        if request == 'temp':
            print("Requested temp")
            return getTemp()
        elif request == 'img':
            print("Requested weather img")
            return getImg()
        elif request == 'wind':
            print("Requested wind stats")
            return getWind()
        elif request == 'news':
            print("Requested news")
            return getNews()
        else:
            return USAGE
    
    def getJSON():
        wind_speed = getWind()
        temp = getTemp()
        w_img = getImg()
        news_title = getNews()
        json_dict = {
            'version': VERSION,
            'wind_speed': wind_speed,
            'temp': temp,
            'w_img': w_img,
            'news_title': news_title
        }
        return json.dumps(json_dict, ensure_ascii=False)

    def getNodeText(node):
        nodelist = node.childNodes
        result = []
        for node in nodelist:
            if node.nodeType == node.TEXT_NODE:
                result.append(node.data)
        return ''.join(result)

    def getImg():
        url = "http://api.openweathermap.org/data/2.5/weather?q="+ WEATHER_CITY + "&APPID=" + WEATHERAPIKEY + "&units=metric&lang=en"
        response = urllib.request.urlopen(url)
        data = json.loads(response.read())
        return data['weather'][0]['icon']

    def getTemp():
        url = "http://api.openweathermap.org/data/2.5/weather?q="+ WEATHER_CITY + "&APPID=" + WEATHERAPIKEY + "&units=metric&lang=en"
        response = urllib.request.urlopen(url)
        data = json.loads(response.read())
        _ = str(data['main']['temp']).split('.',1)
        return _[0]

    def getWind():
        url = "http://api.openweathermap.org/data/2.5/weather?q="+ WEATHER_CITY + "&APPID=" + WEATHERAPIKEY + "&units=metric&lang=en"
        response = urllib.request.urlopen(url)
        data = json.loads(response.read())
        _ = str(data['wind']['speed']).split('.',1)
        return _[0]

    def getNews():
        r = random.randint(0, len(URL)-1)
        response = urllib.request.urlopen(URL[r])
        data = minidom.parse(response)
        title = data.getElementsByTagName('title')[random.randint(2, len(data.getElementsByTagName('title'))-1)] 
        _ = getNodeText(title)
        return _
    clients = []
    
    class SimpleEcho(WebSocket):
        
        def start(self):
            while True:
                if self.address in clients:
                    to_send = getJSON()
                    try:
                        self.sendMessage(str(to_send).decode('utf-8'))
                    except:
                        self.sendMessage(to_send)
                    logging.info("%s Send to %s:%s - %s" %  (cdate(), self.address[0], self.address[1], to_send))                    
                    time.sleep(10)
                else:
                    return

        def handleMessage(self):
            try:
                _ = str(logic(self.data)).decode('utf-8')
            except:
                _ = logic(self.data)
            self.sendMessage(_)

        def handleConnected(self):
            clients.append(self.address)
            logging.info("%s Connected %s:%s. Clients amount - %s" %  (cdate(), self.address[0], self.address[1], len(clients)))
            t = Thread(target=self.start)
            t.start()

        def handleClose(self):
            logging.info("%s Disconnected %s:%s. Clients amount - %s" %  (cdate(), self.address[0], self.address[1], len(clients)))
            clients.remove(self.address)

    SERVER = SimpleWebSocketServer('', PORT, SimpleEcho)

    SERVER.serveforever()

except KeyboardInterrupt:
    clients = []
    print()
    sys.exit()