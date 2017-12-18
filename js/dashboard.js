function go() {
  startTime();
  blink();
  doConnect()
}
function blink() {
  setInterval(function () {
      $('blink').each(function () {
          $(this).css('visibility', $(this).css('visibility') === 'hidden' ? '' : 'hidden');
      });
  }, 1000);
}

function startTime() {
    var str = "";
    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }
    function dayName(i) {
        switch(i) {
          case 0:
            i = "Sunday";
            break;
          case 1:
            i = "Monday";
            break;
          case 2:
            i = "Tuesday";
            break;
          case 3:
            i = "Wednesday";
            break;
          case 4:
            i = "Thursday";
            break;
          case 5:
            i = "Friday";
            break;
          case 6:
            i = "Saturday";
            break;
          default:
            i = "Some shit day";
            break;
        }
        return i;
      }
    setTime();
    function setTime() {
        var today = new Date(), h = checkTime(today.getHours()), m = checkTime(today.getMinutes()), d = today.getDay();
        document.getElementById('time').innerHTML = h + "<blink>:</blink>" + m;
        document.getElementById('weekday').innerHTML = str.concat(dayName(d));
        t = setTimeout(function () {
            startTime();
        }, 2000);
    }
}

// WebSocket staff.
function doConnect()
{
  websocket = new WebSocket('ws://localhost:8090/');
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{
  //document.myform.connectButton.disabled = true;
  //document.myform.disconnectButton.disabled = false;
}

function onClose(evt)
{
  //document.myform.connectButton.disabled = false;
  //document.myform.disconnectButton.disabled = true;
  reconnect();
}

function onMessage(evt)
{
  applyJSON(evt.data);
}

function applyJSON(json) {
  console.log(json);
  obj = JSON.parse(json);
  document.getElementById('temp').innerHTML = obj.temp + ' °C';
  document.getElementById('windspeed').innerHTML = obj.wind_speed + ' m/s';
  document.getElementById('w_img').src = 'http://openweathermap.org/img/w/' + obj.w_img + '.png';
  //document.getElementById('news_title').innerHTML = obj.news_title;
  //document.getElementById('ws_version').innerHTML = obj.version;
  //if (local_version != obj.version) {
  //    location.reload();
  //}
}

