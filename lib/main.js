(function() {
  var pdf2csv = require ('./pdf2csv');
  pdf2csv.pdf2csv(process.argv[2], process.argv[3]);
}).call(this)
