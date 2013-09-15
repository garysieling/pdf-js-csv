var pdf2csv = require('pdf2csv');
if( Object.prototype.toString.call(pdf2csv) == '[object String]' ) {
  console.log(pdf2csv);
} else {
  pdf2csv.pdf2csv(process.argv[2], process.argv[3]);
}
