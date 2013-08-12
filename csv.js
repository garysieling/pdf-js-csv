function get_value(items, calc, cmp) {
  var result;
  for (var i = 0; i < items.length; i++) {
    var cur_value = calc(items[i]);
    if (i == 0) {
      result = cur_value;
    } else if (cmp(cur_value, result)) {
      result = cur_value;
    }
  }
  return result;
}

function max_cmp(a, b) { return a > b };
function min_cmp(a, b) { return a < b };

function get_x(a) { return a.x }
function get_y(a) { return a.y }

function width(page) {
  return get_value(page, get_x, max_cmp) - 
         get_value(page, get_x, min_cmp);
}

function height(page) {
  return get_value(page, get_y, max_cmp) - 
         get_value(page, get_y, min_cmp);
}

function typewriter(a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;
 
  if (Math.abs(dy) < 0.5) {
    return dx * -1;
  } else {
    return dy * -1;
  }
}


function getText(marks, sort_fn, ex, ey, v) {
  marks.sort(sort_fn);

  var x = marks[0].x;
  var y = marks[0].y;
 
  var rows = [];
  rows[0] = [''];
  for (var i = 0; i < marks.length; i++) {
    var c = marks[i];
    var dx = c.x - x;
    var dy = c.y - y;
 
    if (Math.abs(dy) > ey) {
      rows[rows.length] = [''];
      x = marks[i].x;
      dx = 0;
    }
 
    rowIdx = rows.length - 1;
    colIdx = rows[rowIdx].length - 1;
    if (Math.abs(dx) > ex) {
      colIdx++;
      rows[rowIdx][colIdx] = '';
    }
 
    if (v) {
      console.log(dx + ", " + dy);
    }
 

    rows[rowIdx][colIdx] += c.c;
 
    x = c.x;
    y = c.y;  
  }
 
  return rows;
}


function toCSV(rows, row_filters) {
  if (row_filters === undefined) { row_filters = [] }

  var res = "";
  for (var i = 0; i < rows.length; i++) {
    include_row = true;
    for (var k = 0; k < row_filters.length; k++) {
      include_row = include_row && row_filters[k](rows[i], i);
    }

    if (include_row) {
      for (var j = 0; j < rows[i].length; j++) {
        res += "\"" + rows[i][j] + "\",";
      }
      res += "\n";
    }
  }
  return res;
}


function csv(pages) {
  var res = '';
  for (var i = 0; i < pages.length; i++) {
    res += toCSV(getText(pages[1], typewriter, 20, 15, false));
  }
  return res;
}
