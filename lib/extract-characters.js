/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

function parsePDF(binary) {
  function str2ab(str) {
    var buf = new ArrayBuffer(str.length); 
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  var source;
  var pages = [];

  if (!!binary) {
    console.log("Loading from binary data");
    var source = str2ab(binary);
  } else { 
    console.log("Loading from file");
    var source = "../examples/tests.pdf";
  }

  PDFJS.getDocument(source).then(function(pdf) {
    console.log("pdf_obj.then ");

    var page_num = 1;
    var canvases = [];

    console.log("Parsing pages(1): " + pdf.pdfInfo.numPages);

    for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
      var canvas = document.createElement('canvas');
      canvas.id = 'the-canvas' + i;
      document.body.appendChild(canvas);  
      canvases[i] = canvas;
      pages[i] = [];
      console.log("Pages of data (2): " + pages.length);
    }  
  
    function recordPage(page_num) {
      console.log("Really drawing page " + page_num);
      var page_obj = pdf.getPage(page_num + 1);
      page_obj.then(function(page) {
        console.log("recordPage");

        var scale = 1.5;
        var viewport = page.getViewport(scale);

        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = canvases[page_num];
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        //
        // Render PDF page into canvas context
        //

        var ctx2 = {};
 
        var cur = {};
        function record(ctx, state, args) {
          if (state === 'fillText') {
            var c = args[0];
            cur.c = c;
            cur.x = ctx._transformMatrix[4] + args[1];
            cur.y = ctx._transformMatrix[5] + args[2];

            var chars = pages[page_num];
            chars[chars.length] = cur;
            cur = {c: '' };
          } 
        }

        function set(ctx1, ctx2, key) {
          var val = ctx1[key];
          if (typeof(val) == "function") {
            ctx1[key] = function() {
              var args = Array.prototype.slice.call(arguments);
              var result = val.apply(ctx1, args);

              record(ctx1, key, args);
              if (key === 'fillText') {
                var c = arguments[0];
              }

              return result;
            } 
          }
        }

        for (var k in context) {
          set(context, ctx2, k);
        } 

        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };

//    var processPage = function processPage(pageData) {
//      var content = pageData.getTextContent();
 
//      debugger;
//      content.then(processPageText(pageData, content));
//    }
//    page.then(processPage);   

        var p = page.getOperationList().then(
          function(a) { 
            console.log(JSON.stringify(a));
          });
        p.resolve();

        var t = page.getAnnotations().then(
          function(a) { 
           console.log(JSON.stringify(a));
           window.phantomCallback(a);
          });
        t.resolve();
    
        page.render(renderContext);
      });
    }
    
    console.log("Parsing pages(2): " + pdf.pdfInfo.numPages);
    for (var page_num = 0; page_num < pdf.pdfInfo.numPages; page_num++) {
      console.log("Drawing page: " + page_num);
      recordPage(page_num);
    }

  });
  
  function csv() {
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
          if (marks[i+1]) {
            // line feed - start from position of next line
            x = marks[i+1].x;
          }
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
    
    var res = '';
    for (var i = 0; i < pages.length; i++) {
      res += getText(pages[i], 20, 15, false);
    }
    return res;
  }

  return csv;
}

console.log((parsePDF())());
