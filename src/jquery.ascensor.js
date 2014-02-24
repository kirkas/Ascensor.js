(function($, window, document, undefined) {
  var pluginName = 'ascensor';


  /* Default settings */
  var defaults = {
    ascensorFloorName: null,
    childType: 'div',
    windowsOn: 0,
    direction: 'y',
    loop: false,
    width: '100%',
    height: '100%',
    time: 300,
    easing: 'linear',
    keyNavigation: true,
    queued: false,
    jump: false,
    ready: false
  };

  /* Plugin instance */
  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
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

    return (support3D !== undefined && support3D.length > 0 && support3D !== 'none');
  }




  /* Add 'indexOf' helper in case missing (IE8) */
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/ ) {
      var len = this.length >>> 0;
      var from = Number(arguments[1]) || 0;
      from = (from < 0) ? Math.ceil(from) : Math.floor(from);
      if (from < 0) from += len;
      for (; from < len; from++) {
        if (from in this &&
          this[from] === elt)
          return from;
      }
      return -1;
    };
  }


  /* Array helper */
  function existInArray(array, item) {
    var index = array.indexOf(item);
    if (index !== -1) return true;
    return false;
  }


  /* Plugin start */
  Plugin.prototype = {


    /* Initialization of plugin */
    init: function() {

      var self = this;

      /* Constant helper*/
      this.AXIS_X = 1;
      this.AXIS_Y = 0;

      /* Setup global variable - selector */
      this.node = $(this.element);
      this.nodeChildren = this.node.children(this.options.childType);
      this.floorActive = (this._getFloorFromHash()) ? this._getFloorFromHash() : this.options.windowsOn;

      this.NH = this.node.height();
      this.NW = this.node.width();

      /* Setup global variable - helper */
      this.directionIsArray = (typeof(this.options.direction) == 'object');
      this.supportTransform = has3d();

      /* Start the magic */
      this.setup(function() {
        if (typeof(self.options.ready) == 'function') {
          self.options.ready();
        }
      });

    },


    /* Magic */
    setup: function(callback) {

      var self = this;

      if (this.directionIsArray) this._generateFloorMap();

      /* Setup floor size & position */
      this.node.css({
        'position': 'absolute',
        'overflow': 'hidden',
        'top': '0',
        'left': '0',
        'width': this.options.width,
        'height': this.options.height
      });

      this.nodeChildren.css({
        'position': 'absolute',
        'overflow': 'auto',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%'
      });

      /* place element correctly */
      this.nodeChildren.each(function(index) {
        if (self.supportTransform) {
          $(this).css({
            'transform': function() {
              if (self.options.direction === 'y') return 'translateY(' + index * 100 + '%)';
              if (self.options.direction === 'x') return 'translateX(' + index * 100 + '%)';
              if (self.directionIsArray) return 'translateY(' + self.options.direction[index][self.AXIS_Y] * 100 + '%) translateX(' + self.options.direction[index][self.AXIS_X] * 100 + '%)';
            }
          });
        } else {
          $(this).css({
            'top': function() {
              if (self.options.direction === 'y') return index * 100 + '%';
              if (self.directionIsArray) return self.options.direction[index][self.AXIS_Y] * 100 + '%';
            },
            'left': function() {
              if (self.options.direction === 'x') return index * 100 + '%';
              if (self.directionIsArray) return self.options.direction[index][self.AXIS_X] * 100 + '%';
            },
          });
        }
      });

      /* Setup User listener */
      this.node.on('scrollToDirection', function(event, direction) {
        self._handleDirection(direction);
      });

      this.node.on('scrollToStage', function(event, floor) {
        if (typeof floor == 'string') {
          var floorId = $.inArray(floor, self.options.ascensorFloorName);
          if (floorId !== -1) this.scrollToFloor(floorId);
        } else if (typeof floor == 'number') {
          if (floor > self.nodeChildren.length) return;
          self.scrollToFloor(floor);
        }
      });

      this.node.on('next', function(event, floor) {
        self.next();
      });

      this.node.on('prev', function(event, floor) {
        self.prev();
      });

      this.node.on('refresh', function() {
        self.setup();
      });

      /* setup resize & key listener */
      $(window).bind('resize', function(event) {
        self.scrollToFloor(self.floorActive, false);
      });
      $(window).bind('hashchange', function(event) {
        self._hashchangeHandler(event);
      });

      if (window.DeviceOrientationEvent) {
        $(window).bind('orientationchange', function(event) {
          self.scrollToFloor(self.floorActive);
        });
      }

      if (this.options.keyNavigation) {
        $(document).bind('keyup keypress', function(event) {
          self._keypressHandler(event);
        });
      }

      this.scrollToFloor(self.floorActive);

      if (typeof(callback) == 'function') callback();

    },



    /*
      Helper : Return floor index 
      from hash.
    */
    _getFloorFromHash: function() {
      if (window.location.hash) {
        var hash = window.location.hash.split('#').pop();
        if (this.options.ascensorFloorName && existInArray(this.options.ascensorFloorName, hash)) {
          return this.options.ascensorFloorName.indexOf(hash);
        }
      }
      return false;
    },



    /*
      Hanlder: Handle window hashcange event
    */
    _hashchangeHandler: function() {
      if (this._getFloorFromHash() && !this.node.is(':animated')) {
        this.scrollToFloor(self._getFloorFromHash());
      }
    },



    /*
      Event helper, let ascensor
      create own event, with floor
      information
    */
    _emitEvent: function(eventName, from, to) {
      this.node.trigger(eventName, floor = {
        from: from,
        to: to
      });
    },



    /*
      Keypress Handler
    */
    _keypressHandler: function(e) {
      var self = this;
      var key = e.keyCode || e.which;
      if (!$('input, textarea, button').is(':focus')) {
        switch (key) {
          case 40:
          case 83:
            self._handleDirection('down');
            break;
          case 38:
          case 87:
            self._handleDirection('up');
            break;

          case 37:
          case 65:
            self._handleDirection('left');
            break;

          case 39:
          case 68:
            self._handleDirection('right');
            break;
        }
      }
    },



    /*
      Resize handler.
      Update scrollTop & scrollLeft position
    */
    scrollToFloor: function(floor) {
      var self = this;
      var animate = animate || ((floor == this.floorActive) ? false : true);

      if (this.NW !== this.node.width()) this.NW = this.node.width();
      if (this.NH !== this.node.height()) this.NH = this.node.height();

      /* Make sure position is correct */
      var animationObject = this._getAnimationSettings(floor);

      if (animate) {
        this._emitEvent('scrollStart', self.floorActive, floor);
        this.node.stop().animate(animationObject.property, self.options.time, self.options.easing, animationObject.callback);
      } else {
        this.node.stop().scrollTop(animationObject.property.scrollTop).scrollLeft(animationObject.property.scrollLeft);
      }

      if (floor !== this.floorActive) {
        if (self.options.ascensorFloorName) {
          window.location.replace(('' + window.location).split('#')[0] + '#' + self.options.ascensorFloorName[floor]);
        }
        self.floorActive = floor;
        this.node.data('current-floor', self.floorActive);
      }

    },




    /* Prev function */
    prev: function() {
      var targetFloor = this.floorActive - 1;
      if (targetFloor < 0) {
        if (!this.options.loop) return;
        targetFloor = this.nodeChildren.length;
      }
      this.scrollToFloor(targetFloor);
    },



    /* Prev function */
    next: function() {
      var targetFloor = this.floorActive + 1;
      if (targetFloor > this.nodeChildren.length) {
        if (!this.options.loop) return;
        targetFloor = 0;
      }

      this.scrollToFloor(targetFloor);
    },



    /*
      Helper to generate animation settings
    */
    _getAnimationSettings: function(floor) {
      var self = this;

      /* 
        Create animation setting object 
      */
      var animationSettings = {
        property: {},
        callback: function() {
          self._emitEvent('scrollEnd', self.floorActive, floor);
        }
      };

      /* 
        Create a second setting object, 
        in case the queued option is set 
      */
      var secondAnimationSettings = {
        property: {},
        callback: function() {
          self._emitEvent('scrollEnd', self.floorActive, floor);
        }
      };


      /* 
        If direction is vertical
          set scrollTop property & return animationSettings
      */
      if (self.options.direction === 'y') {
        animationSettings.property.scrollTop = floor * self.NH;
        return animationSettings;
      }

      /* 
        If direction is horizontal  
          set scrollleft property & return animationSettings
      */
      else if (self.options.direction === 'x') {
        animationSettings.property.scrollLeft = floor * self.NW;
        return animationSettings;
      }

      /*  If direction is a map */
      else if (self.directionIsArray) {

        /*  Save value */
        var scrollTopValue = self.options.direction[floor][self.AXIS_Y] * self.NH;
        var scrollLeftValue = self.options.direction[floor][self.AXIS_X] * self.NW;


        /*  If the queued option is set */
        if (self.options.queued) {

          /*  Check floor position, to avoid animation if already on same floor */
          var sameXposition = this.node.scrollLeft() === scrollLeftValue;
          var sameYposition = this.node.scrollTop() === scrollTopValue;

          /*  
            If queued direction is horizontal & on the same floor
              Set scrollTop property & return animationSettings
          */
          if (self.options.queued === 'x' && sameXposition) {
            animationSettings.property.scrollTop = scrollTopValue;
            return animationSettings;
          }

          /*  
            If queued direction is horizontal & NOT on the same floor
              Set scrollLeft property
              Set callback to a second animation (scrollTop)
              return animationSettings
          */
          else {
            animationSettings.property.scrollLeft = scrollLeftValue;
            secondAnimationSettings.property.scrollTop = scrollTopValue;
            animationSettings.callback = function() {
              self.node.stop().animate(secondAnimationSettings.property, self.options.time, self.options.easing, secondAnimationSettings.callback);
            };
            return animationSettings;
          }


          /*  
            If queued direction is vertical & on the same floor
              Set scrollTop scrollLeft & return animationSettings
          */
          if (self.options.queued === 'y' && sameYposition) {
            animationSettings.property.scrollLeft = scrollLeftValue;
            return animationSettings;
          }

          /*  
            If queued direction is vertical & NOT on the same floor
              Set scrollTop property
              Set callback to a second animation (scrollLeft)
              return animationSettings
          */
          else {
            animationSettings.property.scrollTop = scrollTopValue;
            secondAnimationSettings.property.scrollLeft = scrollLeftValue;
            animationSettings.callback = function() {
              self.node.stop().animate(secondAnimationSettings.property, self.options.time, self.options.easing, secondAnimationSettings.callback);
            };
            return animationSettings;
          }


        }
        /*  
          If queud option is not set, set scrollTop & ScrollLeft property & return animationSettings
        */
        else {
          animationSettings.property.scrollTop = scrollTopValue;
          animationSettings.property.scrollLeft = scrollLeftValue;
          return animationSettings;
        }
      }

      return animationSettings;
    },


    _handleDirection: function(direction) {
      var self = this;

      /* If direction is x or y and there is direction are opppsite, return here */
      if ((self.options.direction == 'y' && direction == ('left' || 'right')) || (self.options.direction == 'x' && direction == ('up' || 'down'))) return;

      /* If direction is x or x, and direction match, use prev/next */
      if ((self.options.direction == 'y' && direction == 'down') ||  (self.options.direction == 'x' && direction == 'right')) return self.next();
      if ((self.options.direction == 'y' && direction == 'up') ||  (self.options.direction == 'x' && direction == 'left')) return self.prev();


      function isFalse(value) {
        return value === false;
      }

      function isTrue(value) {
        return value === true;
      }

      function isNumber(value) {
        return typeof(value) === "number";
      }

      if (self.directionIsArray) {
        var targetId;
        var floorMap = self.floorMap[self.floorActive];

        /* If existing, return  direct depending floor */
        if (isNumber(floorMap[direction])) {
          return self.scrollToFloor(floorMap[direction]);;
        }

        /* Jump is set to true, use the closest floor in that same direction */
        if (isTrue(self.options.jump) && isNumber(floorMap.closest[direction])) {
          return self.scrollToFloor(floorMap.closest[direction]);
        }

        /* Jump is set to true, use the closest floor in that same direction */
        else if (isTrue(self.options.jump) && isNumber(floorMap.closest[direction])) {
          targetId = floorMap.closest[direction];
        }

        /* If loop is set to true, use the furthest floor */
        else if (self.options.loop === true) {
          targetId = floorMap.furthest[direction];

          /* If loop is specify on axis */
        } else if (self.options.loop == 'loop-x' && (direction == 'right' || direction == 'left') && floorMap.furthest[direction] !== false) {
          targetId = floorMap.furthest[direction];
        } else if (self.options.loop == 'loop-y' && (direction == 'down' || direction == 'up') && floorMap.furthest[direction] !== false) {
          targetId = floorMap.furthest[direction];
        }

        /* if loop is set to a increment */
        else if (typeof self.options.loop === 'string') {
          var correctYDirection = ((direction == 'down' || direction == 'up') && self.options.loop == 'increment-y');
          var correctXDirection = ((direction == 'right' || direction == 'left') && self.options.loop == 'increment-x');

          /* if a increment is possible */
          if (floorMap.increment[direction] !== false) {
            if (correctYDirection || correctXDirection || self.options.loop == 'increment') {
              targetId = floorMap.increment[direction];
            }

            /* If you are on the last/first floor, jump to the opposite floor */
          } else {
            if (direction == 'right' || direction == 'left') {
              if (self.options.loop == 'increment-y') return;
              if (self.floorActive == self.floorMap.furthest_x) {
                targetId = self.floorMap.closest_x;
              } else if (self.floorActive == self.floorMap.closest_x) {
                targetId = self.floorMap.furthest_x;
              }
            } else if (direction == 'down' || direction == 'up') {
              if (self.options.loop == 'increment-x') return;
              if (self.floorActive == self.floorMap.furthest_y) {
                targetId = self.floorMap.closest_y;
              } else if (self.floorActive == self.floorMap.closest_y) {
                targetId = self.floorMap.furthest_y;
              }
            }
          }
        }

        if (typeof targetId === 'number') {
          self.scrollToFloor(targetId);
        }
      }
    },



    _generateFloorMap: function(e) {
      var self = this;
      this.floorMap = [];

      /* Use only array if chilren is present on stage */
      var directionArray = jQuery.grep(self.options.direction, function(directionArray, index) {
        return (self.node.children().length > index);
      });


      function getClosestFloor(floor, floorCollection, axis, direction) {
        var goal = floor[axis];
        var closest = false;
        $.each(floorCollection, function() {
          if (((direction == 'right' ||  direction == 'down') && (this[axis] > floor[axis])) || ((direction == 'left' ||  direction == 'up') && (this[axis] < floor[axis]))) {
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
        jQuery.each(floorArray, function(index, directionArray) {
          if (furtherFloor === false || furtherFloor[axis] < directionArray[axis]) {
            furtherFloor = directionArray;
          }
        });
        return furtherFloor;
      }

      function getClosestFloorOnAxis(floorArray, axis) {
        var furtherFloor = false;
        jQuery.each(floorArray, function(index, directionArray) {
          if (furtherFloor === false || furtherFloor[axis] > directionArray[axis]) {
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

      this.floorMap.furthest_x = directionArray.indexOf(furtherX);
      this.floorMap.furthest_y = directionArray.indexOf(furtherY);

      var approximateClosestX = getClosestFloorOnAxis(directionArray, 1);
      var sameAxisXClosest = getSameAxisFloor(approximateClosestX, 1);
      var closestY = getClosestFloorOnAxis(sameAxisXClosest, 0);

      var approximateClosestY = getClosestFloorOnAxis(directionArray, 0);
      var sameAxisYClosest = getSameAxisFloor(approximateClosestY, 0);
      var closestX = getClosestFloorOnAxis(sameAxisYClosest, 1);

      this.floorMap.closest_x = directionArray.indexOf(closestX);
      this.floorMap.closest_y = directionArray.indexOf(closestY);


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

        self.floorMap[index] = {
          'down': false,
          'up': false,
          'right': false,
          'left': false,
          'increment': {
            'down': getIncrementedFloor(directNextYAxis, 1),
            'up': getDecrementedFloor(directPreviousYAxis, 0),
            'right': getIncrementedFloor(directNextXAxis, 0),
            'left': getDecrementedFloor(directPreviousXAxis, 1)
          },
          'closest': {
            'down': getClosestFloor(floorItem, axisYfloor, 0, 'down'),
            'up': getClosestFloor(floorItem, axisYfloor, 0, 'up'),
            'right': getClosestFloor(floorItem, axisXfloor, 1, 'right'),
            'left': getClosestFloor(floorItem, axisXfloor, 1, 'left')
          },
          'furthest': {
            'down': getfurthestFloor(floorItem, axisYfloor, 0, 'down'),
            'up': getfurthestFloor(floorItem, axisYfloor, 0, 'up'),
            'right': getfurthestFloor(floorItem, axisXfloor, 1, 'right'),
            'left': getfurthestFloor(floorItem, axisXfloor, 1, 'left')
          }
        };

        $.each(directionArray, function(indexSecond, floorItemSecond) {
          if (self.floorMap[index].down === false) self.floorMap[index].down = getFloor(1, 0, floorItem, floorItemSecond);
          if (self.floorMap[index].up === false) self.floorMap[index].up = getFloor(-1, 0, floorItem, floorItemSecond);
          if (self.floorMap[index].right === false) self.floorMap[index].right = getFloor(0, 1, floorItem, floorItemSecond);
          if (self.floorMap[index].left === false) self.floorMap[index].left = getFloor(0, -1, floorItem, floorItemSecond);
        });
      });

    },





  };


  $.fn[pluginName] = function(options) {
    this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });

    return this;
  };

})(jQuery, window, document);