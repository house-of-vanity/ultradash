  var local_version = 0.58;
  var str = "";
  function applyJSON(json) {
    console.log(json);
    obj = JSON.parse(json);
    document.getElementById('temp').innerHTML = obj.temp + ' °C';
    document.getElementById('windspeed').innerHTML = obj.wind_speed + ' mps';
    document.getElementById('news_title').innerHTML = obj.news_title;
    document.getElementById('ws_version').innerHTML = obj.version;
    document.getElementById('w_img').src = 'http://openweathermap.org/img/w/' + obj.w_img + '.png';
    if (local_version != obj.version) {
        location.reload();
    }
  }

  function dayName(i) {
    switch(i) {
      case 0:  // if (x === 'value1')
        i = "Sunday";
        break;
      case 1:  // if (x === 'value1')
        i = "Monday";
        break;
      case 2:  // if (x === 'value1')
        i = "Tuesday";
        break;
      case 3:  // if (x === 'value1')
        i = "Wednesday";
        break;
      case 4:  // if (x === 'value1')
        i = "Thursday";
        break;
      case 5:  // if (x === 'value1')
        i = "Friday";
        break;
      case 6:  // if (x === 'value1')
        i = "Saturday";
        break;
      default:
        i = "Some shit day";
        break;
    }
    return i;
  }

  function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
  }

  setInterval(function(){
    $('blink').each(function(){
      $(this).css('visibility' , $(this).css('visibility') === 'hidden' ? '' : 'hidden')
    });
  }, 1000);

  function reconnect(){
    setTimeout(function(){
    doConnect();
    }, 3000);
  }

  function init()
  {
    document.myform.url.value = "ws://localhost:8090/"
    document.myform.inputtext.value = "img"
    document.myform.disconnectButton.disabled = true;
    //var date = new Date();
    //document.getElementById('time').innerHTML = str.concat(addZero(date.getHours()),"<blink>:</blink>",addZero(date.getMinutes()));
    //document.getElementById('weekday').innerHTML = str.concat(dayName(date.getDay()));
    (function () {
    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    function startTime() {
        var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            d = today.getDay();
        document.getElementById('time').innerHTML = h + "<blink>:</blink>" + m;
        document.getElementById('weekday').innerHTML = str.concat(dayName(d));
        t = setTimeout(function () {
            startTime()
        }, 2000);
    }
    startTime();
})();
    doConnect();
    document.getElementById('local_version').innerHTML = local_version;
  }

  function doConnect()
  {
    websocket = new WebSocket(document.myform.url.value);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
    document.getElementById('body').style.backgroundColor = 'white';
  }

  function onOpen(evt)
  {
    //writeToScreen("CONNECTED TO " + document.myform.url.value + "\n");
	document.myform.connectButton.disabled = true;
	document.myform.disconnectButton.disabled = false;
    document.getElementById('ws_status').innerHTML = "Connected to " + document.myform.url.value;
  }

  function onClose(evt)
  {
    writeToScreen("DISCONNECTED FROM " + document.myform.url.value + "\n");
	document.myform.connectButton.disabled = false;
	document.myform.disconnectButton.disabled = true;
    document.getElementById('ws_status').innerHTML = "Disconnected";
    document.getElementById('body').style.backgroundColor = 'red';
    reconnect();
  }

  function onMessage(evt)
  {
    writeToScreen("=>  " + evt.data + '\n\n');
    applyJSON(evt.data);
  }

  function onError(evt)
  {
    writeToScreen('>=< ' + evt.data + '\n');

	websocket.close();

	document.myform.connectButton.disabled = false;
	document.myform.disconnectButton.disabled = true;

  }

  function doSend(message)
  {
    writeToScreen("<= " + message + '\n'); 
    websocket.send(message);
  }

  function writeToScreen(message)
  {
    document.myform.outputtext.value += message
	document.myform.outputtext.scrollTop = document.myform.outputtext.scrollHeight;

  }

  window.addEventListener("load", init, false);


   function sendText() {
		doSend( document.myform.inputtext.value );
   }

  function clearText() {
		document.myform.outputtext.value = "";
   }

   function doDisconnect() {
		websocket.close();
   }


