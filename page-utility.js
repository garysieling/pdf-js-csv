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

function get_characters(pages) {
  var map = {}; 
  for (var i = 0; i < pages.length; i++) { 
    for (j = 0; j < pages[i].length; j++) { 
      map['*' + pages[i][j].c + '*'] = 1; 
    }
  }
  return map;
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

