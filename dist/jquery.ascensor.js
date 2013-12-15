/*
Ascensor.js 
version: 1.7 (2013-12-15)
description: Ascensor is a jquery plugin which aims to train and adapt content according to an elevator system
repository: https://github.com/kirkas/Ascensor.js
license: BSD
author: Léo Galley <contact@kirkas.ch>
*/
(function($, window, document) {
    /*
    Create plugin instance
  */
    function Plugin(element, options) {
        this.element = element, this.options = $.extend({}, defaults, options), this._defaults = defaults, 
        this._name = pluginName, this.init();
    }
    var pluginName = "ascensor", defaults = {
        ascensorFloorName: null,
        childType: "div",
        windowsOn: 0,
        direction: "y",
        loop: !1,
        time: 300,
        easing: "linear",
        keyNavigation: !0,
        touchSwipeIntegration: !1,
        queued: !1,
        jump: !1
    };
    Plugin.prototype.init = function() {
        function resize() {
            WW = $window.width(), WH = $window.height(), nodeChildren.width(WW).height(WH), 
            node.width(WW).height(WH), "y" === self.options.direction && node.stop().scrollTop(floorActive * WH), 
            "x" === self.options.direction && (node.stop().scrollLeft(floorActive * WW), nodeChildren.each(function(index) {
                $(this).css("left", index * WW);
            })), chocolate && (nodeChildren.each(function(index) {
                $(this).css({
                    left: self.options.direction[index][1] * WW,
                    top: self.options.direction[index][0] * WH
                });
            }), scrollToStage(floorActive, 1), node.stop().scrollLeft(self.options.direction[floorActive][1] * WW).scrollTop(self.options.direction[floorActive][0] * WH));
        }
        function generateFloorMap() {
            function getClosestFloor(floor, floorCollection, axis, direction) {
                var goal = floor[axis], closest = !1;
                return $.each(floorCollection, function() {
                    (("right" == direction || "down" == direction) && this[axis] > floor[axis] || ("left" == direction || "up" == direction) && this[axis] < floor[axis]) && (!closest || Math.abs(this[axis] - goal) < Math.abs(closest[axis] - goal)) && (closest = this);
                }), closest && -1 !== self.options.direction.indexOf(closest) ? self.options.direction.indexOf(closest) : !1;
            }
            function getfurthestFloor(floor, floorCollection, axis) {
                var goal = floor[axis], furthest = !1;
                return $.each(floorCollection, function() {
                    (!furthest || Math.abs(this[axis] - goal) > Math.abs(furthest[axis] - goal)) && (furthest = this);
                }), furthest && -1 !== self.options.direction.indexOf(furthest) ? self.options.direction.indexOf(furthest) : !1;
            }
            function getIncrementedFloor(floorCollection, axis) {
                var goal = 0, floor = !1;
                return $.each(floorCollection, function() {
                    (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) && (floor = this);
                }), floor && -1 !== self.options.direction.indexOf(floor) ? self.options.direction.indexOf(floor) : !1;
            }
            function getDecrementedFloor(floorCollection, axis) {
                var goal = 0, floor = !1;
                return $.each(floorCollection, function() {
                    (!floor || Math.abs(this[axis] - goal) > Math.abs(floor[axis] - goal)) && (floor = this);
                }), floor && -1 !== self.options.direction.indexOf(floor) ? self.options.direction.indexOf(floor) : !1;
            }
            function getFloor(x, y, floorOne, floorTwo) {
                return floorOne[0] + x == floorTwo[0] && floorOne[1] + y == floorTwo[1] ? self.options.direction.indexOf(floorTwo) : !1;
            }
            $.each(self.options.direction, function(index, floorItem) {
                var axisXfloor = jQuery.grep(self.options.direction, function(directionArray) {
                    var isOnSameAxis = directionArray[0] == floorItem[0], isCurrentFloor = floorItem == directionArray;
                    return isOnSameAxis && !isCurrentFloor;
                }), axisYfloor = jQuery.grep(self.options.direction, function(directionArray) {
                    var isOnSameAxis = directionArray[1] == floorItem[1], isCurrentFloor = floorItem == directionArray;
                    return isOnSameAxis && !isCurrentFloor;
                }), directNextXAxis = jQuery.grep(self.options.direction, function(directionArray) {
                    var isOnSameAxis = directionArray[0] == floorItem[0] + 1;
                    return isOnSameAxis;
                }), directPreviousXAxis = jQuery.grep(self.options.direction, function(directionArray) {
                    var isOnSameAxis = directionArray[0] == floorItem[0] - 1;
                    return isOnSameAxis;
                }), directNextYAxis = jQuery.grep(self.options.direction, function(directionArray) {
                    var isOnSameAxis = directionArray[1] == floorItem[1] + 1;
                    return isOnSameAxis;
                }), directPreviousYAxis = jQuery.grep(self.options.direction, function(directionArray) {
                    var isOnSameAxis = directionArray[1] == floorItem[1] - 1;
                    return isOnSameAxis;
                });
                floorMap[index] = {
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
                }, $.each(self.options.direction, function(indexSecond, floorItemSecond) {
                    floorMap[index].down === !1 && (floorMap[index].down = getFloor(1, 0, floorItem, floorItemSecond)), 
                    floorMap[index].up === !1 && (floorMap[index].up = getFloor(-1, 0, floorItem, floorItemSecond)), 
                    floorMap[index].right === !1 && (floorMap[index].right = getFloor(0, 1, floorItem, floorItemSecond)), 
                    floorMap[index].left === !1 && (floorMap[index].left = getFloor(0, -1, floorItem, floorItemSecond));
                });
            });
        }
        function handleDirection(direction) {
            if ("y" == self.options.direction) {
                if ("left" == direction) return;
                "down" == direction ? self.next() : "up" == direction && self.prev();
            } else if ("x" == self.options.direction) {
                if ("up" == direction) return;
                "left" == direction ? self.prev() : "right" == direction && self.next();
            } else if (chocolate) {
                var targetId;
                floorMap[floorActive][direction] !== !1 ? targetId = floorMap[floorActive][direction] : self.options.jump === !0 && floorMap[floorActive].closest[direction] !== !1 ? targetId = floorMap[floorActive].closest[direction] : self.options.loop === !0 && floorMap[floorActive].furthest[direction] !== !1 ? targetId = floorMap[floorActive].furthest[direction] : "increment" === self.options.loop && floorMap[floorActive].increment[direction] !== !1 ? targetId = floorMap[floorActive].increment[direction] : "increment-x" !== self.options.loop || "right" != direction && "left" != direction || floorMap[floorActive].increment[direction] === !1 ? "increment-y" !== self.options.loop || "down" != direction && "up" != direction || floorMap[floorActive].increment[direction] === !1 ? "loop-x" != self.options.loop || "right" != direction && "left" != direction || floorMap[floorActive].furthest[direction] === !1 ? "loop-y" != self.options.loop || "down" != direction && "up" != direction || floorMap[floorActive].furthest[direction] === !1 || (targetId = floorMap[floorActive].furthest[direction]) : targetId = floorMap[floorActive].furthest[direction] : targetId = floorMap[floorActive].increment[direction] : targetId = floorMap[floorActive].increment[direction], 
                "number" == typeof targetId && scrollToStage(targetId, self.options.time);
            }
        }
        function getFloorFromHash() {
            if (window.location.hash) {
                hash = window.location.hash.split("/").pop();
                var floor = !1;
                return $(self.options.ascensorFloorName).each(function(index) {
                    hash === self.options.ascensorFloorName[index] && (floor = index);
                }), floor;
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
            if ("y" === self.options.direction) animationParams.property = {
                scrollTop: floor * WH
            }; else if ("x" === self.options.direction) animationParams.property = {
                scrollLeft: floor * WW
            }; else if (chocolate && (animationParams.property = {
                scrollLeft: self.options.direction[floor][1] * WW,
                scrollTop: self.options.direction[floor][0] * WH
            }, self.options.queued)) {
                var sameXposition = node.scrollLeft() === self.options.direction[floor][1] * WW, sameYposition = node.scrollTop() === self.options.direction[floor][0] * WH;
                "x" === self.options.queued ? sameXposition ? animationParams.property = {
                    scrollTop: self.options.direction[floor][0] * WH
                } : (animationParams.property = {
                    scrollLeft: self.options.direction[floor][1] * WW
                }, animationParams.callback = function() {
                    node.stop().animate({
                        scrollTop: self.options.direction[floor][0] * WH
                    }, time, self.options.easing, function() {
                        scrollEnd(floorActive, floor);
                    });
                }) : "y" === self.options.queued && (sameYposition ? animationParams.property = {
                    scrollLeft: self.options.direction[floor][1] * WW
                } : (animationParams.property = {
                    scrollTop: self.options.direction[floor][0] * WH
                }, animationParams.callback = function() {
                    node.stop().animate({
                        scrollLeft: self.options.direction[floor][1] * WW
                    }, time, self.options.easing, function() {
                        scrollEnd(floorActive, floor);
                    });
                }));
            }
            node.stop().animate(animationParams.property, time, self.options.easing, animationParams.callback), 
            self.options.ascensorFloorName && (window.location.hash = "/" + self.options.ascensorFloorName[floor]), 
            floorActive = floor, node.data("current-floor", floorActive);
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
        function checkKey(e) {
            if (!$("input, textarea, button").is(":focus")) switch (e.which) {
              case 40:
              case 83:
                if ("x" == self.options.direction) return;
                node.trigger("scrollToDirection", "down");
                break;

              case 38:
              case 87:
                if ("x" == self.options.direction) return;
                node.trigger("scrollToDirection", "up");
                break;

              case 37:
              case 65:
                if ("y" == self.options.direction) return;
                node.trigger("scrollToDirection", "left");
                break;

              case 39:
              case 68:
                if ("y" == self.options.direction) return;
                node.trigger("scrollToDirection", "right");
            }
        }
        var //height/width settings
        WW, WH, //hash 
        hash, self = this, node = $(this.element), nodeChildren = node.children(self.options.childType), //floor counter settings
        floorActive = self.options.windowsOn, floorCounter = -1, $document = (self.options.direction, 
        $(document)), $window = $(window), chocolate = "object" == typeof self.options.direction, floorMap = [];
        if (this.prev = function() {
            var prevFloor = floorActive - 1;
            if (0 > prevFloor) {
                if (!self.options.loop) return;
                prevFloor = floorCounter;
            }
            scrollToStage(prevFloor, self.options.time);
        }, this.next = function() {
            var nextFloor = floorActive + 1;
            if (nextFloor > floorCounter) {
                if (!self.options.loop) return;
                nextFloor = 0;
            }
            scrollToStage(nextFloor, self.options.time);
        }, node.on("scrollToDirection", function(event, direction) {
            handleDirection(direction);
        }), node.on("scrollToStage", function(event, floor) {
            if ("string" == typeof floor) {
                var floorId = $.inArray(floor, self.options.ascensorFloorName);
                -1 !== floorId && scrollToStage(floorId, self.options.time);
            } else if ("number" == typeof floor) {
                if (floor > floorCounter) return;
                scrollToStage(floor, self.options.time);
            }
        }), node.on("next", function() {
            self.next();
        }), node.on("prev", function() {
            self.prev();
        }), node.on("refresh", function() {
            (node.children().length > nodeChildren.length || node.children().length < nodeChildren.length) && (nodeChildren = node.children(self.options.childType), 
            ("x" === self.options.direction || chocolate) && nodeChildren.css({
                position: "absolute",
                overflow: "auto"
            }), floorCounter = -1, nodeChildren.each(function() {
                floorCounter += 1;
            }), childrenLenght = node.children().length, node.trigger("refresh"), resize());
        }), node.css({
            position: "absolute"
        }), nodeChildren.each(function() {
            floorCounter += 1;
        }), ("x" === self.options.direction || chocolate) && nodeChildren.css({
            position: "absolute",
            overflow: "auto"
        }), chocolate && generateFloorMap(), node.data("current-floor", floorActive), self.options.keyNavigation && $document.keydown(checkKey), 
        self.options.ascensorFloorName && window.location.hash) {
            var hashFloor = getFloorFromHash();
            hashFloor && (floorActive = hashFloor);
        }
        scrollToStage(floorActive, 1), self.options.touchSwipeIntegration && node.swipe({
            swipe: function(event, direction) {
                node.trigger("scrollToDirection", direction);
            },
            threshold: 70
        }), $window.resize(function() {
            resize();
        }).load(function() {
            resize();
        }).resize(), window.DeviceOrientationEvent && $window.bind("orientationchange", function() {
            resize();
        });
    }, $.fn[pluginName] = function(options) {
        return this.each(function() {
            $.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        });
    };
})(jQuery, window, document);