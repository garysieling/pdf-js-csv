//pdf2csv.js

var PDFJS = require("./pdfjs");
/*var nodeUtil = require("util"),
	nodeEvents = require("events"),
    _ = require("underscore"),
    fs = require('fs'),
    PDFJS = require("./lib/pdf.js"),
    async = require("async");*/

exports.pdf2csv = function(file){
    return new PDFJS().run(file);
}

