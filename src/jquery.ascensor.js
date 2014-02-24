(function($, window, document, undefined) {
    var pluginName = 'ascensor';

    /*
    Parameters => 
      ascensorFloorName           => Choose name for each floor, default to false
      childType                   => Specify the child type if not a 'div' element
      windowsOn                   => Choose the floor to start on
      direction                   => specify if direction is x,y or chocolate
      loop                        => If ascensor should loop at the end
      time                        => Specify speed of transition
      easing                      => Specify if direction is x,y or chocolate
      keyNavigation               => Choose if you want direction key support
      queued                      => Choose if you want direction scroll queued
  */
    var defaults = {
      ascensorFloorName: null,
      childType: "div",
      windowsOn: 0,
      direction: "y",
      loop: false,
      width: "100%",
      height: "100%",
      time: 300,
      easing: "linear",
      keyNavigation: true,
      queued: false,
      jump: false,
      ready: false
    };

    /*
    Create plugin instance
  */
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
        NH,
        NW,

        //plugins settings
        direction = self.options.direction,
        $document = $(document),
        $window = $(window),

        //hash 
        hash,
        chocolate = (typeof(self.options.direction) == "object");
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/ ) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in this &&
        this[from] === elt)
        return from;
    }
    return -1;
  };
}
// From https://gist.github.com/lorenzopolidori/3794226
function has3d() {
  var el = document.createElement('p'),
    support3D,
    transforms = {
      'webkitTransform': '-webkit-transform',
      'OTransform': '-o-transform',
      'msTransform': '-ms-transform',
      'MozTransform': '-moz-transform',
      'transform': 'transform'
    };

  // Add it to the body to get the computed style
  document.body.insertBefore(el, null);

  for (var t in transforms) {
    if (el.style[t] !== undefined) {
      el.style[t] = 'translate3d(1px,1px,1px)';
      support3D = window.getComputedStyle(el).getPropertyValue(transforms[t]);
    }
  }

  document.body.removeChild(el);

  return (support3D !== undefined && support3D.length > 0 && support3D !== "none");
}

self.supportTransform = has3d();
function getCss(index, property) {
  var parentCss;
  var css;
  if (property == "top") {
    parentCss = NH;
    css = {
      "top": (index * parentCss)
    };
  } else {
    parentCss = NW;
    css = {
      "left": (index * parentCss)
    };
  }

  if (self.supportTransform) {
    var transformAxis = "translateX";
    if (property == "top") transformAxis = "translateY";
    css = {
      "transform": transformAxis + '(' + index * 100 + '%)'
    };
  }

  return css;
}

function resize() {
  NW = node.width();
  NH = node.height();

  if (self.options.direction === "y") {
    node.stop().scrollTop((floorActive) * NH);
    nodeChildren.each(function(index) {
      $(this).css(getCss(index, "top"));
    });
  }

  if (self.options.direction === "x") {
    node.stop().scrollLeft((floorActive) * NW);
    nodeChildren.each(function(index) {
      $(this).css(getCss(index, "left"));
    });
  }

  if (chocolate) {
    node.stop().scrollLeft((self.options.direction[floorActive][1]) * NW).scrollTop((self.options.direction[floorActive][0]) * NH);
    nodeChildren.each(function(index) {
      var css = {
        "left": (self.options.direction[index][1]) * NW,
        "top": (self.options.direction[index][0]) * NH
      };

      if (self.supportTransform) css = {
        "transform": 'translateX(' + (self.options.direction[index][1]) * 100 + '%) translateY(' + (self.options.direction[index][0]) * 100 + '%)'
      };
      $(this).css(css);
    });
  }
}
var floorMap = [];

function generateFloorMap() {

  /* Use only array if chilren is present on stage */
  var directionArray = jQuery.grep(self.options.direction, function(directionArray, index) {
    return (node.children().length > index);
  });
  

  function getClosestFloor(floor, floorCollection, axis, direction) {
    var goal = floor[axis];
    var closest = false;
    $.each(floorCollection, function() {
      if (((direction == "right" ||  direction == "down") && (this[axis] > floor[axis])) || ((direction == "left" ||  direction == "up") && (this[axis] < floor[axis]))) {
        if (!closest || Math.abs(this[axis] - goal) < Math.abs(closest[axis] - goal)) {
          closest = this;
        }
      }
    });
    if (closest && directionArray.indexOf(closest) !== -1) {
      return directionArray.indexOf(closest);
    } else {
      return false;
    }
  }

  function getfurthestFloor(floor, floorCollection, axis, direction) {
    var goal = floor[axis];
    var furthest = false;
    $.each(floorCollection, function() {
      if (!furthest || Math.abs(this[axis] - goal) > Math.abs(furthest[axis] - goal)) {
        furthest = this;
      }
    });
    if (furthest && directionArray.indexOf(furthest) !== -1) {
      return directionArray.indexOf(furthest);
    } else {
      return false;
    }
  }

  function getIncrementedFloor(floorCollection, axis) {
    var goal = 0;
    var floor = false;
    $.each(floorCollection, function() {
      if (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) {
        floor = this;
      }
    });
    if (floor && directionArray.indexOf(floor) !== -1) {
      return directionArray.indexOf(floor);
    } else {
      return false;
    }
  }

  function getDecrementedFloor(floorCollection, axis) {
    var goal = 0;
    var floor = false;
    $.each(floorCollection, function() {
      if (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) {
        floor = this;
      }
    });
    if (floor && directionArray.indexOf(floor) !== -1) {
      return directionArray.indexOf(floor);
    } else {
      return false;
    }
  }

  function getFloor(x, y, floorOne, floorTwo) {
    if (floorOne[0] + x == floorTwo[0] && floorOne[1] + y == floorTwo[1]) {
      return directionArray.indexOf(floorTwo);
    } else {
      return false;
    }
  }

  function getFurtherFloorOnAxis(floorArray, axis) {
    var furtherFloor = false;
    jQuery.each(floorArray, function(index, directionArray){
      if(furtherFloor === false || furtherFloor[axis] < directionArray[axis]){
        furtherFloor = directionArray;
      }
    });
    return furtherFloor;
  }
  
  function getClosestFloorOnAxis(floorArray, axis) {
    var furtherFloor=false;
    jQuery.each(floorArray, function(index, directionArray){
      if(furtherFloor === false || furtherFloor[axis] > directionArray[axis]){
        furtherFloor = directionArray;
      }
    });
    return furtherFloor;
  }
  
  function getSameAxisFloor(floorItem, axis) {
    return jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[axis] == floorItem[axis];
      return isOnSameAxis;
    });
  }
  
  var approximateFurtherX = getFurtherFloorOnAxis(directionArray, 1);
  var sameAxisXFurthest = getSameAxisFloor(approximateFurtherX, 1);
  var furtherY = getFurtherFloorOnAxis(sameAxisXFurthest, 0);
  
  var approximateFurtherY = getFurtherFloorOnAxis(directionArray, 0);
  var sameAxisYFurthest = getSameAxisFloor(approximateFurtherY, 0);
  var furtherX = getFurtherFloorOnAxis(sameAxisYFurthest, 1);
  
  floorMap.furthest_x = directionArray.indexOf(furtherX);
  floorMap.furthest_y = directionArray.indexOf(furtherY);
  
  var approximateClosestX = getClosestFloorOnAxis(directionArray, 1);
  var sameAxisXClosest = getSameAxisFloor(approximateClosestX, 1);
  var closestY = getClosestFloorOnAxis(sameAxisXClosest, 0);

  var approximateClosestY = getClosestFloorOnAxis(directionArray, 0);
  var sameAxisYClosest = getSameAxisFloor(approximateClosestY, 0);
  var closestX = getClosestFloorOnAxis(sameAxisYClosest, 1);
  
  floorMap.closest_x = directionArray.indexOf(closestX);
  floorMap.closest_y = directionArray.indexOf(closestY);
  

  $.each(directionArray, function(index, floorItem) {
    var axisXfloor = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0];
      var isCurrentFloor = floorItem == directionArray;
      return (isOnSameAxis && !isCurrentFloor);
    });

    var axisYfloor = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1];
      var isCurrentFloor = floorItem == directionArray;
      return (isOnSameAxis && !isCurrentFloor);
    });

    var directNextXAxis = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0] + 1;
      return isOnSameAxis;
    });

    var directPreviousXAxis = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[0] == floorItem[0] - 1;
      return isOnSameAxis;
    });

    var directNextYAxis = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1] + 1;
      return isOnSameAxis;
    });

    var directPreviousYAxis = jQuery.grep(directionArray, function(directionArray) {
      var isOnSameAxis = directionArray[1] == floorItem[1] - 1;
      return isOnSameAxis;
    });

    floorMap[index] = {
      "down": false,
      "up": false,
      "right": false,
      "left": false,
      "increment": {
        "down": getIncrementedFloor(directNextYAxis, 1),
        "up": getDecrementedFloor(directPreviousYAxis, 0),
        "right": getIncrementedFloor(directNextXAxis, 0),
        "left": getDecrementedFloor(directPreviousXAxis, 1)
      },
      "closest": {
        "down": getClosestFloor(floorItem, axisYfloor, 0, "down"),
        "up": getClosestFloor(floorItem, axisYfloor, 0, "up"),
        "right": getClosestFloor(floorItem, axisXfloor, 1, "right"),
        "left": getClosestFloor(floorItem, axisXfloor, 1, "left")
      },
      "furthest": {
        "down": getfurthestFloor(floorItem, axisYfloor, 0, "down"),
        "up": getfurthestFloor(floorItem, axisYfloor, 0, "up"),
        "right": getfurthestFloor(floorItem, axisXfloor, 1, "right"),
        "left": getfurthestFloor(floorItem, axisXfloor, 1, "left")
      }
    };

    $.each(directionArray, function(indexSecond, floorItemSecond) {
      if (floorMap[index].down === false) floorMap[index].down = getFloor(1, 0, floorItem, floorItemSecond);
      if (floorMap[index].up === false) floorMap[index].up = getFloor(-1, 0, floorItem, floorItemSecond);
      if (floorMap[index].right === false) floorMap[index].right = getFloor(0, 1, floorItem, floorItemSecond);
      if (floorMap[index].left === false) floorMap[index].left = getFloor(0, - 1, floorItem, floorItemSecond);
    });
  });
}
function handleDirection(direction) {
  if (self.options.direction == "y") {
    if (direction == ("left" || "right")) return;
    if (direction == "down") {
      self.next();
    } else if (direction == "up") {
      self.prev();
    }
  } else if (self.options.direction == "x") {
    if (direction == ("up" || "down")) return;
    if (direction == "left") {
      self.prev();
    } else if (direction == "right") {
      self.next();
    }
  } else if (chocolate) {
    var targetId;

    /* If existing, use direct depending floor */
    if (floorMap[floorActive][direction] !== false) {
      targetId = floorMap[floorActive][direction];
    }

    /* Jump is set to true, use the closest floor in that same direction */
    else if (self.options.jump === true && floorMap[floorActive].closest[direction] !== false) {
      targetId = floorMap[floorActive].closest[direction];
    }

    /* If loop is set to true, use the furthest floor */
    else if (self.options.loop === true) {
      targetId = floorMap[floorActive].furthest[direction];
      
    /* If loop is specify on axis */
    } else if (self.options.loop == "loop-x" && (direction == "right" || direction == "left") && floorMap[floorActive].furthest[direction] !== false) {
      targetId = floorMap[floorActive].furthest[direction];
    } else if (self.options.loop == "loop-y" && (direction == "down" || direction == "up") && floorMap[floorActive].furthest[direction] !== false) {
      targetId = floorMap[floorActive].furthest[direction];
    }

    /* if loop is set to a increment */
    else if (typeof self.options.loop === "string") {
      var correctYDirection = ((direction == "down" || direction == "up") && self.options.loop == "increment-y");
      var correctXDirection = ((direction == "right" || direction == "left") && self.options.loop == "increment-x");
      
      /* if a increment is possible */
      if (floorMap[floorActive].increment[direction] !== false) {
        if (correctYDirection || correctXDirection || self.options.loop == "increment") {
          targetId = floorMap[floorActive].increment[direction];
        }
        
      /* If you are on the last/first floor, jump to the opposite floor */
      } else {
        if (direction == "right" || direction == "left" ) {
          if (self.options.loop == "increment-y") return;
          if (floorActive == floorMap.furthest_x) {
            targetId = floorMap.closest_x;
          } else if (floorActive == floorMap.closest_x) {
            targetId = floorMap.furthest_x;
          }
        } else if (direction == "down" || direction == "up" ) {
          if (self.options.loop == "increment-x") return;
          if (floorActive == floorMap.furthest_y) {
            targetId = floorMap.closest_y;
          } else if (floorActive == floorMap.closest_y) {
            targetId = floorMap.furthest_y;
          }
        }
      }
    }

    
    if (typeof targetId === "number") {
      scrollToStage(targetId, self.options.time);
    }
  }
}

this.prev = function() {
  var prevFloor = floorActive - 1;
  if (prevFloor < 0) {
    if (!self.options.loop) return;
    prevFloor = floorCounter;
  }
  scrollToStage(prevFloor, self.options.time);
};

this.next = function() {
  var nextFloor = floorActive + 1;
  if (nextFloor > floorCounter) {
    if (!self.options.loop) return;
    nextFloor = 0;
  }
  scrollToStage(nextFloor, self.options.time);
};
function getFloorFromHash() {
  if (window.location.hash) {
    hash = window.location.hash.split("#").pop();
    var floor = false;
    if(self.options.ascensorFloorName) {
      $.each(self.options.ascensorFloorName, function(index, floorName) {
        if (hash === self.options.ascensorFloorName[index]) {
          floor = index;
        }
      });
    }
    return floor;
  }
}
function scrollToStage(floor, time, firstrun) {
  firstrun = firstrun ||  false;
  scrollStart(floorActive, floor);

  var animationParams = {
    time: time || self.options.time,
    easing: self.options.easing,
    callback: function() {
      scrollEnd(floorActive, floor);
    }
  };

  if (self.options.direction === "y") {
    animationParams.property = {
      scrollTop: (floor) * NH
    };
  } else if (self.options.direction === "x") {
    animationParams.property = {
      scrollLeft: (floor) * NW
    };
  } else if (chocolate) {
    animationParams.property = {
      scrollLeft: (self.options.direction[floor][1]) * NW,
      scrollTop: (self.options.direction[floor][0]) * NH
    };

    if (self.options.queued) {
      var sameXposition = node.scrollLeft() === self.options.direction[floor][1] * NW;
      var sameYposition = node.scrollTop() === self.options.direction[floor][0] * NH;
      if (self.options.queued === "x") {
        if (sameXposition) {
          animationParams.property = {
            scrollTop: (self.options.direction[floor][0]) * NH
          };
        } else {
          animationParams.property = {
            scrollLeft: (self.options.direction[floor][1]) * NW
          };
          animationParams.callback = function() {
            node.stop().animate({
                scrollTop: (self.options.direction[floor][0]) * NH
              },
              time,
              self.options.easing,

              function() {
                scrollEnd(floorActive, floor);

              });
          };
        }
      } else if (self.options.queued === "y") {
        if (sameYposition) {
          animationParams.property = {
            scrollLeft: (self.options.direction[floor][1]) * NW
          };
        } else {
          animationParams.property = {
            scrollTop: (self.options.direction[floor][0]) * NH
          };
          animationParams.callback = function() {
            node.stop().animate({
                scrollLeft: (self.options.direction[floor][1]) * NW
              },
              time,
              self.options.easing,

              function() {
                scrollEnd(floorActive, floor);
              });
          };
        }
      }
    }
  }

  node.stop().animate(animationParams.property, time, self.options.easing, animationParams.callback);

  if (firstrun && typeof(self.options.ready) == "function") {
    self.options.ready();
  }

  if (self.options.ascensorFloorName) {
    window.location.replace(('' + window.location).split('#')[0] + '#' + self.options.ascensorFloorName[floor]);
  }

  floorActive = floor;
  node.data("current-floor", floorActive);
}
function scrollStart(from, to) {
  var floor = {
    from: from,
    to: to
  };
  node.trigger("scrollStart", floor);
}

function scrollEnd(from, to) {
  var floor = {
    from: from,
    to: to
  };
  node.trigger("scrollEnd", floor);
}

node.on("scrollToDirection", function(event, direction) {
  handleDirection(direction);
});

node.on("scrollToStage", function(event, floor) {
  if (typeof floor == 'string') {
    var floorId = $.inArray(floor, self.options.ascensorFloorName);
    if (floorId !== -1) scrollToStage(floorId, self.options.time);
  } else if (typeof floor == 'number') {
    if (floor > floorCounter) return;
    scrollToStage(floor, self.options.time);
  }
});

node.on("next", function(event, floor) {
  self.next();
});

node.on("prev", function(event, floor) {
  self.prev();
});

node.on("refresh", function() {
  if (node.children().length > nodeChildren.length || node.children().length < nodeChildren.length) {
    nodeChildren = node.children(self.options.childType);

    nodeChildren.css({
      "position": "absolute",
      "overflow": "auto",
      "top": "0",
      "left": "0",
      "width": "100%",
      "height": "100%"
    });

    floorCounter = -1;
    nodeChildren.each(function(index) {
      floorCounter += 1;
    });

    childrenLenght = node.children().length;
    node.trigger("refresh");
    resize();
    generateFloorMap();
  }
});
function checkKey(e) {
  var key = e.which;
  if (!$("input, textarea, button").is(":focus")) {
    switch (key) {
    case 40:
    case 83:
      if (self.options.direction == "x") return;
      node.trigger("scrollToDirection", "down");
      break;
    case 38:
    case 87:
      if (self.options.direction == "x") return;
      node.trigger("scrollToDirection", "up");
      break;
  
    case 37:
    case 65:
      if (self.options.direction == "y") return;
      node.trigger("scrollToDirection", "left");
      break;
  
    case 39:
    case 68:
      if (self.options.direction == "y") return;
      node.trigger("scrollToDirection", "right");
      break;
    }
  }
}
nodeChildren.each(function(index) {
  floorCounter += 1;
});


node.css({
  "position": "absolute",
  "overflow": "hidden",
  "top": "0",
  "left": "0",
  "width": self.options.width,
  "height": self.options.height
});

nodeChildren.css({
  "position": "absolute",
  "overflow": "auto",
  "top": "0",
  "left": "0",
  "width": "100%",
  "height": "100%"
});


NH = node.width();
NW = node.height();

if (chocolate) {
  generateFloorMap();
}

node.data("current-floor", floorActive);

if (self.options.keyNavigation) {
  $document.keydown(checkKey);
}

if (self.options.ascensorFloorName && window.location.hash) {
  var hashFloor = getFloorFromHash();
  if (hashFloor) {
    floorActive = hashFloor;
  }
}

$(window).on('hashchange', function() {
  var hashFloor = getFloorFromHash();
  if (hashFloor && !node.is(':animated')) {
    scrollToStage(hashFloor, self.options.time);
  }
});

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

scrollToStage(floorActive, 1, true);
};

$.fn[ pluginName ] = function ( options ) {
  return this.each(function() {
    if ( !$.data( this, "plugin_" + pluginName ) ) {
      $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
    }
  });
};

})( jQuery, window, document );