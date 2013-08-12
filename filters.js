

function even(row, index) { return index % 2 == 0; }
function odd(row, index) { return index % 2 == 1; }

function column_count(num) {
  return function(row, index) {
    return num === row.length;
  }
}

function at_least_columns(num) {
  return function(row, index) {
    return row.length >= num;
  }
}

