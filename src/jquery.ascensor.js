;(function ( $, window, document, undefined ) {  
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
      touchSwipeIntegration       => Choose if you want swipe event support (requires http://labs.rampinteractive.co.uk/touchSwipe/)
      queued                      => Choose if you want direction scroll queued
  */
  var defaults = {
    ascensorFloorName: null,
    childType: "div",
    windowsOn: 0,
    direction: "y",
    loop: true,
    time: 300,
    easing: "linear",
    keyNavigation: true,
    touchSwipeIntegration: false,
    queued: false
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
      WW,
      WH,
      
      //plugins settings
      direction = self.options.direction,
      $document = $(document),
      $window = $(window),
      
      //hash 
      hash,
      chocolate = (typeof(self.options.direction) == "object");

      
function resize() {
  WW = $window.width();
  WH = $window.height();
  
  nodeChildren.width(WW).height(WH);
  node.width(WW).height(WH);

  if (self.options.direction === "y") {
    node.stop().scrollTop((floorActive) * WH);
  }

  if (self.options.direction === "x") {
    node.stop().scrollLeft((floorActive) * WW);
    nodeChildren.each(function(index) {
      $(this).css("left", index * WW);
    });
  }

  if (chocolate) {
    nodeChildren.each(function(index) {
      $(this).css({
        "left": (self.options.direction[index][1]) * WW,
        "top": (self.options.direction[index][0]) * WH
      });
    });
    
    scrollToStage(floorActive, 1);
    
    node.stop().scrollLeft((self.options.direction[floorActive][1]) * WW).scrollTop((self.options.direction[floorActive][0]) * WH);
  }
}
function handleDirection(direction) {
  if (self.options.direction == "y") {
    if (direction == ("left" || "right")) {
      return;
    } else if (direction == "down") {
      self.next();
    } else if (direction == "up") {
      prev();
    }

  } else if (self.options.direction == "x") {
    if (direction == ("up" || "down")) return;
    if (direction == "left") {
      prev();
    } else if (direction == "right") {
      self.next();
    }

} else if (chocolate) {
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
    if (!self.options.loop) return;
    prevFloor = floorCounter;
  }
  scrollToStage(prevFloor, self.options.time);
}

this.next = function(){
  var nextFloor = floorActive + 1;
  if (nextFloor > floorCounter) {
    if (!self.options.loop) return;
    nextFloor = 0;
  }
  scrollToStage(nextFloor, self.options.time);
};

function handleChocolateDirection(addCoordY, addCoordX) {
  var floorReference = [self.options.direction[floorActive][0] + addCoordY, self.options.direction[floorActive][1] + addCoordX];
  $.each(self.options.direction, function(index) {
    if (floorReference.toString() == self.options.direction[index].toString()) {
      scrollToStage(index, self.options.time);
    }
  });
}
function getFloorFromHash() {
  if (window.location.hash) {
    hash = window.location.hash.split("/").pop();
    var floor = false;
    $(self.options.ascensorFloorName).each(function(index, floorName) {
      if (hash === self.options.ascensorFloorName[index]) {
        floor = index ;
      }
    });
    return floor;
  }
}
function scrollToStage(floor, time) {  
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
      scrollTop: (floor) * WH
    };
  } else if (self.options.direction === "x") {
    animationParams.property = {
      scrollLeft: (floor) * WW
    };
  } else if (chocolate) {
    animationParams.property = {
      scrollLeft: (self.options.direction[floor][1]) * WW,
      scrollTop: (self.options.direction[floor][0]) * WH
    };

    if (self.options.queued) {
      var sameXposition = node.scrollLeft() === self.options.direction[floor][1] * WW;
      var sameYposition = node.scrollTop() === self.options.direction[floor][0] * WH;
      if (self.options.queued === "x") {
        if (sameXposition) {
          animationParams.property = {
            scrollTop: (self.options.direction[floor][0]) * WH
          };
        } else {
          animationParams.property = {
            scrollLeft: (self.options.direction[floor][1]) * WW
          };
          animationParams.callback = function() {
            node.stop().animate({
              scrollTop: (self.options.direction[floor][0]) * WH
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
            scrollLeft: (self.options.direction[floor][1]) * WW
          };
        } else {
          animationParams.property = {
            scrollTop: (self.options.direction[floor][0]) * WH
          };
          animationParams.callback = function() {
            node.stop().animate({
              scrollLeft: (self.options.direction[floor][1]) * WW
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
  if(self.options.ascensorFloorName) {
    window.location.hash = "/" + self.options.ascensorFloorName[floor];
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
  } else if(typeof floor == 'number') {
    if (floor > floorCounter) return;
    scrollToStage(floor, self.options.time);
  }
});


node.on("next", function(event, floor) {
  self.next();
});


node.on("prev", function(event, floor) {
  prev();
});

node.on("refresh", function() {
  if(node.children().length > nodeChildren.length || node.children().length < nodeChildren.length) {
    nodeChildren = node.children(self.options.childType);
    if (self.options.direction === "x" || chocolate) {
      nodeChildren.css({
        "position": "absolute",
        "overflow": "auto"
      });
    }
    floorCounter = -1;
    nodeChildren.each(function(index) {
      floorCounter += 1;
    });
  
    childrenLenght = node.children().length;
    node.trigger("refresh");
    resize();
  }
});
function checkKey(e){
  if ($("input, textarea, button").is(":focus")) {
    return;
  }
  switch (e.which) {
  case 40:
  case 83:
    if(self.options.direction == "x") return;
    node.trigger("scrollToDirection", "down");
    break;
  case 38:
  case 87:
    if(self.options.direction == "x") return;
    node.trigger("scrollToDirection", "up");
    break;

  case 37:
  case 65:
    if(self.options.direction == "y") return;
    node.trigger("scrollToDirection", "left");
    break;

  case 39:
  case 68:
    if(self.options.direction == "y") return;
    node.trigger("scrollToDirection", "right");
    break;
  }
}
node.css({
  "position" : "absolute"
});

nodeChildren.each(function(index) {
  floorCounter += 1;
});

if (self.options.direction === "x" || chocolate) {
  nodeChildren.css({
    "position": "absolute",
    "overflow": "auto"
  });
}

node.data("current-floor", floorActive);

if (self.options.keyNavigation) {
  $document.keydown(checkKey);
}

if (self.options.ascensorFloorName && window.location.hash) {
  var hashFloor = getFloorFromHash();
  if(hashFloor){
    floorActive = hashFloor;
  }
}

scrollToStage(floorActive, 1);

if (self.options.touchSwipeIntegration) {
  node.swipe({
    swipe: function(event, direction, distance, duration, fingerCount) {
      node.trigger("scrollToDirection", direction);
    },
    threshold: 70
  });
}



$window.resize(function() {
  resize();
}).load(function(){
  resize();
}).resize();

if (window.DeviceOrientationEvent) {
  $window.bind('orientationchange', function() {
    resize();
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