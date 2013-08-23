var system = require('system');
if (system.args.length === 1) {
    console.log('Usage: phantomjs main.js examples/tests.pdf');
} else {
    system.args.forEach(function (arg, i) {
            console.log(i + ': ' + arg);
    });
}
phantom.exit();

