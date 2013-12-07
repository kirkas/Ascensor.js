/*
Ascensor.js 
version: 1.6.5 (2013-12-07)
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
        loop: !0,
        time: 300,
        easing: "linear",
        keyNavigation: !0,
        touchSwipeIntegration: !1,
        queued: !1
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
        function handleDirection(direction) {
            if ("y" == self.options.direction) {
                if ("left" == direction) return;
                "down" == direction ? self.next() : "up" == direction && prev();
            } else if ("x" == self.options.direction) {
                if ("up" == direction) return;
                "left" == direction ? prev() : "right" == direction && self.next();
            } else chocolate && ("down" == direction ? handleChocolateDirection(1, 0) : "up" == direction ? handleChocolateDirection(-1, 0) : "left" == direction ? handleChocolateDirection(0, -1) : "right" == direction && handleChocolateDirection(0, 1));
        }
        function prev() {
            var prevFloor = floorActive - 1;
            if (0 > prevFloor) {
                if (!self.options.loop) return;
                prevFloor = floorCounter;
            }
            scrollToStage(prevFloor, self.options.time);
        }
        function handleChocolateDirection(addCoordY, addCoordX) {
            var floorReference = [ self.options.direction[floorActive][0] + addCoordY, self.options.direction[floorActive][1] + addCoordX ];
            $.each(self.options.direction, function(index) {
                "" + floorReference == "" + self.options.direction[index] && scrollToStage(index, self.options.time);
            });
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
        $(document)), $window = $(window), chocolate = "object" == typeof self.options.direction;
        if (this.next = function() {
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
            prev();
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
        }), node.data("current-floor", floorActive), self.options.keyNavigation && $document.keydown(checkKey), 
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