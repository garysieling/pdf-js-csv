/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

function parsePDF(binary) {
  console.log("Starting PDF parsing");
  var dataElement = document.getElementById("pdf");

  function str2ab(str) {
    var buf = new ArrayBuffer(str.length); 
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  var arrayBuffer = str2ab(binary);
  var pdf_obj = PDFJS.getDocument(arrayBuffer);
  var pages = [];

  pdf_obj.then(function(pdf) {
    console.log("pdf_obj.then " + pdf.pdfInfo.numPages);

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
      var page_obj = pdf.getPage(page_num + 1);
      page_obj.then(function(page) {
        console.log("recordPage");

        var scale = 1.5;
        var viewport = page.getViewport(scale);

        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = canvases[page_num - 1];
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
      recordPage(page_num);
    }

  });

  function csv() {
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
    
    console.log("Pages of data: " + pages.length);

    var res = '';
    for (var i = 0; i < pages.length; i++) {
      res += toCSV(getText(pages[1], typewriter, 20, 15, false));
    }
    return res;
  }

  return csv;
}

