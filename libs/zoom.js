
//from http://samples.msdn.microsoft.com/workshop/samples/svg/zoomAndPan/zooming.html
    /* Constants: */
    var zoomRate = 1.1;  // Increase for faster zooming (i.e., less granularity).
    
    /* Globals: */
    var theSvgElement = document.getElementById('zoomhere');  
    var currentZoomFactor;
    
    function zoom(zoomType)
    {
      if (zoomType == 'zoomIn')
        currentZoomFactor *= zoomRate;
      else if (zoomType == 'zoomOut')
        currentZoomFactor /= zoomRate;      
      else
        alert("function zoom(zoomType) given invalid zoomType parameter.");

      theSvgElement.setAttribute('currentScale', currentZoomFactor);
  
     // var newText = document.createTextNode("Current zoom factor = " + currentZoomFactor.toFixed(3));	// Create a generic new text node object.
    //  var parentNode = document.getElementById('currentZoomFactorText');  								// Get the parent node of the text node we want to replace.
      
    //  parentNode.replaceChild(newText, parentNode.firstChild);  // Replace the first child text node with the new text object.
    }
        
    function zoomViaMouseWheel(mouseWheelEvent)
    {      
      //alert(mouseWheelEvent);
     // if (mouseWheelEvent.wheelDelta > 0)
     //   zoom('zoomIn');
    //  else
    //    zoom('zoomOut');
      
      /* When the mouse is over the webpage, don't let the mouse wheel scroll the entire webpage: */
    //  mouseWheelEvent.cancelBubble = true;	
      return false;							
    }
    
    function initialize()
    {
      /* Set global variables and detect if the browser supports SVG. */
      theSvgElement = document.getElementById('zoomhere');  			// Best to only access the SVG element after the page has fully loaded.
      
      if(theSvgElement.namespaceURI != "http://www.w3.org/2000/svg")	// Alert the user if their browser does not support SVG.
        alert("Inline SVG in HTML5 is not supported. This document requires a browser that supports HTML5 inline SVG.");

      currentZoomFactor = theSvgElement.currentScale;  					// This is initially set to 1 via the currentScale attribute on the svg element itself.
      //window.addEventListener('mousewheel', zoomViaMouseWheel, false);  // Hook this event to the browser's window so the mouse wheel works everywhere.
    }    

