(function($) {
  $.fn.ascensor = function(params) {
    var params = $.extend({
    	ChildType:"div", 
    	WindowsOn:1, 
    	Direction:"y", AscensorMap:"", 
    	AscensorName:"ascensor", 
    	AscensorFloorName:"", 
    	Time:1E3, 
    	Easing:"linear", 
    	KeyNavigation:true
    }, params);
    
    var node = $(this);
    var nodeChildren = node.children(params.ChildType);
    var ascensorLink = $("." + params.AscensorName + "Link");
    var ascensorPrevLink = $("." + params.AscensorName + "LinkPrev");
    var ascensorNextLink = $("." + params.AscensorName + "LinkNext");
    var pageNumber = 0;
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var StageOn = params.WindowsOn;
    
    node.width(windowWidth);
    node.height(windowHeight);
    node.css("position", "absolute");
    
    if(params.AscensorFloorName.split == "") {
    }else {
      var url = window.location.href;
      var lastPart = url.split("/").pop();
      var floorName = params.AscensorFloorName.split(" | ");
      $.each(floorName, function(index) {
        if(floorName[index] === lastPart) {
          StageOn = index + 1
          ascensorLink.eq(StageOn-1).addClass(params.AscensorName + "LinkActive")
        }
      })
    }
    
    nodeChildren.each(function() {
      pageNumber++;
      $(this).attr("id", params.AscensorName + "Floor" + pageNumber).height(windowHeight).width(windowWidth).addClass(params.AscensorName + "Floor")
    });

    var AscensorMap = params.AscensorMap.split(" & ");
    
    function resizeFloor() {
      var WW = $(window).width();
      var WH = $(window).height();
      node.height(WH).width(WW);
      nodeChildren.each(function() {
        $(this).height(WH).width(WW)
      });
      if(params.Direction == "chocolate") {
        var target = AscensorMap[StageOn - 1].split("|");
        node.stop().scrollTop((target[0] - 1) * WH).scrollLeft((target[1] - 1) * WW)
      }
      if(params.Direction == "y") {
        node.stop().scrollTop((StageOn - 1) * WH)
      }
      if(params.Direction == "x") {
        node.stop().scrollLeft((StageOn - 1) * WW)
      }
      if(params.Direction == "chocolate") {
        nodeChildren.each(function(index) {
          var CoordName = AscensorMap[index].split("|");
          $(this).css({"position":"absolute", "left":(CoordName[1] - 1) * WW, "top":(CoordName[0] - 1) * WH})
        })
      }
      if(params.Direction == "x") {
        nodeChildren.css("position", "absolute");
        nodeChildren.each(function(index) {
          $(this).css("left", index * WW)
        })
      }
    }
    
    function targetScroll(floor, time) {
      if(params.Direction == "y") {
        node.stop().animate({scrollTop:(floor - 1) * $(window).height()}, time, params.Easing)
      }
      if(params.Direction == "x") {
        node.stop().animate({scrollLeft:(floor - 1) * $(window).width()}, time, params.Easing)
      }
      if(params.Direction == "chocolate") {
        var target = AscensorMap[floor - 1].split("|");
        node.stop().animate({scrollLeft:(target[1] - 1) * $(window).width(), scrollTop:(target[0] - 1) * $(window).height()}, time, params.Easing)
      }
      StageOn = floor;
      if(params.AscensorFloorName == "") {
      }else {
        var floorName = params.AscensorFloorName.split(" | ");
        floorName = floorName[StageOn - 1];
        window.location.href = "#/" + floorName
      }
      ascensorLink.removeClass(params.AscensorName + "LinkActive");
      $("." + params.AscensorName + "Link" + floor).addClass(params.AscensorName + "LinkActive")
    }
    
    ascensorLink.click(function() {
      var floorReference = $(this).attr("class");
      floorReference = floorReference.split(" ");
      floorReference = floorReference[1];
      floorReference = floorReference.split(params.AscensorName + "Link");
      floorReference = parseInt(floorReference[1]);
      targetScroll(floorReference, params.Time)
    });
    
    ascensorPrevLink.click(function() {
      var prev = StageOn - 1;
      if(prev < 1) {
        prev = pageNumber
      }
      targetScroll(prev, params.Time)
    });
    
    ascensorNextLink.click(function() {
      var next = StageOn + 1;
      if(next > pageNumber) {
        next = 1
      }
      targetScroll(next, params.Time)
    });
    

    
   if( /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ) {
      var previousOrientation = 0;
      var checkOrientation = function() {
      if(window.orientation !== previousOrientation) {
            previousOrientation = window.orientation;
            resizeFloor()
         }
      };
      window.addEventListener("resize", checkOrientation, false);
      window.addEventListener("orientationchange", checkOrientation, false);
      setInterval(checkOrientation, 200);
    }


    function checkKey(e) {
      switch(e.keyCode) {
        case 40:
          navigationPress(1, 0);
          return false;
          break;
        case 38:
          navigationPress(-1, 0);
          return false;
          break;
        case 37:
          navigationPress(0, -1);
          return false;
          break;
        case 39:
          navigationPress(0, 1);
          return false;
          break
      }
    }
    
    if(params.KeyNavigation) {
      if($.browser.mozilla) {
        $(document).keypress(checkKey)
      }else {
        $(document).keydown(checkKey)
      }
    }
    
    function navigationPress(addCoordY, addCoordX) {
      if(params.Direction == "y") {
        if(addCoordY == 1 && addCoordX == 0) {
          var next = StageOn + 1;
          if(next > pageNumber) {
          }else {
            targetScroll(next, params.Time)
          }
        }
        if(addCoordY == -1 && addCoordX == 0) {
          var prev = StageOn - 1;
          if(prev < 1) {
          }else {
            targetScroll(prev, params.Time)
          }
        }
      }
      if(params.Direction == "x") {
        if(addCoordY == 0 && addCoordX == -1) {
          var prev = StageOn - 1;
          if(prev < 1) {
          }else {
            targetScroll(prev, params.Time)
          }
        }
        if(addCoordY == 0 && addCoordX == 1) {
          var next = StageOn + 1;
          if(next > pageNumber) {
          }else {
            targetScroll(next, params.Time)
          }
        }
      }
      if(params.Direction == "chocolate") {
        var floorReference = params.AscensorMap.split(" & ");
        floorReference = floorReference[StageOn - 1].split("|");
        var nextPotentialFloor = parseInt(floorReference[0]) + addCoordY + "|" + (parseInt(floorReference[1]) + addCoordX);
        var potentialMatch = params.AscensorMap.split(" & ");
        $.each(potentialMatch, function(index) {
          if(potentialMatch[index] === nextPotentialFloor) {
            targetScroll(index + 1, params.Time)
          }
        })
      }
    }

    $(window).resize(function() {
      resizeFloor()
    }).resize();
    resizeFloor()
  }
})(jQuery);