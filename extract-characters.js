/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

//
// See README for overview
//

'use strict';

//
// Fetch the PDF document from the URL using promises
//
var pdf_obj = PDFJS.getDocument('Table_16.pdf');
var pages = [];

pdf_obj.then(function(pdf) {
  // Using promise to fetch the page
  var page_num = 1;

  var canvases = [];

  for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
    var canvas = document.createElement('canvas');
    canvas.id = 'the-canvas' + i;
    document.body.appendChild(canvas);  
    canvases[i] = canvas;
    pages[i] = [];
  }  
  
  function recordPage(page_num) {
  var page_obj = pdf.getPage(page_num + 1);
  page_obj.then(function(page) {
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
    });
    t.resolve();
    
    page.render(renderContext);
  });
  }

  for (var page_num = 0; page_num < pdf.pdfInfo.numPages; page_num++) {
    recordPage(page_num);
  }

});

