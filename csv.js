function getText(marks, ex, ey, v) {

  var x = marks[0].x;
  var y = marks[0].y;
 
  var txt = '';
  for (var i = 0; i < marks.length; i++) {
    var c = marks[i];
    var dx = c.x - x;
    var dy = c.y - y;
 
    if (Math.abs(dy) > ey) {
      txt += "\"\n\"";
      x = marks[i].x;
      dx = 0;
    }
 
    if (Math.abs(dx) > ex) {
      txt += "\",\"";
    }
 
    if (v) {
      console.log(dx + ", " + dy);
    }
 
    txt += c.c;
 
    x = c.x;
    y = c.y;  
  }
 
  return txt;
}
