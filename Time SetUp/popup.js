console.log("popup.js");
/*this is countdoun timer*/
// chrome.storage.local.get(['timesec'],function(timer){
// count=0;
// var time=parseInt(timer.timesec);
// function convertSec(s){
//     var min=set(parseInt(s/60));
//     var hour=set(parseInt(s/3600));
//     var sec=set(s%60);
//     return hour+":"+min+':'+sec ;
// }
// function set(n){
//     if(n<10)
//     return '0'+ n;
//     if( (n>=60) && (n%60 <10)){
//       return '0'+ n%60 ;
//     }
//     else return n%60;
// }
// function setUp(){
//     count++;
//     if((time-count)>=0){
//       chrome.storage.local.set({'timesec':(time-count)});
//     $("#timer").html(convertSec(time-count));      
// }
// }
// setInterval(setUp,1000-17);});
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



