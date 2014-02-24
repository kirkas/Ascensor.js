/*
Ascensor.js 
version: 1.8.1 (2014-02-24)
description: Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system
repository: https://github.com/kirkas/Ascensor.js
license: BSD
author: Léo Galley <contact@kirkas.ch>
*/
!function($, window, document, undefined) {
    /* Plugin instance */
    function Plugin(element, options) {
        this.element = element, this.options = $.extend({}, defaults, options), this._defaults = defaults, 
        this._name = pluginName, this.init();
    }
    // From https://gist.github.com/lorenzopolidori/3794226
    function has3d() {
        var support3D, el = document.createElement("p"), transforms = {
            webkitTransform: "-webkit-transform",
            OTransform: "-o-transform",
            msTransform: "-ms-transform",
            MozTransform: "-moz-transform",
            transform: "transform"
        };
        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);
        for (var t in transforms) el.style[t] !== undefined && (el.style[t] = "translate3d(1px,1px,1px)", 
        support3D = window.getComputedStyle(el).getPropertyValue(transforms[t]));
        return document.body.removeChild(el), support3D !== undefined && support3D.length > 0 && "none" !== support3D;
    }
    /* Array helper */
    function existInArray(array, item) {
        var index = array.indexOf(item);
        return -1 !== index ? !0 : !1;
    }
    var pluginName = "ascensor", defaults = {
        ascensorFloorName: null,
        childType: "div",
        windowsOn: 0,
        direction: "y",
        loop: !1,
        width: "100%",
        height: "100%",
        time: 300,
        easing: "linear",
        keyNavigation: !0,
        queued: !1,
        jump: !1,
        ready: !1
    };
    /* Add 'indexOf' helper in case missing (IE8) */
    Array.prototype.indexOf || (Array.prototype.indexOf = function(elt) {
        var len = this.length >>> 0, from = Number(arguments[1]) || 0;
        for (from = 0 > from ? Math.ceil(from) : Math.floor(from), 0 > from && (from += len); len > from; from++) if (from in this && this[from] === elt) return from;
        return -1;
    }), /* Plugin start */
    Plugin.prototype = {
        /* Initialization of plugin */
        init: function() {
            var self = this;
            /* Constant helper*/
            this.AXIS_X = 1, this.AXIS_Y = 0, /* Setup global variable - selector */
            this.node = $(this.element), this.nodeChildren = this.node.children(this.options.childType), 
            this.floorActive = this._getFloorFromHash() ? this._getFloorFromHash() : this.options.windowsOn, 
            this.NH = this.node.height(), this.NW = this.node.width(), /* Setup global variable - helper */
            this.directionIsArray = "object" == typeof this.options.direction, this.supportTransform = has3d(), 
            /* Start the magic */
            this.setup(function() {
                "function" == typeof self.options.ready && self.options.ready();
            });
        },
        /* Magic */
        setup: function(callback) {
            var self = this;
            this.directionIsArray && this._generateFloorMap(), /* Setup floor size & position */
            this.node.css({
                position: "absolute",
                overflow: "hidden",
                top: "0",
                left: "0",
                width: this.options.width,
                height: this.options.height
            }), this.nodeChildren.css({
                position: "absolute",
                overflow: "auto",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%"
            }), /* place element correctly */
            this.nodeChildren.each(function(index) {
                $(this).css(self.supportTransform ? {
                    transform: function() {
                        return "y" === self.options.direction ? "translateY(" + 100 * index + "%)" : "x" === self.options.direction ? "translateX(" + 100 * index + "%)" : self.directionIsArray ? "translateY(" + 100 * self.options.direction[index][self.AXIS_Y] + "%) translateX(" + 100 * self.options.direction[index][self.AXIS_X] + "%)" : void 0;
                    }
                } : {
                    top: function() {
                        return "y" === self.options.direction ? 100 * index + "%" : self.directionIsArray ? 100 * self.options.direction[index][self.AXIS_Y] + "%" : void 0;
                    },
                    left: function() {
                        return "x" === self.options.direction ? 100 * index + "%" : self.directionIsArray ? 100 * self.options.direction[index][self.AXIS_X] + "%" : void 0;
                    }
                });
            }), /* Setup User listener */
            this.node.on("scrollToDirection", function(event, direction) {
                self._handleDirection(direction);
            }), this.node.on("scrollToStage", function(event, floor) {
                if ("string" == typeof floor) {
                    var floorId = $.inArray(floor, self.options.ascensorFloorName);
                    -1 !== floorId && this.scrollToFloor(floorId);
                } else if ("number" == typeof floor) {
                    if (floor > self.nodeChildren.length) return;
                    self.scrollToFloor(floor);
                }
            }), this.node.on("next", function() {
                self.next();
            }), this.node.on("prev", function() {
                self.prev();
            }), this.node.on("refresh", function() {
                self.setup();
            }), /* setup resize & key listener */
            $(window).bind("resize", function() {
                self.scrollToFloor(self.floorActive, !1);
            }), $(window).bind("hashchange", function(event) {
                self._hashchangeHandler(event);
            }), window.DeviceOrientationEvent && $(window).bind("orientationchange", function() {
                self.scrollToFloor(self.floorActive);
            }), this.options.keyNavigation && $(document).bind("keyup keypress", function(event) {
                self._keypressHandler(event);
            }), this.scrollToFloor(self.floorActive), "function" == typeof callback && callback();
        },
        /*
      Helper : Return floor index 
      from hash.
    */
        _getFloorFromHash: function() {
            if (window.location.hash) {
                var hash = window.location.hash.split("#").pop();
                if (this.options.ascensorFloorName && existInArray(this.options.ascensorFloorName, hash)) return this.options.ascensorFloorName.indexOf(hash);
            }
            return !1;
        },
        /*
      Hanlder: Handle window hashcange event
    */
        _hashchangeHandler: function() {
            this._getFloorFromHash() && !this.node.is(":animated") && this.scrollToFloor(self._getFloorFromHash());
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
            var self = this, key = e.keyCode || e.which;
            if (!$("input, textarea, button").is(":focus")) switch (key) {
              case 40:
              case 83:
                self._handleDirection("down");
                break;

              case 38:
              case 87:
                self._handleDirection("up");
                break;

              case 37:
              case 65:
                self._handleDirection("left");
                break;

              case 39:
              case 68:
                self._handleDirection("right");
            }
        },
        /*
      Resize handler.
      Update scrollTop & scrollLeft position
    */
        scrollToFloor: function(floor) {
            var self = this, animate = animate || (floor == this.floorActive ? !1 : !0);
            this.NW !== this.node.width() && (this.NW = this.node.width()), this.NH !== this.node.height() && (this.NH = this.node.height());
            /* Make sure position is correct */
            var animationObject = this._getAnimationSettings(floor);
            animate ? (this._emitEvent("scrollStart", self.floorActive, floor), this.node.stop().animate(animationObject.property, self.options.time, self.options.easing, animationObject.callback)) : this.node.stop().scrollTop(animationObject.property.scrollTop).scrollLeft(animationObject.property.scrollLeft), 
            floor !== this.floorActive && (self.options.ascensorFloorName && window.location.replace(("" + window.location).split("#")[0] + "#" + self.options.ascensorFloorName[floor]), 
            self.floorActive = floor, this.node.data("current-floor", self.floorActive));
        },
        /* Prev function */
        prev: function() {
            var targetFloor = this.floorActive - 1;
            if (0 > targetFloor) {
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
            var self = this, animationSettings = {
                property: {},
                callback: function() {
                    self._emitEvent("scrollEnd", self.floorActive, floor);
                }
            }, secondAnimationSettings = {
                property: {},
                callback: function() {
                    self._emitEvent("scrollEnd", self.floorActive, floor);
                }
            };
            /* 
        If direction is vertical
          set scrollTop property & return animationSettings
      */
            if ("y" === self.options.direction) return animationSettings.property.scrollTop = floor * self.NH, 
            animationSettings;
            if ("x" === self.options.direction) return animationSettings.property.scrollLeft = floor * self.NW, 
            animationSettings;
            if (self.directionIsArray) {
                /*  Save value */
                var scrollTopValue = self.options.direction[floor][self.AXIS_Y] * self.NH, scrollLeftValue = self.options.direction[floor][self.AXIS_X] * self.NW;
                /*  If the queued option is set */
                if (self.options.queued) {
                    /*  Check floor position, to avoid animation if already on same floor */
                    {
                        var sameXposition = this.node.scrollLeft() === scrollLeftValue;
                        this.node.scrollTop() === scrollTopValue;
                    }
                    /*  
            If queued direction is horizontal & on the same floor
              Set scrollTop property & return animationSettings
          */
                    /*  
            If queued direction is horizontal & on the same floor
              Set scrollTop property & return animationSettings
          */
                    return "x" === self.options.queued && sameXposition ? (animationSettings.property.scrollTop = scrollTopValue, 
                    animationSettings) : (animationSettings.property.scrollLeft = scrollLeftValue, secondAnimationSettings.property.scrollTop = scrollTopValue, 
                    animationSettings.callback = function() {
                        self.node.stop().animate(secondAnimationSettings.property, self.options.time, self.options.easing, secondAnimationSettings.callback);
                    }, animationSettings);
                }
                return animationSettings.property.scrollTop = scrollTopValue, animationSettings.property.scrollLeft = scrollLeftValue, 
                animationSettings;
            }
            return animationSettings;
        },
        _handleDirection: function(direction) {
            function isFalse(value) {
                return value === !1;
            }
            var self = this;
            /* If direction is x or y and there is direction are opppsite, return here */
            if (!("y" == self.options.direction && "left" == direction || "x" == self.options.direction && "up" == direction)) {
                /* If direction is x or x, and direction match, use prev/next */
                if ("y" == self.options.direction && "down" == direction || "x" == self.options.direction && "right" == direction) return self.next();
                if ("y" == self.options.direction && "up" == direction || "x" == self.options.direction && "left" == direction) return self.prev();
                if (self.directionIsArray) {
                    var targetId;
                    /* If existing, use direct depending floor */
                    if (isFalse(self.floorMap[self.floorActive][direction])) if (self.options.jump === !0 && self.floorMap[self.floorActive].closest[direction] !== !1) targetId = self.floorMap[self.floorActive].closest[direction]; else if (self.options.loop === !0) targetId = self.floorMap[self.floorActive].furthest[direction]; else if ("loop-x" != self.options.loop || "right" != direction && "left" != direction || self.floorMap[self.floorActive].furthest[direction] === !1) if ("loop-y" != self.options.loop || "down" != direction && "up" != direction || self.floorMap[self.floorActive].furthest[direction] === !1) {
                        if ("string" == typeof self.options.loop) {
                            var correctYDirection = ("down" == direction || "up" == direction) && "increment-y" == self.options.loop, correctXDirection = ("right" == direction || "left" == direction) && "increment-x" == self.options.loop;
                            /* if a increment is possible */
                            if (self.floorMap[self.floorActive].increment[direction] !== !1) (correctYDirection || correctXDirection || "increment" == self.options.loop) && (targetId = self.floorMap[self.floorActive].increment[direction]); else if ("right" == direction || "left" == direction) {
                                if ("increment-y" == self.options.loop) return;
                                self.floorActive == self.floorMap.furthest_x ? targetId = self.floorMap.closest_x : self.floorActive == self.floorMap.closest_x && (targetId = self.floorMap.furthest_x);
                            } else if ("down" == direction || "up" == direction) {
                                if ("increment-x" == self.options.loop) return;
                                self.floorActive == self.floorMap.furthest_y ? targetId = self.floorMap.closest_y : self.floorActive == self.floorMap.closest_y && (targetId = self.floorMap.furthest_y);
                            }
                        }
                    } else targetId = self.floorMap[self.floorActive].furthest[direction]; else targetId = self.floorMap[self.floorActive].furthest[direction]; else targetId = self.floorMap[self.floorActive][direction];
                    "number" == typeof targetId && self.scrollToFloor(targetId);
                }
            }
        },
        _generateFloorMap: function() {
            function getClosestFloor(floor, floorCollection, axis, direction) {
                var goal = floor[axis], closest = !1;
                return $.each(floorCollection, function() {
                    (("right" == direction || "down" == direction) && this[axis] > floor[axis] || ("left" == direction || "up" == direction) && this[axis] < floor[axis]) && (!closest || Math.abs(this[axis] - goal) < Math.abs(closest[axis] - goal)) && (closest = this);
                }), closest && -1 !== directionArray.indexOf(closest) ? directionArray.indexOf(closest) : !1;
            }
            function getfurthestFloor(floor, floorCollection, axis) {
                var goal = floor[axis], furthest = !1;
                return $.each(floorCollection, function() {
                    (!furthest || Math.abs(this[axis] - goal) > Math.abs(furthest[axis] - goal)) && (furthest = this);
                }), furthest && -1 !== directionArray.indexOf(furthest) ? directionArray.indexOf(furthest) : !1;
            }
            function getIncrementedFloor(floorCollection, axis) {
                var goal = 0, floor = !1;
                return $.each(floorCollection, function() {
                    (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) && (floor = this);
                }), floor && -1 !== directionArray.indexOf(floor) ? directionArray.indexOf(floor) : !1;
            }
            function getDecrementedFloor(floorCollection, axis) {
                var goal = 0, floor = !1;
                return $.each(floorCollection, function() {
                    (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) && (floor = this);
                }), floor && -1 !== directionArray.indexOf(floor) ? directionArray.indexOf(floor) : !1;
            }
            function getFloor(x, y, floorOne, floorTwo) {
                return floorOne[0] + x == floorTwo[0] && floorOne[1] + y == floorTwo[1] ? directionArray.indexOf(floorTwo) : !1;
            }
            function getFurtherFloorOnAxis(floorArray, axis) {
                var furtherFloor = !1;
                return jQuery.each(floorArray, function(index, directionArray) {
                    (furtherFloor === !1 || furtherFloor[axis] < directionArray[axis]) && (furtherFloor = directionArray);
                }), furtherFloor;
            }
            function getClosestFloorOnAxis(floorArray, axis) {
                var furtherFloor = !1;
                return jQuery.each(floorArray, function(index, directionArray) {
                    (furtherFloor === !1 || furtherFloor[axis] > directionArray[axis]) && (furtherFloor = directionArray);
                }), furtherFloor;
            }
            function getSameAxisFloor(floorItem, axis) {
                return jQuery.grep(directionArray, function(directionArray) {
                    var isOnSameAxis = directionArray[axis] == floorItem[axis];
                    return isOnSameAxis;
                });
            }
            var self = this;
            this.floorMap = [];
            /* Use only array if chilren is present on stage */
            var directionArray = jQuery.grep(self.options.direction, function(directionArray, index) {
                return self.node.children().length > index;
            }), approximateFurtherX = getFurtherFloorOnAxis(directionArray, 1), sameAxisXFurthest = getSameAxisFloor(approximateFurtherX, 1), furtherY = getFurtherFloorOnAxis(sameAxisXFurthest, 0), approximateFurtherY = getFurtherFloorOnAxis(directionArray, 0), sameAxisYFurthest = getSameAxisFloor(approximateFurtherY, 0), furtherX = getFurtherFloorOnAxis(sameAxisYFurthest, 1);
            this.floorMap.furthest_x = directionArray.indexOf(furtherX), this.floorMap.furthest_y = directionArray.indexOf(furtherY);
            var approximateClosestX = getClosestFloorOnAxis(directionArray, 1), sameAxisXClosest = getSameAxisFloor(approximateClosestX, 1), closestY = getClosestFloorOnAxis(sameAxisXClosest, 0), approximateClosestY = getClosestFloorOnAxis(directionArray, 0), sameAxisYClosest = getSameAxisFloor(approximateClosestY, 0), closestX = getClosestFloorOnAxis(sameAxisYClosest, 1);
            this.floorMap.closest_x = directionArray.indexOf(closestX), this.floorMap.closest_y = directionArray.indexOf(closestY), 
            $.each(directionArray, function(index, floorItem) {
                var axisXfloor = jQuery.grep(directionArray, function(directionArray) {
                    var isOnSameAxis = directionArray[0] == floorItem[0], isCurrentFloor = floorItem == directionArray;
                    return isOnSameAxis && !isCurrentFloor;
                }), axisYfloor = jQuery.grep(directionArray, function(directionArray) {
                    var isOnSameAxis = directionArray[1] == floorItem[1], isCurrentFloor = floorItem == directionArray;
                    return isOnSameAxis && !isCurrentFloor;
                }), directNextXAxis = jQuery.grep(directionArray, function(directionArray) {
                    var isOnSameAxis = directionArray[0] == floorItem[0] + 1;
                    return isOnSameAxis;
                }), directPreviousXAxis = jQuery.grep(directionArray, function(directionArray) {
                    var isOnSameAxis = directionArray[0] == floorItem[0] - 1;
                    return isOnSameAxis;
                }), directNextYAxis = jQuery.grep(directionArray, function(directionArray) {
                    var isOnSameAxis = directionArray[1] == floorItem[1] + 1;
                    return isOnSameAxis;
                }), directPreviousYAxis = jQuery.grep(directionArray, function(directionArray) {
                    var isOnSameAxis = directionArray[1] == floorItem[1] - 1;
                    return isOnSameAxis;
                });
                self.floorMap[index] = {
                    down: !1,
                    up: !1,
                    right: !1,
                    left: !1,
                    increment: {
                        down: getIncrementedFloor(directNextYAxis, 1),
                        up: getDecrementedFloor(directPreviousYAxis, 0),
                        right: getIncrementedFloor(directNextXAxis, 0),
                        left: getDecrementedFloor(directPreviousXAxis, 1)
                    },
                    closest: {
                        down: getClosestFloor(floorItem, axisYfloor, 0, "down"),
                        up: getClosestFloor(floorItem, axisYfloor, 0, "up"),
                        right: getClosestFloor(floorItem, axisXfloor, 1, "right"),
                        left: getClosestFloor(floorItem, axisXfloor, 1, "left")
                    },
                    furthest: {
                        down: getfurthestFloor(floorItem, axisYfloor, 0, "down"),
                        up: getfurthestFloor(floorItem, axisYfloor, 0, "up"),
                        right: getfurthestFloor(floorItem, axisXfloor, 1, "right"),
                        left: getfurthestFloor(floorItem, axisXfloor, 1, "left")
                    }
                }, $.each(directionArray, function(indexSecond, floorItemSecond) {
                    self.floorMap[index].down === !1 && (self.floorMap[index].down = getFloor(1, 0, floorItem, floorItemSecond)), 
                    self.floorMap[index].up === !1 && (self.floorMap[index].up = getFloor(-1, 0, floorItem, floorItemSecond)), 
                    self.floorMap[index].right === !1 && (self.floorMap[index].right = getFloor(0, 1, floorItem, floorItemSecond)), 
                    self.floorMap[index].left === !1 && (self.floorMap[index].left = getFloor(0, -1, floorItem, floorItemSecond));
                });
            });
        }
    }, $.fn[pluginName] = function(options) {
        return this.each(function() {
            $.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }), this;
    };
}(jQuery, window, document);