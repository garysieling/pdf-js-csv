var fs = require('fs'),
    system = require('system');

if (system.args.length === 1) {
  console.log('Usage: phantomjs main.js examples/tests.pdf');
  phantom.exit();
} else {
  var pdf = system.args[1];
  var data = '',
    f = null;

  try {
    f = fs.open(system.args[1], 'rb');
    data = f.read();
  } catch (e) {
    console.log(e);
    if (f !== null) {
      f.close();
    }
    phantom.exit();
  }

  if (f) {
    f.close();
  }
  
  var page = require('webpage').create();
  var url = 'lib/index.html';

  var i = 0;  
  page.onCallback = function(data) {
    console.log(data);
  }
  
  page.onConsoleMessage = function(data) {
    console.log(data);
  };

  page.onResourceRequested = function (request) {
    console.log('Request ' + JSON.stringify(request, undefined, 4));
  };
  
  page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    })
  }
 

  page.open(url, function (status) {
    page.evaluate(function(data) {
      var x = parsePDF(data);
  
      var y = function() {
        console.log("Before print");
        x();
        console.log("After print");
      };
      setTimeout(y, 5000);
    }, data);
    console.log("Finished");
  });
}

