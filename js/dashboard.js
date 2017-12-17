function go() {
  startTime();
  blink();
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



