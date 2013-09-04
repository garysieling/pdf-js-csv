var fs = require('fs'),
    system = require('system');

if (system.args.length === 1) {
  console.log('Usage: phantomjs main.js examples/tests.pdf');
  phantom.exit();
} else {
  var pdf = system.args[1];

  function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  var content = '',
    f = null;

  try {
    f = fs.open(system.args[1], "r");
    content = f.read();
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
  
  var data = utf8_to_b64(content);

  var page = require('webpage').create();
  var url = 'lib/index.html';
  
  page.onCallback = function(data) {
    console.log(data);
//    phantom.exit();
  }
  
  page.onConsoleMessage = function() {
    console.log("Page: " + arguments[0]);
  };

  page.open(url, function (status) {
    page.evaluate(function(data) {
      document.getElementById("pdf").innerText = data;
      window.callPhantom("Sample: " + data.substring(0, 100));

      var x = parsePDF();
      console.log("After parse");
  
      var y = function() {
        console.log("Before print");
        x();
        console.log("After print");
      };
      setTimeout(y, 500);
    }, data);
    console.log("Finished");
  });

}

