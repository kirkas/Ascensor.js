/*
Ascensor.js 
version: 1.8.20 (2015-03-28)
description: Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system
repository: https://github.com/kirkas/Ascensor.js
license: BSD
author: Léo Galley <contact@kirkas.ch>
*/
(function($, window, document, undefined) {
  var pluginName = 'ascensor';


  /* Default settings */
  var defaults = {
    ascensorFloorName: false,
    childType: 'div',
    windowsOn: 0,
    direction: 'y',
    loop: false,
    width: '100%',
    height: '100%',
    time: 250,
    easing: 'linear',
    keyNavigation: true,
    queued: false,
    jump: false,
    ready: false,
    swipeNavigation: 'mobile-only',
    swipeVelocity: 0.7,
    wheelNavigation: false,
    wheelNavigationDelay: 40,
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
        if (from in this && this[from] === elt) return from;
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

  /* Value helper */
  function isFalse(value) {
    return value === false;
  }

  function isTrue(value) {
    return value === true;
  }

  function isNumber(value) {
    return typeof(value) === 'number';
  }

  function isString(value) {
    return typeof(value) === 'string';
  }

  function isFunction(value) {
    return typeof(value) === 'function';
  }

  function isObject(value) {
    return typeof(value) === 'object';
  }


  /* Plugin start */
  Plugin.prototype = {

    /* Initialization of plugin */
    init: function() {

      var self = this;

      // Constant helper
      this.AXIS_X = 1;
      this.AXIS_Y = 0;

      this.dataAttributeMap = {
        "next": "ascensor-next",
        "prev": "ascensor-prev",
        "down": "ascensor-down",
        "up": "ascensor-up",
        "left": "ascensor-left",
        "right": "ascensor-right"
      };

      // Setup global variable - selector 
      this.node = $(this.element);
      this.nodeChildren = this.node.children(this.options.childType);
      this.floorActive = (isNumber(this._getFloorFromHash())) ? this._getFloorFromHash() : this.options.windowsOn;

      this.NH = this.node.height();
      this.NW = this.node.width();

      // Setup global variable - helper
      var androidCompatible = true;
      var version = navigator.userAgent.match(/Android\s+([\d\.]+)/);
      if (version) androidCompatible = parseFloat(version[1]) > 3;


      this.directionIsArray = isObject(this.options.direction);
      this.supportTransform = has3d() && androidCompatible;



      // Check if floor name array & node children length match
      if (isObject(this.options.ascensorFloorName) && this.options.ascensorFloorName.length < this.nodeChildren.length) {
        return this._emitConsoleMessage("error", "floors total (" + this.nodeChildren.length + ") & floor name array length (" + this.options.ascensorFloorName.length + ") don't match");
      }

      // Check if direction array & node children length match
      if (this.directionIsArray && this.options.direction.length < this.nodeChildren.length) {
        return this._emitConsoleMessage("error", "floors total (" + this.nodeChildren.length + ") & direction array lenght (" + this.options.direction.length + ") don't match");
      }

      // Start the magic
      this.setup();

    },


    /* Magic */
    setup: function() {
      this._positionElement();
      this._bindEvents();
      this.scrollToFloor(this.floorActive);

      if (isObject(this.options.ascensorFloorName)) {
        this._updateHash(this.floorActive);
      }
      if (isFunction(this.options.ready)) this.options.ready();
    },


    /* Setup User listener */
    _bindEvents: function() {
      var self = this;

      this.node.on('scrollToDirection', function(event, direction) {
        self.scrollToDirection(direction);
      });

      this.node.on('scrollToStage', function(event, floor) {
        if (typeof floor == 'string') {
          var floorId = $.inArray(floor, self.options.ascensorFloorName);
          if (floorId !== -1) self.scrollToFloor(floorId);
        } else if (typeof floor == 'number') {
          if (floor > self.nodeChildren.length) return;
          self.scrollToFloor(floor);
        }
      });

      this.node.on('next', function(event, floor) {
        var dataAttributeDirection = self.nodeChildren.eq(self.floorActive).data(self.dataAttributeMap.next);
        if (isNumber(dataAttributeDirection)) return self.scrollToFloor(dataAttributeDirection);
        self.next();
      });

      this.node.on('prev', function(event, floor) {
        var dataAttributeDirection = self.nodeChildren.eq(self.floorActive).data(self.dataAttributeMap.prev);
        if (isNumber(dataAttributeDirection)) return self.scrollToFloor(dataAttributeDirection);
        self.prev();
      });

      this.node.on('refresh', function() {
        self.refresh();
      });

      this.node.on('remove', function() {
        self.destroy();
      });

      // setup resize & key listener
      $(window).on('resize.ascensor', function(event) {
        self.scrollToFloor(self.floorActive, false);
      });

      // If floorName, add hashchange listener
      if (isObject(this.options.ascensorFloorName)) {
        $(window).on('hashchange.ascensor', function(event) {
          self._hashchangeHandler(event);
        });
      }

      // Detect orientation change, for device
      if (window.DeviceOrientationEvent) {
        $(window).on('orientationchange.ascensor', function(event) {
          self.scrollToFloor(self.floorActive);
        });
      }

      if (this.options.keyNavigation) {
        $(document).on('keydown.ascensor', function(event) {
          self._keypressHandler(event);
        });
      }

      if (this.options.wheelNavigation) {
        this.node.on('mousewheel.ascensor DOMMouseScroll.ascensor wheel.ascensor', function(e) {
          setTimeout(function() {
            if (!self.scrollInChildren) self._handleMouseWheelEvent(e);
          }, 10);
        });

        this.nodeChildren.on('scroll.ascensor', function(e) {
          self.scrollInChildren = true;
          if (self.scrollTimeOut) clearTimeout(self.scrollTimeOut);
          self.scrollTimeOut = setTimeout(function() {
            self.scrollInChildren = false;
          }, 300);
        });
      }

      // If swipe event option is true || string
      if (this.options.swipeNavigation) {

        var touchEvent = 'touchstart.ascensor touchend.ascensor touchcancel.ascensor';

        // If mobile-only, only use touchstart/end event				
        if (this.options.swipeNavigation !== 'mobile-only') touchEvent += ' mousedown.ascensor mouseup.ascensor';

        // Listen to touch event
        this.node.on(touchEvent, function(event) {
          self._handleTouchEvent(event);
        });
      }
    },

    refresh: function() {
      this.nodeChildren = this.node.children(this.options.childType);
      this._positionElement();
    },

    /* Remove method*/
    destroy: function() {

      // Unbind all binded event
      this.nodeChildren.off('scroll.ascensor');
      this.node.off('mousewheel.ascensor DOMMouseScroll.ascensor wheel.ascensor scrollToDirection scrollToStage next prev refresh remove touchstart.ascensor touchend.ascensor mousedown.ascensor mouseup.ascensor touchcancel.ascensor');
      $(window).off('resize.ascensor hashchange.ascensor orientationchange.ascensor');
      $(document).off('keydown.ascensor');

      // Remove css
      this.node.css({
        'position': '',
        'overflow': '',
        'top': '',
        'left': '',
        'width': '',
        'height': ''
      });

      this.nodeChildren.css({
        'position': '',
        'overflow': '',
        'top': '',
        'left': '',
        'width': '',
        'height': '',
        'transform': ''
      });

      // Remove plugin instance
      this.node.removeData();
    },

    _handleMouseWheelEvent: function(event) {
      if (this.node.is(':animated')) return;

      this.scrollTime = new Date().getTime();

      if (!this.lastScrollTime || this.scrollTime - this.lastScrollTime > this.options.wheelNavigationDelay) {
        this.lastScrollTime = this.scrollTime;
        return;
      }

      this.lastScrollTime = this.scrollTime;

      var deltaY, deltaX, delta;
      if ('detail' in event.originalEvent) {
        deltaY = event.originalEvent.detail * -1;
      }
      if ('wheelDelta' in event.originalEvent) {
        deltaY = event.originalEvent.wheelDelta;
      }
      if ('wheelDeltaY' in event.originalEvent) {
        deltaY = event.originalEvent.wheelDeltaY;
      }
      if ('wheelDeltaX' in event.originalEvent) {
        deltaX = event.originalEvent.wheelDeltaX * -1;
      }

      // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
      if ('axis' in event.originalEvent && event.originalEvent.axis === event.originalEvent.HORIZONTAL_AXIS) {
        deltaX = deltaY * -1;
        deltaY = 0;
      }

      // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
      delta = deltaY === 0 ? deltaX : deltaY;

      // New school wheel delta (wheel event)
      if ('deltaY' in event.originalEvent) {
        deltaY = event.originalEvent.deltaY * -1;
        delta = deltaY;
      }
      if ('deltaX' in event.originalEvent) {
        deltaX = event.originalEvent.deltaX;
        if (deltaY === 0) {
          delta = deltaX * -1;
        }
      }

      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) this.scrollToDirection('left');
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) this.scrollToDirection('right');
      if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) this.scrollToDirection('up');
      if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) this.scrollToDirection('down');

    },


    /* Touch event handler */
    _handleTouchEvent: function(event) {
      var self = this;
      switch (event.type) {

        // On touch/mouse down
        case 'touchstart':
        case 'mousedown':

          // save time & original position for X/Y
          this.touchStartTime = new Date().getTime();
          this.touchStartX = (event.type == 'touchstart') ? event.originalEvent.touches[0].pageX : event.pageX;
          this.touchStartY = (event.type == 'touchstart') ? event.originalEvent.touches[0].pageY : event.pageY;
          break;

          // On touch/mousedown
        case 'touchend':
        case 'touchcancel':
        case 'mouseup':

          // Save time & final position for X/Y
          this.touchEndTime = new Date().getTime();
          this.touchEndX = (event.type == 'touchend' || event.type == 'touchcancel') ? event.originalEvent.changedTouches[0].pageX : event.pageX;
          this.touchEndY = (event.type == 'touchend' || event.type == 'touchcancel') ? event.originalEvent.changedTouches[0].pageY : event.pageY;

          // calculate distance, duration & velocity.
          var distanceX = this.touchStartX - this.touchEndX;
          var distanceY = this.touchStartY - this.touchEndY;
          var duration = this.touchEndTime - this.touchStartTime;
          var velocityX = Math.abs(distanceX) / duration;
          var velocityY = Math.abs(distanceY) / duration;

          // If velocity, use absolute distance to determine axis
          // and compare distance to 0 determine direction
          if (velocityX > this.options.swipeVelocity && Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) this.scrollToDirection('left');
          if (velocityX > this.options.swipeVelocity && Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) this.scrollToDirection('right');
          if (velocityY > this.options.swipeVelocity && Math.abs(distanceX) < Math.abs(distanceY) && distanceY < 0) this.scrollToDirection('up');
          if (velocityY > this.options.swipeVelocity && Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 0) this.scrollToDirection('down');

          break;
      }
    },



    /* Position floor on dom */
    _positionElement: function() {
      var self = this;
      if (this.directionIsArray) this._generateFloorMap();

      // Setup floor size & position
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

      // place element correctly
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
    },


    /* Helper : Return floor index from hash. */
    _getFloorFromHash: function() {
      if (this._getHash()) {
        if (this.options.ascensorFloorName && existInArray(this.options.ascensorFloorName, this._getHash())) {
          return this.options.ascensorFloorName.indexOf(this._getHash());
        }
      }
      return false;
    },


    /* Helper : Return floor index from hash. */
    _getHash: function() {
      if (window.location.hash) {
        var hash = window.location.hash.split('#').pop();
        return hash;
      }
      return false;
    },


    /* Hanlder: Handle window hashcange event */
    _hashchangeHandler: function(event) {
      if (isNumber(this._getFloorFromHash()) && this._getFloorFromHash() !== this.floorActive && !this.node.is(':animated')) {
        this.scrollToFloor(this._getFloorFromHash());
      }
    },


    /* Will update hash location if floor name are setup. */
    _updateHash: function(floorIndex) {
      if (isObject(this.options.ascensorFloorName) && this._getHash() !== this.options.ascensorFloorName[floorIndex]) {
        window.location.replace(('' + window.location).split('#')[0] + '#' + this.options.ascensorFloorName[floorIndex]);
      }
    },


    /* Event helper, let ascensor create own event, with floor information */
    _emitEvent: function(eventName, from, to) {
      this.node.trigger(eventName, floor = {
        from: from,
        to: to
      });
    },


    /* Warn handler */
    _emitConsoleMessage: function(type, warn) {
      if (type == "error") console.error("Ascensor.js: " + warn);
      if (type == "warn") console.warn("Ascensor.js: " + warn);
    },


    /* Keypress Handler */
    _keypressHandler: function(e) {
      var self = this;
      var key = e.keyCode || e.which;
      if (!$('input, textarea, button').is(':focus')) {
        switch (key) {
          case 40:
          case 83:
            self.scrollToDirection('down');
            break;
          case 38:
          case 87:
            self.scrollToDirection('up');
            break;

          case 37:
          case 65:
            self.scrollToDirection('left');
            break;

          case 39:
          case 68:
            self.scrollToDirection('right');
            break;
        }
      }
    },


    /* Resize handler. Update scrollTop & scrollLeft position */
    scrollToFloor: function(floor) {

      // If floor send is a tring, check if it match any of ascensorFloorName, then use poistion in array
      if (isString(floor) && existInArray(this.options.ascensorFloorName, floor)) floor = this.options.ascensorFloorName.indexOf(floor);

      var self = this;
      var animate = (floor === this.floorActive) ? false : true;

      if (this.NW !== this.node.width()) this.NW = this.node.width();
      if (this.NH !== this.node.height()) this.NH = this.node.height();

      // Make sure position is correct
      var animationObject = this._getAnimationSettings(floor);

      if (animate) {
        this._emitEvent('scrollStart', self.floorActive, floor);
        this.node.stop().animate(animationObject.property, self.options.time, self.options.easing, animationObject.callback);
      } else {
        this.node.stop().scrollTop(animationObject.defaults.scrollTop).scrollLeft(animationObject.defaults.scrollLeft);
      }

      this.floorActive = floor;
      this.node.data('current-floor', this.floorActive);

    },


    /* Prev function */
    prev: function() {
      var targetFloor = this.floorActive - 1;
      if (targetFloor < 0) {
        if (!this.options.loop) return;
        targetFloor = this.nodeChildren.length - 1;
      }
      this.scrollToFloor(targetFloor);
    },


    /* Prev function */
    next: function() {
      var targetFloor = this.floorActive + 1;
      if (targetFloor > this.nodeChildren.length - 1) {
        if (!this.options.loop) return;
        targetFloor = 0;
      }

      this.scrollToFloor(targetFloor);
    },


    /* Helper to generate animation settings */
    _getAnimationSettings: function(floor) {
      var self = this;
      var saveFloorActive = self.floorActive;
      // Create animation setting object
      var animationSettings = {
        property: {},
        callback: function() {
          self._emitEvent('scrollEnd', saveFloorActive, floor);
          self._updateHash(floor);
        },
        defaults: {}
      };


      // Create a second setting object
      // in case the queued option is set
      var secondAnimationSettings = {
        property: {},
        callback: function() {
          self._emitEvent('scrollEnd', saveFloorActive, floor);
          self._updateHash(floor);
        }
      };

      animationSettings.defaults.scrollTop = floor * self.NH;
      animationSettings.defaults.scrollLeft = floor * self.NW;

      // If direction is vertical
      // => set scrollTop property & return animationSettings
      if (self.options.direction === 'y') {
        animationSettings.property.scrollTop = floor * self.NH;
        return animationSettings;
      }


      // If direction is horizontal	
      // => set scrollleft property & return animationSettings
      else if (self.options.direction === 'x') {
        animationSettings.property.scrollLeft = floor * self.NW;
        return animationSettings;
      }

      // If direction is a map
      else if (self.directionIsArray) {

        // => Save value
        var scrollTopValue = self.options.direction[floor][self.AXIS_Y] * self.NH;
        var scrollLeftValue = self.options.direction[floor][self.AXIS_X] * self.NW;

        animationSettings.defaults.scrollTop = scrollTopValue;
        animationSettings.defaults.scrollLeft = scrollLeftValue;


        // If the queued option is set
        if (self.options.queued) {

          // => Check floor position, to avoid animation if already on same floor
          var sameXposition = this.node.scrollLeft() === scrollLeftValue;
          var sameYposition = this.node.scrollTop() === scrollTopValue;


          // If queued direction is horizontal & on the same floor
          // => Set scrollTop property & return animationSettings
          if (self.options.queued === 'x' && sameXposition) {
            animationSettings.property.scrollTop = scrollTopValue;
            return animationSettings;
          }


          // If queued direction is horizontal & NOT on the same floor
          // => Set scrollLeft property
          // => Set callback to a second animation (scrollTop)
          // => return animationSettings
          else {
            animationSettings.property.scrollLeft = scrollLeftValue;
            secondAnimationSettings.property.scrollTop = scrollTopValue;
            animationSettings.callback = function() {
              self.node.stop().animate(secondAnimationSettings.property, self.options.time, self.options.easing, secondAnimationSettings.callback);
            };
            return animationSettings;
          }


          // If queued direction is vertical & on the same floor
          // => Set scrollTop scrollLeft & return animationSettings
          if (self.options.queued === 'y' && sameYposition) {
            animationSettings.property.scrollLeft = scrollLeftValue;
            return animationSettings;
          }


          // If queued direction is vertical & NOT on the same floor
          // => Set scrollTop property
          // => Set callback to a second animation (scrollLeft)
          // => return animationSettings
          else {
            animationSettings.property.scrollTop = scrollTopValue;
            secondAnimationSettings.property.scrollLeft = scrollLeftValue;
            animationSettings.callback = function() {
              self.node.stop().animate(secondAnimationSettings.property, self.options.time, self.options.easing, secondAnimationSettings.callback);
            };
            return animationSettings;
          }

        }

        // If queud option is not set, 
        // => set scrollTop & ScrollLeft property 
        // => return animationSettings
        else {
          animationSettings.property.scrollTop = scrollTopValue;
          animationSettings.property.scrollLeft = scrollLeftValue;
          return animationSettings;
        }
      }

      return animationSettings;
    },


    /* Helper to handle direction correctly. */
    scrollToDirection: function(direction) {
      var self = this;

      // If a data attribute with current direction
      // is found, use it.
      var dataAttributeDirection = this.nodeChildren.eq(this.floorActive).data(this.dataAttributeMap[direction]);
      if (isNumber(dataAttributeDirection)) return self.scrollToFloor(dataAttributeDirection);

      var directionIsHorizontal = (direction == 'right' || direction == 'left');
      var directionIsVertical = (direction == 'down' || direction == 'up');

      // If direction is x or y and there is 
      // direction are opppsite, return here
      if ((self.options.direction == 'y' && directionIsHorizontal) || (self.options.direction == 'x' && directionIsVertical)) return;

      // If direction is x or x, and 
      // direction match, use prev/next
      if ((self.options.direction == 'y' && direction == 'down') || (self.options.direction == 'x' && direction == 'right')) return self.next();
      if ((self.options.direction == 'y' && direction == 'up') || (self.options.direction == 'x' && direction == 'left')) return self.prev();


      if (self.directionIsArray) {

        var floorObject = self.floorMap[self.floorActive];

        // If existing, return appending floor
        var directFloor = floorObject[direction];
        if (isNumber(directFloor)) return self.scrollToFloor(directFloor);

        // Jump is set to true, use the 
        // closest floor in that same direction
        var closestFloor = floorObject.closest[direction];
        if (isTrue(self.options.jump) && isNumber(closestFloor)) return self.scrollToFloor(closestFloor);

        // If loop is set to true, use
        //	the furthest floor
        var furthestFloor = floorObject.furthest[direction];
        if (isNumber(furthestFloor) && (isTrue(self.options.loop) || (directionIsHorizontal && self.options.loop == 'loop-x') || (directionIsVertical && self.options.loop == 'loop-y'))) {
          return self.scrollToFloor(furthestFloor);
        }

        // If Increment exist & option is set
        var incrementFloor = floorObject.increment[direction];
        if (isNumber(incrementFloor)) {

          if (self.options.loop == 'increment' || directionIsVertical && self.options.loop == 'increment-y' || directionIsHorizontal && self.options.loop == 'increment-x') {
            return self.scrollToFloor(incrementFloor);
          }
        }

        // Jump from last to first or first to last
        if ((self.options.loop == 'increment-x' && directionIsHorizontal) || self.options.loop == 'increment') {
          if (self.floorActive == self.floorMap.furthest_x) return self.scrollToFloor(self.floorMap.closest_x);
          if (self.floorActive == self.floorMap.closest_x) return self.scrollToFloor(self.floorMap.furthest_x);
        }

        if ((self.options.loop == 'increment-y' && directionIsVertical) || self.options.loop == 'increment') {
          if (self.floorActive == self.floorMap.furthest_y) return self.scrollToFloor(self.floorMap.closest_y);
          if (self.floorActive == self.floorMap.closest_y) return self.scrollToFloor(self.floorMap.furthest_y);
        }
      }
    },



    /* Helper to get the direct appending floor in one precise direction direction */
    _getDirectFloorIndex: function(DA, floorIndex, direction) {
      var self = this;

      // Create floor target array base on floorobject
      var floorTarget = [this.options.direction[floorIndex][this.AXIS_Y], this.options.direction[floorIndex][this.AXIS_X]];

      // Adjust map depending on direction
      if (direction == 'right') floorTarget[this.AXIS_X] += 1;
      if (direction == 'left') floorTarget[this.AXIS_X] -= 1;
      if (direction == 'up') floorTarget[this.AXIS_Y] -= 1;
      if (direction == 'down') floorTarget[this.AXIS_Y] += 1;

      // loopand compare direction map
      var floorTargetIndex = false;
      $.each(DA, function(index, map) {

        // If current object map value are equal to target one
        if (map[self.AXIS_Y] == floorTarget[self.AXIS_Y] && map[self.AXIS_X] == floorTarget[self.AXIS_X]) {

          // Get index & break loop
          floorTargetIndex = index;
          return false;
        }
      });

      return floorTargetIndex;
    },

    /* Return correct axis depending on position */
    _getAxisFromDirection: function(direction) {
      var self = this;
      var axis;
      switch (direction) {
        case 'up':
        case 'down':
          axis = self.AXIS_Y;
          break;
        case 'left':
        case 'right':
          axis = self.AXIS_X;
          break;
      }

      return axis;
    },

    /* Helper to get the closest floor in one precise direction direction */
    _getClosestFloorIndex: function(DA, floorIndex, direction, level) {
      var self = this;

      level = level || 0;

      // Get axis & compare-to floorIndex
      var axis = this._getAxisFromDirection(direction);
      var goal = DA[floorIndex][axis];
      var oppositeAxis = (axis == this.AXIS_Y) ? this.AXIS_X : this.AXIS_Y;

      // Setup loop variable
      var closestIndex = false;
      var closestMap = false;

      // Loop trough floor position array
      $.each(DA, function(index, map) {

        // If on same axis
        if (map[oppositeAxis] == (DA[floorIndex][oppositeAxis] + level)) {

          // If direction is foward (right or down) and the value is bigger than goal 
          // of if direction is backward (left or up) and the value is smaller than the goal
          if (((direction == 'right' || direction == 'down') && map[axis] > goal) || ((direction == 'left' || direction == 'up') && map[axis] < goal)) {


            // No previous value set or if the current
            // value is smaller than the previous one					 
            if (!closestMap || Math.abs(map[axis] - goal) < Math.abs(closestMap[axis])) {
              closestIndex = index;
              closestMap = map;
            }
          }
        }
      });

      // return index
      return closestIndex;
    },


    /* Helper to get the furthest floor in one precise direction direction */
    _getFurthestFloorIndex: function(DA, floorIndex, direction, level) {
      var self = this;

      level = level || 0;

      // Get axis & compare-to floorIndex
      var axis = this._getAxisFromDirection(direction);
      var goal = DA[floorIndex][axis];
      var oppositeAxis = (axis == this.AXIS_Y) ? this.AXIS_X : this.AXIS_Y;

      // Setup loop variable
      var furthestMap = false;
      var furthestIndex = false;

      // Loop trough floor position array
      $.each(DA, function(index, map) {

        // If on same axis
        if (map[oppositeAxis] == (DA[floorIndex][oppositeAxis] + level)) {

          // If on same axis
          if (!furthestMap || (Math.abs(map[axis] - goal) > Math.abs(furthestMap[axis] - goal))) {
            furthestMap = map;
            furthestIndex = index;
          }
        }
      });

      // return index
      return furthestIndex;

    },

    /* Use to access quickly later, avoiding looping through every direction every time */
    _generateFloorMap: function() {
      var self = this;

      this.floorMap = [];

      // Create map only for floor present in the dom
      var DA = jQuery.grep(self.options.direction, function(directionArray, index) {
        return self.nodeChildren.length > index;
      });

      // Loop on the diration array and get 
      // the floor ID for each direction
      $.each(DA, function(index, floorItem) {
        self.floorMap[index] = {
          'down': self._getDirectFloorIndex(DA, index, 'down'),
          'up': self._getDirectFloorIndex(DA, index, 'up'),
          'right': self._getDirectFloorIndex(DA, index, 'right'),
          'left': self._getDirectFloorIndex(DA, index, 'left'),
          'increment': {
            'down': self._getFurthestFloorIndex(DA, index, 'down', 1),
            'up': self._getFurthestFloorIndex(DA, index, 'up', -1),
            'right': self._getFurthestFloorIndex(DA, index, 'right', 1),
            'left': self._getFurthestFloorIndex(DA, index, 'left', -1)
          },
          'closest': {
            'down': self._getClosestFloorIndex(DA, index, 'down'),
            'up': self._getClosestFloorIndex(DA, index, 'up'),
            'right': self._getClosestFloorIndex(DA, index, 'right'),
            'left': self._getClosestFloorIndex(DA, index, 'left')
          },
          'furthest': {
            'down': self._getFurthestFloorIndex(DA, index, 'down'),
            'up': self._getFurthestFloorIndex(DA, index, 'up'),
            'right': self._getFurthestFloorIndex(DA, index, 'right'),
            'left': self._getFurthestFloorIndex(DA, index, 'left')
          }
        };
      });

      function getFurtherFloorArray(floorArray, axis) {
        var furtherFloor = false;
        jQuery.each(floorArray, function(index, DA) {
          if (furtherFloor === false || furtherFloor[axis] < DA[axis]) {
            furtherFloor = DA;
          }
        });
        return furtherFloor;
      }

      function getClosestFloorOnAxis(floorArray, axis) {
        var furtherFloor = false;
        jQuery.each(floorArray, function(index, DA) {
          if (furtherFloor === false || furtherFloor[axis] > DA[axis]) {
            furtherFloor = DA;
          }
        });
        return furtherFloor;
      }

      function getSameAxisFloor(floorItem, axis) {
        return jQuery.grep(DA, function(DA) {
          var isOnSameAxis = DA[axis] == floorItem[axis];
          return isOnSameAxis;
        });
      }

      var approximateFurtherX = getFurtherFloorArray(DA, self.AXIS_X);
      var sameAxisXFurthest = getSameAxisFloor(approximateFurtherX, self.AXIS_X);
      var furtherY = getFurtherFloorArray(sameAxisXFurthest, self.AXIS_Y);

      var approximateFurtherY = getFurtherFloorArray(DA, self.AXIS_Y);
      var sameAxisYFurthest = getSameAxisFloor(approximateFurtherY, self.AXIS_Y);
      var furtherX = getFurtherFloorArray(sameAxisYFurthest, self.AXIS_X);

      self.floorMap.furthest_x = DA.indexOf(furtherX);
      self.floorMap.furthest_y = DA.indexOf(furtherY);

      var approximateClosestX = getClosestFloorOnAxis(DA, self.AXIS_X);
      var sameAxisXClosest = getSameAxisFloor(approximateClosestX, self.AXIS_X);
      var closestY = getClosestFloorOnAxis(sameAxisXClosest, self.AXIS_Y);

      var approximateClosestY = getClosestFloorOnAxis(DA, self.AXIS_Y);
      var sameAxisYClosest = getSameAxisFloor(approximateClosestY, self.AXIS_Y);
      var closestX = getClosestFloorOnAxis(sameAxisYClosest, self.AXIS_X);

      self.floorMap.closest_x = DA.indexOf(closestX);
      self.floorMap.closest_y = DA.indexOf(closestY);


    },

  };

  $.fn[pluginName] = function(options) {
    this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Plugin(this, options));
      }
    });

    return this;
  };
})(jQuery, window, document);