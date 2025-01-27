// 获取当前时间，格式为 YY.MM.DD HH:MM
export function getNowTime() {
    var now = new Date()
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日
  
    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); 
  
    var clock = year + "-";
  
    if (month < 10)
      clock += "0";
  
    clock += month + "-";
  
    if (day < 10)
      clock += "0";
  
    clock += day + " ";
  
    if (hh < 10)
      clock += "0";
  
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";

    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
  }