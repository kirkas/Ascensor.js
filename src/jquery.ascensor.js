// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {  
  var pluginName = 'ascensor';
  
  var defaults = {
    ascensorName: "ascensor",           // First, choose the ascensor name
    ascensorFloorName: null,            // Choose name for each floor
    childType: "div",                   // Specify the child type if there are no 'div'
    windowsOn: 0,                       // Choose the floor to start on
    direction: "y",                     // specify if direction is x,y or chocolate
    loop: true,                         // specify if direction is x,y or chocolate
    ascensorMap: "",                    // If you choose chocolate for direction, speficy position
    time: "1000",                       // Specify speed of transition
    easing: "linear",                   // Specify easing option
    keyNavigation: true,                // choose if you want direction key support
    touchSwipeIntegration: false,       // choose if you want swipe event support (requires http://labs.rampinteractive.co.uk/touchSwipe/)
    queued: false,                      // choose if you want direction scroll queued
    queuedDirection: "x"               // choose if you want direction scroll queued "x" or "y" (default : "x")
  };
  
  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }
  
  Plugin.prototype.init = function() {
    var 
      self = this,
      node = $(this.element),
      nodeChildren = node.children(self.options.childType),
      
      //floor counter settings
      floorActive = self.options.windowsOn,
      floorCounter = -1,
      
      //height/width settings
      WW,
      WH,
      
      //plugins settings
      direction = self.options.direction,
      $document = $(document),
      $window = $(window),
      
      //hash 
      hash;
function resize() {
  WW = $window.width();
  WH = $window.height();
  
  nodeChildren.width(WW).height(WH);
  node.width(WW).height(WH);

  if (self.options.direction === "y") {
    node.stop().scrollTop((self.floorActive) * WH);
  }

  if (self.options.direction === "x") {
    node.stop().scrollLeft((self.floorActive) * WW);
    nodeChildren.each(function(index) {
      $(this).css("left", index * WW);
    });
  }

  if (self.options.direction === "chocolate") {
    nodeChildren.each(function(index) {
      $(this).css({
        "left": (self.options.ascensorMap[index][1]) * WW,
        "top": (self.options.ascensorMap[index][0]) * WH
      });
    });
    node.stop().scrollLeft((self.options.ascensorMap[floorActive][1]) * WW).scrollTop((self.options.ascensorMap[floorActive][0]) * WH);
  }
}
function handleDirection(direction) {
  if (self.options.direction == "y") {
    if (direction == ("left" || "right")) {
      return;
    } else if (direction == "down") {
      next();
    } else if (direction == "up") {
      prev();
    }

  } else if (self.options.direction == "y") {
    if (direction == ("up" || "down")) return;
    if (direction == "left") {
      prev();
    } else if (direction == "right") {
      next();
    }

  } else if (self.options.direction == "chocolate") {
    if (direction == "down") {
      handleChocolateDirection(1, 0);
    } else if (direction == "up") {
      handleChocolateDirection(-1, 0);
    } else if (direction == "left") {
      handleChocolateDirection(0, - 1);
    } else if (direction == "right") {
      handleChocolateDirection(0, 1);
    }
  }
}

function prev() {
  var prevFloor = floorActive - 1;
  if (prevFloor < 0) {
    prevFloor = (self.options.loop) ? floorCounter : 0;
  }
  scrollToStage(prevFloor, self.options.time);
}

function next() {
  var nextFloor = floorActive + 1;
  if (nextFloor > floorCounter) {
    nextFloor = (self.options.loop) ? 0 : floorCounter;
  }
  scrollToStage(nextFloor, self.options.time);
}

function handleChocolateDirection(addCoordY, addCoordX) {
  var floorReference = [self.options.ascensorMap[floorActive][0] + addCoordY, self.options.ascensorMap[floorActive][1] + addCoordX];
  $.each(self.options.ascensorMap, function(index) {
    if (floorReference.toString() == self.options.ascensorMap[index].toString()) {
      scrollToStage(index, self.options.time);
    }
  });
}
function hashChange(onLoad) {
  if (window.location.hash) {
    hash = window.location.hash.split("/").pop();
    $(self.options.ascensorFloorName).each(function(index, floorName) {
      if (hash === self.options.ascensorFloorName[index]) {
        floorActive = index;
        $("." + self.options.ascensorName + "Link").removeClass(self.options.ascensorName + "LinkActive").eq(floorActive).addClass(self.options.ascensorName + "LinkActive");
        if (!onLoad) {
          scrollToStage(floorActive, self.options.time, true);
        }
      }
    });
  }
}
function scrollToStage(floor, time, hashChange) {
  var animationParams = {
    time: time,
    easing: self.options.easing,
    callback: function() {
      scrollEnd();
    }
  };

  if (self.options.direction === "y") {
    animationParams.property = {
      scrollTop: (floor) * WH
    };
  } else if (self.options.direction === "x") {
    animationParams.property = {
      scrollLeft: (floor) * WW
    };
  } else if (self.options.direction === "chocolate") {
    animationParams.property = {
      scrollLeft: (self.options.ascensorMap[floor][1]) * WW,
      scrollTop: (self.options.ascensorMap[floor][0]) * WH
    };

    if (self.options.queued) {
      var sameXposition = node.scrollLeft() === self.options.ascensorMap[floor][1] * WW;
      var sameYposition = node.scrollTop() === self.options.ascensorMap[floor][0] * WH;
      if (self.options.queuedDirection === "x") {
        if (sameXposition) {
          animationParams.property = {
            scrollTop: (self.options.ascensorMap[floor][0]) * WH
          };
        } else {
          animationParams.property = {
            scrollLeft: (self.options.ascensorMap[floor][1]) * WW
          };
          animationParams.callback = function() {
            node.stop().animate({
              scrollTop: (self.options.ascensorMap[floor][0]) * WH
            },
            time,
            self.options.easing,

            function() {
              scrollEnd();
            });
          };
        }
      } else if (self.options.queuedDirection === "y") {
        if (sameYposition) {
          animationParams.property = {
            scrollLeft: (self.options.ascensorMap[floor][1]) * WW
          };
        } else {
          animationParams.property = {
            scrollTop: (self.options.ascensorMap[floor][0]) * WH
          };
          animationParams.callback = function() {
            node.stop().animate({
              scrollLeft: (self.options.ascensorMap[floor][1]) * WW
            },
            time,
            self.options.easing,

            function() {
              scrollEnd();
            });
          };
        }
      }
    }
  }

  node.stop().animate(animationParams.property, time, self.options.easing, animationParams.callback);

  if (!hashChange && self.options.ascensorFloorName !== null) {
    window.location.hash = "/" + self.options.ascensorFloorName[floor];
  }

  $("." + self.options.ascensorName + "Link").removeClass(self.options.ascensorName + "LinkActive");
  $("." + self.options.ascensorName + "Link" + floor).addClass(self.options.ascensorName + "LinkActive");
  floorActive = floor;
}
function scrollStart() {
  node.trigger({
    type: "ascensorStart",
    floor: floorActive
  });
}

function scrollEnd() {
  node.trigger({
    type: "ascensorEnd",
    floor: floorActive
  });
}

node.on("scrollToStage", function(event, direction) {
  if (direction == "next") {
    next();
  } else if (direction == "prev") {
    prev();
  } else {
    handleDirection(direction);
  }
});

node.on("scrollToFloor", function(event, floor) {
  if(floor > floorCounter) return;
  scrollToStage(floor);
});


node.on("next", function(event, floor) {
  next();
});

node.on("prev", function(event, floor) {
  prev();
});


node.on("update", function() {
  nodeChildren = node.children(self.options.childType);
  resize();
});
function checkKey(e){
  if ($("input, textarea, button").is(":focus")) {
    return;
  }
  switch (e.which) {
  case 40:
  case 83:
    handleDirection("down");
    break;
  case 38:
  case 87:
    handleDirection("up");
    break;

  case 37:
  case 65:
    handleDirection("left");
    break;

  case 39:
  case 68:
    handleDirection("right");
    break;
  }
}
node.css({
  "position" : "absolute",
  "width" : WW,
  "height" : WH
});

nodeChildren.width(WW).height(WH).each(function(index) {
  floorCounter += 1;
});

if (self.options.direction === "x" || self.options.direction === "chocolate") {
  nodeChildren.css({
    "position": "absolute",
    "overflow": "auto"
  });
}

if (self.options.keyNavigation) {
  $document.keydown(checkKey);
}

$window.resize(function() {
  resize();
}).load(function() {
  resize();
}).resize();

if (window.DeviceOrientationEvent) {
  $window.bind('orientationchange', function() {
    resize();
  });
}

$window.on("hashchange", function() {
  hashChange();
});

scrollToStage(floorActive, 1, true);
hashChange(true);

if (self.options.touchSwipeIntegration) {
  node.swipe({
    swipe: function(event, direction, distance, duration, fingerCount) {
      var ascensorDirStr = "";
      if (direction == "up") ascensorDirStr = "Down";
      else if (direction == "down") ascensorDirStr = "Up";
      else if (direction == "left") ascensorDirStr = "Right";
      else if (direction == "right") ascensorDirStr = "Left";
      node.trigger({
        type: "ascensor" + ascensorDirStr,
        floor: floorActive
      });
    },
    threshold: 70
  });
}
};

$.fn[ pluginName ] = function ( options ) {
  return this.each(function() {
    if ( !$.data( this, "plugin_" + pluginName ) ) {
      $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
    }
  });
};

})( jQuery, window, document );