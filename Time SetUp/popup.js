 
/* hello world print out */
chrome.storage.local.get(['username'],function(timer){
  if(timer.username !=null){
    $("#helloWorld").text( "Hello "+timer.username.split(" ", 1) +'.....');
  }
 
})
/*digital clock*/
function updateCurrentTime() {
    var now = new Date();
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();
    var str = '',str1= '',str2='';
    if (hh % 12 == 0) {
      str += '12';
    } else {
      str += from((hh % 12));
    }
    str += ':';
    if (mm >= 10) {
      str += mm;
    } else {
      str += '0' + mm;
    }
    function from(n){
      if(n<10) return '0'+n;
      else return n;
    }
    
    if (ss >= 10) {
      str1= ss;
    } else {
      str1= '0' + ss;
    }
    if (hh >= 12) {
      str2= " PM";
    } else {
      str2= " AM";
    }
    $('#sec').text(str1);
    $('#pm').text (str2);
    $('#current_time').text (str);
  }
  setInterval(updateCurrentTime, 1);



